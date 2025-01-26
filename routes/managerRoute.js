import express from 'express';
import ManagerController from '../controllers/managerController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Manager Routes
 *     description: Operations for geofence, vehicle assignments, monitoring, and violations.
 */

// Assign geofence to an employee
/**
 * @swagger
 * /api/manager/assign-geofence:
 *   post:
 *     tags:
 *       - Assign a geofence to an employee
 *     summary: Assign a geofence to an employee
 *     description: Assign a geofence to an employee with specific dates and times.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               geoId:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: time
 *               end_time:
 *                 type: string
 *                 format: time
 *               type:
 *                type: string
 *     responses:
 *       200:
 *         description: Geofence assigned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Geofence 1 assigned to employee 1 successfully."
 *       500:
 *         description: Error assigning geofence.
 */
router.post('/assign-geofence', ManagerController.assignGeofenceToEmployee);

// Assign vehicle to an employee
/**
 * @swagger
 * /api/manager/assign-vehicle:
 *   post:
 *     tags:
 *       - Assign a vehicle to an employee
 *     summary: Assign a vehicle to an employee
 *     description: Assign a vehicle to an employee based on employee and vehicle IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               vehicleId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vehicle assigned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Vehicle 123 assigned to employee 2 successfully."
 *       500:
 *         description: Error assigning vehicle.
 */
router.post('/assign-vehicle', ManagerController.assignVehicleToEmployee);

// Monitor a single employee's location
/**
 * @swagger
 * /api/manager/employee/{employeeId}/location:
 *   get:
 *     tags:
 *       -  Monitor a single employee location
 *     summary: Monitor a single employee's location
 *     description: Fetch the latest location of an employee.
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee location fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employeeLocations:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *             example:
 *               employeeLocations: { latitude: 33.6844, longitude: 73.0479, timestamp: "2025-01-14T10:00:00Z" }
 *       500:
 *         description: Error fetching employee location.
 */
router.get('/employee/:employeeId/location', ManagerController.getEmployeeLocations);

// View geofence violations
/**
 * @swagger
 * /api/manager/{managerId}/view-violations:
 *   get:
 *     tags:
 *       - View geofence violations for employees
 *     summary: View geofence violations for employees
 *     description: Fetch all geofence violations under a manager.
 *     parameters:
 *       - name: managerId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Violations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 violations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       violationId:
 *                         type: integer
 *                       employeeId:
 *                         type: integer
 *                       geoId:
 *                         type: integer
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *             example:
 *               violations: [
 *                 { violationId: 1, employeeId: 1, geoId: 1, timestamp: "2025-01-14T12:00:00Z" }
 *               ]
 *       500:
 *         description: Error fetching violations.
 */
router.get('/:managerId/view-violations', ManagerController.getEmployeeViolationsByManagerId);

// Fetch employees under a manager
/**
 * @swagger
 * /api/manager/{managerId}/employees:
 *   get:
 *     tags:
 *       - Fetch employees under a manager
 *     summary: Fetch employees under a manager
 *     description: Get a list of employees assigned to a manager.
 *     parameters:
 *       - name: managerId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employees fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employeeId:
 *                         type: integer
 *                       name:
 *                         type: string
 *             example:
 *               employees: [
 *                 { employeeId: 1, name: "Ali Khan" },
 *                 { employeeId: 2, name: "Sara Malik" }
 *               ]
 *       500:
 *         description: Error fetching employees.
 */
router.get('/:managerId/employees', ManagerController.getEmployeesByManagerId);

// Fetch employees' locations under a manager
/**
 * @swagger
 * /api/manager/{managerId}/employees/locations:
 *   get:
 *     tags:
 *       - Monitor All Employees locations
 *     summary: Monitor All Employees locations
 *     description: Get locations of all employees assigned to a manager.
 *     parameters:
 *       - name: managerId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employees' locations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employeeId:
 *                         type: integer
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *             example:
 *               employees: [
 *                 { employeeId: 1, latitude: 33.6844, longitude: 73.0479 },
 *                 { employeeId: 2, latitude: 33.738, longitude: 73.084 }
 *               ]
 *       500:
 *         description: Error fetching locations.
 */
router.get('/:managerId/employees/locations', ManagerController.getEmployeesLocationByManagerId);
/**
 * @swagger
 * /api/manager/violations-by-date:
 *   get:
 *     tags:
 *       - Fetch violations by date
 *     summary: Fetch violations by date for a specific manager
 *     description: Retrieve geofence violations for a specific manager that occurred on a specific date.
 *     parameters:
 *       - name: managerId
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: date
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-12-01"
 *     responses:
 *       200:
 *         description: Violations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 violations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       violationId:
 *                         type: integer
 *                       employeeId:
 *                         type: integer
 *                       geoId:
 *                         type: integer
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *             example:
 *               violations: [
 *                 { violationId: 1, employeeId: 1, geoId: 1, timestamp: "2025-01-14T12:00:00Z" }
 *               ]
 *       400:
 *         description: Bad request. Missing managerId or date.
 *       500:
 *         description: Error fetching violations by date.
 */
router.get('/violations-by-date', ManagerController.getViolationsByDate);


/**
 * @swagger
 * /api/manager/violations-for-group:
 *   post:
 *     tags:
 *       - Fetch violations for a group
 *     summary: Fetch violations for group
 *     description: Retrieve all geofence violations for a group of employees.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               employeeIds: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Violations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 violations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       violationId:
 *                         type: integer
 *                       geoId:
 *                         type: integer
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *             example:
 *               violations: [
 *                 { violationId: 1, geoId: 1, timestamp: "2025-01-14T12:00:00Z" }
 *               ]
 *       500:
 *         description: Error fetching violations for group.
 */
router.post('/violations-for-group', ManagerController.getViolationsForGroup);

/**
 * @swagger
 * /api/manager/violations-by-employee/{employeeId}:
 *   get:
 *     tags:
 *       - Fetch violations by employee
 *     summary: Fetch violations by employee
 *     description: Retrieve all geofence violations for a specific employee.
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Violations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 violations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       violationId:
 *                         type: integer
 *                       geoId:
 *                         type: integer
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *             example:
 *               violations: [
 *                 { violationId: 1, geoId: 1, timestamp: "2025-01-14T12:00:00Z" }
 *               ]
 *       500:
 *         description: Error fetching violations for employee.
 */
router.get('/violations-by-employee/:employeeId', ManagerController.getViolationsByEmployeeId);


export default router;
