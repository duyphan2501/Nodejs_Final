import createHttpError from "http-errors";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
} from "../helpers/email.helper.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import bcrypt from "bcryptjs";

const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({
    email,
  });
  return user;
};

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
};

const createNewUser = async (name, email, password) => {
  const newUser = await UserModel.create({ name, email, password });
  if (!newUser) throw new Error("Failed to create new user");
  return newUser;
};

const getUnverifiedUser = async (verificationToken) => {
  return await UserModel.findOne({
    isVerified: false,
    verificationToken,
  });
};

const sendVerificationEmailtoUser = async (user) => {
  // send varification email
  const hours = 24;
  const verificationToken = await sendVerificationEmail(
    user.name,
    user.email,
    hours
  );
  const verificationTokenExpireAt = new Date(
    Date.now() + 1000 * 60 * 60 * hours
  );
  user.verificationToken = verificationToken;
  user.verificationTokenExpireAt = verificationTokenExpireAt;
  await user.save();
};

const sendForgotPasswordEmailtoUser = async (user) => {
  const minutes = 10;
  const token = await sendForgotPasswordEmail(user.name, user.email, minutes);
  const forgotPasswordTokenExpireAt = new Date(
    Date.now() + 1000 * 60 * minutes
  );
  user.forgotPasswordTokenExpireAt = forgotPasswordTokenExpireAt;
  user.forgotPasswordToken = token;
  user.save();
};

const checkPassword = (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const getForgotPasswordUser = async (email, forgotPasswordToken) => {
  return await UserModel.findOne({
    email,
    forgotPasswordToken,
  });
};

const usePurchasePoint = async (userId, point, session = null) => {
  if (point <= 0) {
    return;
  }

  const user = await UserModel.findById(userId).session(session);

  if (!user) {
    throw createHttpError(404, "Người dùng không tồn tại.");
  }

  if (user.purchasePoint < point) {
    throw createHttpError(400, `Điểm thưởng của bạn không đủ.`);
  }

  user.purchasePoint -= point;

  await user.save({ session });

  return user;
};

export {
  getUserByEmail,
  hashPassword,
  createNewUser,
  getUnverifiedUser,
  sendVerificationEmailtoUser,
  sendForgotPasswordEmailtoUser,
  getForgotPasswordUser,
  checkPassword,
  usePurchasePoint,
};

class UserService {
  // Lấy danh sách users với tìm kiếm, lọc và phân trang
  async getUsers(query) {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
      isAdmin = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    // Build filter object
    const filter = {};

    // Tìm kiếm theo name, email, phone
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Lọc theo status
    if (status) {
      filter.status = status;
    }

    // Lọc theo isAdmin
    if (isAdmin !== "") {
      filter.isAdmin = isAdmin === "true";
    }

    // Tính toán pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Thực hiện query
    const users = await UserModel.find(filter)
      .select("-password -refreshToken -verificationToken -forgotPasswordToken")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Đếm tổng số documents
    const total = await UserModel.countDocuments(filter);

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  // Lấy thông tin chi tiết user theo ID
  async getUserById(userId) {
    const user = await UserModel.findById(userId)
      .select("-password -refreshToken -verificationToken -forgotPasswordToken")
      .lean();

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Lấy danh sách địa chỉ của user
    const addresses = await AddressModel.find({ userId }).lean();

    return {
      ...user,
      addresses,
    };
  }

  // Tạo user mới
  async createUser(userData) {
    const { name, email, password, phone, isAdmin, status } = userData;

    // Kiểm tra email đã tồn tại
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      isAdmin: isAdmin || false,
      status: status || "active",
      isVerified: true, // Auto verify khi admin tạo
    });

    // Return user without sensitive data
    return await UserModel.findById(newUser._id)
      .select("-password -refreshToken -verificationToken -forgotPasswordToken")
      .lean();
  }

  // Cập nhật thông tin user
  async updateUser(userId, updateData) {
    const { name, phone, avatar, status, isAdmin } = updateData;

    // Tìm user
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Chỉ update các fields được phép
    const allowedUpdates = {};
    if (name !== undefined) allowedUpdates.name = name;
    if (phone !== undefined) allowedUpdates.phone = phone;
    if (avatar !== undefined) allowedUpdates.avatar = avatar;
    if (status !== undefined) allowedUpdates.status = status;
    if (isAdmin !== undefined) allowedUpdates.isAdmin = isAdmin;

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    )
      .select("-password -refreshToken -verificationToken -forgotPasswordToken")
      .lean();

    return updatedUser;
  }

  // Bulk update status
  async bulkUpdateStatus(userIds, newStatus) {
    if (!["active", "inactive"].includes(newStatus)) {
      throw new Error("Trạng thái không hợp lệ");
    }

    const result = await UserModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { status: newStatus } }
    );

    return {
      modifiedCount: result.modifiedCount,
      message: `Đã cập nhật ${result.modifiedCount} người dùng`,
    };
  }

  // Thêm địa chỉ cho user
  async addAddress(userId, addressData) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Nếu là địa chỉ mặc định, set các địa chỉ khác thành không mặc định
    if (addressData.isDefault) {
      await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const newAddress = await AddressModel.create({
      ...addressData,
      userId,
    });

    return newAddress;
  }

  // Cập nhật địa chỉ
  async updateAddress(addressId, userId, updateData) {
    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      throw new Error("Không tìm thấy địa chỉ");
    }

    // Nếu set làm địa chỉ mặc định
    if (updateData.isDefault) {
      await AddressModel.updateMany(
        { userId, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      );
    }

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return updatedAddress;
  }

  // Xóa địa chỉ
  async deleteAddress(addressId, userId) {
    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      throw new Error("Không tìm thấy địa chỉ");
    }

    await AddressModel.findByIdAndDelete(addressId);
    return { message: "Đã xóa địa chỉ thành công" };
  }

  // Lấy danh sách địa chỉ của user
  async getUserAddresses(userId) {
    const addresses = await AddressModel.find({ userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();
    return addresses;
  }
}

export default new UserService();
