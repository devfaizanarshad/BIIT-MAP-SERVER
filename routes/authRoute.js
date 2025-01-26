import express from 'express';
import AuthController from '../controllers/athenticationController.js';

const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate user and return user details
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: User Logout
 *     description: Logout the current user
 *     tags:
 *       - Logout
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.post('/logout', AuthController.logout);

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset User Password
 *     description: Reset user password after verifying current password
 *     tags:
 *       - Reset Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       401:
 *         description: Current password incorrect
 *       404:
 *         description: User not found
 */
router.post('/reset-password', AuthController.resetPassword);

export default router;