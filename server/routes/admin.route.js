// server/routes/adminRoutes.js
import express from 'express';
import checkAuth from '../middlewares/auth.middleware.js';
import {
  getUsers,
  getUserById,
  updateUserStatus,
  updateUser,
  getUserStats,
  bulkUpdateStatus
} from '../controllers/admin.controller.js';


const router = express.Router();

// Protected routes
router.use(checkAuth);

// User routes
router.get('/users/stats', getUserStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id',  updateUser);
router.put('/users/bulk/status', bulkUpdateStatus);

export default router;