import express from 'express';
import EmployeeController from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/Authicationmiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Employee Routes
 *     description: All administrative operations.
 */

/**
 * @swagger
 * /api/employee/my-profile/{employeeId}:
 *   get:
 *     tags:
 *       - Employee Profile
 *     summary: Get employee profile
 *     description: Fetches the profile of the employee by ID.
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         description: The ID of the employee.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     branch:
 *                       type: string
 *                     city:
 *                       type: string
 *                     phone:
 *                       type: string
 *       400:
 *         description: Employee ID is required
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error fetching employee profile
 */

/**
 * @swagger
 * /api/employee/my-geofences/{employeeId}:
 *   get:
 *     tags:
 *       - Employee Geofences
 *     summary: Get assigned geofences
 *     description: Fetches the geofences assigned to the employee by ID.
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         description: The ID of the employee.
 *         type: integer
 *     responses:
 *       200:
 *         description: Assigned geofences fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 geofences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       geoId:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *       400:
 *         description: Employee ID is required
 *       500:
 *         description: Error fetching assigned geofences
 */

/**
 * @swagger
 * /api/employee/my-vehicles/{employeeId}:
 *   get:
 *     tags:
 *       - Employee Vehicles
 *     summary: Get assigned vehicles
 *     description: Fetches the vehicles assigned to the employee by ID.
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         description: The ID of the employee.
 *         type: integer
 *     responses:
 *       200:
 *         description: Assigned vehicles fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       vehicleId:
 *                         type: integer
 *                       model:
 *                         type: string
 *                       year:
 *                         type: integer
 *                       isActive:
 *                         type: boolean
 *       400:
 *         description: Employee ID is required
 *       500:
 *         description: Error fetching assigned vehicles
 */

// Employee Routes
router.get('/my-profile/:employeeId', authMiddleware, EmployeeController.getProfile);
router.get('/my-geofences/:employeeId', authMiddleware, EmployeeController.getAssignedGeofences);
router.get('/my-vehicles/:employeeId',authMiddleware,  EmployeeController.getAssignedVehicles);

export default router;
