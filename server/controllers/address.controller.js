import AddressModel from "../models/address.model.js";
import mongoose from "mongoose";
import createHttpError from "http-errors";

const createAddress = async (req, res, next) => {
  try {
    const {
      receiver,
      phone,
      province,
      ward,
      addressDetail,
      addressType,
      isDefault,
    } = req.body;

    let userId = req.user?.userId;
    if (!userId) throw createHttpError.BadRequest("Thiếu userId");
    userId = new mongoose.Types.ObjectId(`${userId}`);

    // Validate required fields
    if (!receiver || !phone || !province || !ward || !addressDetail)
      throw createHttpError.BadRequest(
        "Vui lòng điền đầy đủ thông tin địa chỉ."
      );

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      throw createHttpError.BadRequest(
        "Số điện thoại phải đủ 10 số."
      );
    }

    if (!["home", "office"].includes(addressType))
      throw createHttpError.BadRequest("Loại địa chỉ không hợp lệ.");

    // Create new address object
    const newAddress = {
      receiver,
      phone,
      province,
      ward,
      addressType,
      addressDetail,
      isDefault,
      userId,
    };

    if (isDefault) {
      await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });
    }

    // Save the new address to the database
    const savedAddress = await AddressModel.create(newAddress);

    if (!savedAddress)
      throw createHttpError.InternalServerError("Tạo địa chỉ thất bại");

    return res.status(201).json({
      message: "Thêm địa chỉ thành công.",
      addresses: await AddressModel.find({ userId }),
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAddresses = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw createHttpError.BadRequest("Thiếu userId");

    const addresses = await AddressModel.find({ userId });
    return res.status(200).json({ addresses, success: true });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    let userId = req.user?.userId;

    if (!userId) throw createHttpError.BadRequest("Thiếu userId");

    if (!id)
      throw createHttpError.BadRequest("ID địa chỉ không được để trống.");

    const deletedAddress = await AddressModel.findByIdAndDelete(id);

    if (!deletedAddress)
      throw createHttpError.NotFound("Không tìm thấy địa chỉ để xóa.");

    return res.status(200).json({
      message: "Xóa địa chỉ thành công.",
      success: true,
      addresses: await AddressModel.find({ userId }),
    });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const {
      id,
      receiver,
      phone,
      province,
      ward,
      addressDetail,
      addressType,
      isDefault,
    } = req.body;

    const { userId } = req.user;

    if (!id)
      throw createHttpError.BadRequest("ID địa chỉ không được để trống.");

    if (!userId) throw createHttpError.Unauthorized("Thiếu userId");

    if (isDefault) {
      await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      id,
      {
        receiver,
        phone,
        province,
        ward,
        addressDetail,
        addressType,
        isDefault,
      },
      { new: true }
    );

    if (!updatedAddress)
      throw createHttpError.NotFound("Không tìm thấy địa chỉ để cập nhật.");

    return res.status(200).json({
      message: "Cập nhật địa chỉ thành công.",
      addresses: await AddressModel.find({ userId }),
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { createAddress, getAllAddresses, deleteAddress, updateAddress };
