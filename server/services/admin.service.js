// server/services/userService.js
import UserModel from '../models/user.model.js';
import { buildUserFilter, buildSortObject } from '../helpers/query.helper.js';


// ============= USER QUERIES =============

// Lấy danh sách users với filter, pagination
const getUsers = async (queryParams) => {
  const { page, limit, search, status, isAdmin, sortBy, sortOrder } = queryParams;

  // Validate limit
  if (limit > 100) {
    throw new Error('Limit không được vượt quá 100');
  }

  // Build filter và sort
  const filter = buildUserFilter({ search, status, isAdmin });
  const sort = buildSortObject(sortBy, sortOrder);

  // Pagination
  const skip = (page - 1) * limit;

  // Query database
  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .select('-password -forgotPasswordToken -verificationToken -refreshToken')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    UserModel.countDocuments(filter)
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// Lấy user theo ID
const getUserById = async (userId) => {
  const user = await UserModel.findById(userId)
    .select('-password -forgotPasswordToken -verificationToken -refreshToken')
    .lean();

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

// Lấy user theo email
const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email });
  return user;
};

// ============= USER UPDATES =============

// Cập nhật status user
const updateUserStatus = async (userId, status) => {
  // Validation
  if (!['active', 'inactive'].includes(status)) {
    throw new Error('Status không hợp lệ. Chỉ chấp nhận "active" hoặc "inactive"');
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  ).select('-password -forgotPasswordToken -verificationToken -refreshToken');

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

// Cập nhật thông tin user
const updateUser = async (userId, updateData) => {
  // Không cho phép update các field nhạy cảm
  const forbiddenFields = ['password', 'email', 'isAdmin', 'refreshToken', 'verificationToken'];
  forbiddenFields.forEach(field => delete updateData[field]);

  // Validation phone nếu có
  if (updateData.phone && !validatePhone(updateData.phone)) {
    throw new Error('Số điện thoại không hợp lệ');
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-password -forgotPasswordToken -verificationToken -refreshToken');

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

// Cập nhật avatar user
const updateUserAvatar = async (userId, avatarUrl) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { avatar: avatarUrl },
    { new: true }
  ).select('-password -forgotPasswordToken -verificationToken -refreshToken');

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

// Cập nhật purchase point
const updatePurchasePoint = async (userId, points) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $inc: { purchasePoint: points } },
    { new: true }
  ).select('-password -forgotPasswordToken -verificationToken -refreshToken');

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

// ============= BULK OPERATIONS =============

// Bulk update status
const bulkUpdateStatus = async (userIds, status, currentUserId) => {
  if (!['active', 'inactive'].includes(status)) {
    throw new Error('Status không hợp lệ');
  }

  // Loại bỏ currentUserId khỏi danh sách
  const filteredIds = userIds.filter(id => id !== currentUserId);

  if (filteredIds.length === 0) {
    throw new Error('Không có người dùng nào để cập nhật');
  }

  const result = await UserModel.updateMany(
    { _id: { $in: filteredIds } },
    { status }
  );

  return {
    modifiedCount: result.modifiedCount,
    matchedCount: result.matchedCount
  };
};

// ============= STATISTICS =============

// Lấy thống kê users
const getUserStats = async () => {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    adminUsers,
    verifiedUsers,
    newUsersThisMonth
  ] = await Promise.all([
    UserModel.countDocuments(),
    UserModel.countDocuments({ status: 'active' }),
    UserModel.countDocuments({ status: 'inactive' }),
    UserModel.countDocuments({ isAdmin: true }),
    UserModel.countDocuments({ isVerified: true }),
    UserModel.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setDate(1))
      }
    })
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    adminUsers,
    verifiedUsers,
    newUsersThisMonth
  };
};

// Thống kê users theo tháng
const getUserStatsByMonth = async (year) => {
  const stats = await UserModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return stats;
};

// ============= HELPER FUNCTIONS =============

// Validate phone number
const validatePhone = (phone) => {
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  return phoneRegex.test(phone);
};

// Kiểm tra user có tồn tại không
const checkUserExists = async (userId) => {
  const user = await UserModel.findById(userId);
  return !!user;
};

// Đếm số lượng user theo filter
const countUsers = async (filter) => {
  return await UserModel.countDocuments(filter);
};

export {
  // Queries
  getUsers,
  getUserById,
  getUserByEmail,
  
  // Updates
  updateUserStatus,
  updateUser,
  updateUserAvatar,
  updatePurchasePoint,
  
  // Bulk operations
  bulkUpdateStatus,
  
  // Statistics
  getUserStats,
  getUserStatsByMonth,
  
  // Helpers
  validatePhone,
  checkUserExists,
  countUsers
};