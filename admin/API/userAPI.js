// src/api/userApi.js
import axiosPrivate from './axiosPrivate';

// ============= USER QUERIES =============

// Lấy danh sách users với filter
export const getUsers = async (queryParams = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = '',
      isAdmin = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryParams;

    const response = await axiosPrivate.get('/admin/users', {
      params: { page, limit, search, status, isAdmin, sortBy, sortOrder }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng');
  }
};

// Lấy chi tiết user theo ID
export const getUserById = async (userId) => {
  try {
    const response = await axiosPrivate.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không tìm thấy người dùng');
  }
};

// Lấy thống kê users
export const getUserStats = async () => {
  try {
    const response = await axiosPrivate.get('/admin/users/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy thống kê');
  }
};

// ============= USER UPDATES =============

// Cập nhật status user
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await axiosPrivate.put(`/admin/users/${userId}/status`, {
      status
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
  }
};

// Cập nhật thông tin user
export const updateUser = async (userId, updateData) => {
  try {
    const response = await axiosPrivate.put(`/admin/users/${userId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
  }
};

// ============= BULK OPERATIONS =============

// Bulk update status
export const bulkUpdateStatus = async (userIds, status) => {
  try {
    const response = await axiosPrivate.put('/admin/users/bulk/status', {
      userIds,
      status
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật hàng loạt');
  }
};