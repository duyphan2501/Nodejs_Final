// server/controllers/userController.js
import {
  getUsers as getUsersService,
  getUserById as getUserByIdService,
  updateUserStatus as updateUserStatusService,
  updateUser as updateUserService,
  bulkUpdateStatus as bulkUpdateStatusService,
  getUserStats as getUserStatsService
} from '../services/admin.service.js';

// GET: Lấy danh sách users
export const getUsers = async (req, res, next) => {
  try {
    const queryParams = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || '',
      status: req.query.status || '',
      isAdmin: req.query.isAdmin || '',
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc'
    };

    const result = await getUsersService(queryParams);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách người dùng'
    });
  }
};

// GET: Lấy chi tiết user
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy người dùng'
    });
  }
};

// PUT: Cập nhật status user
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await updateUserStatusService(id, status);

    res.status(200).json({
      success: true,
      data: user,
      message: 'Cập nhật trạng thái thành công'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái'
    });
  }
};

// PUT: Cập nhật thông tin user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await updateUserService(id, updateData);

    res.status(200).json({
      success: true,
      data: user,
      message: 'Cập nhật thông tin thành công'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật thông tin'
    });
  }
};

// GET: Thống kê users
export const getUserStats = async (req, res, next) => {
  try {
    const stats = await getUserStatsService();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thống kê'
    });
  }
};

// PUT: Bulk update status
export const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { userIds, status } = req.body;
    const currentUserId = req.userId;

    const result = await bulkUpdateStatusService(userIds, status, currentUserId);

    res.status(200).json({
      success: true,
      data: result,
      message: `Đã cập nhật ${result.modifiedCount} người dùng`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật hàng loạt'
    });
  }
};