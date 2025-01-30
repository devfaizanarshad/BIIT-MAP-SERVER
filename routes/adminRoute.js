import express from 'express';
import AdminController from '../controllers/adminController.js';
import GeofenceController from '../controllers/geofenceController.js';
import VehicleController from '../controllers/vehicleController.js';
import EmployeeController from '../controllers/employeeController.js';
import BranchController from "../controllers/branchController.js";


const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Admin Routes
 *     description: All administrative operations.
 */


// User Management

// User Management Routes
/**
 * @swagger
 * /api/admin/create-user:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Create a new user
 *     description: Allows an admin to create a new user with details such as username, email, role, and more.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: faizan_ars
 *               email:
 *                 type: string
 *                 example: faizan@example.com
 *               password:
 *                 type: string
 *                 example: faizan12
 *               role:
 *                 type: string
 *                 example: Employee
 *               first_name:
 *                 type: string
 *                 example: Faizan
 *               last_name:
 *                 type: string
 *                 example: Arshad
 *               address:
 *                 type: string
 *                 example: House #123, F-8/2, Islamabad
 *               city:
 *                 type: string
 *                 example: Islamabad
 *               phone:
 *                 type: string
 *                 example: 03001234567
 *               branch_name:
 *                 type: string
 *                 example: Blue Area Branch
 *               image:
 *                 type: string
 *                 example: https://example.com/images/faizan.jpg
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request or missing parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/list-users:
 *   get:
 *     tags:
 *       - User Management
 *     summary: List all users
 *     description: Fetch a list of all users, including their details and roles.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     example: 101
 *                   username:
 *                     type: string
 *                     example: jane_doe
 *                   email:
 *                     type: string
 *                     example: jane@example.com
 *                   role:
 *                     type: string
 *                     example: Manager
 *                   branch:
 *                     type: string
 *                     example: Rawalpindi Main Branch
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/update-user/{userId}:
 *   put:
 *     tags:
 *       - User Management
 *     summary: Update a user's details
 *     description: Allows an admin to update a user's details, including username, email, role, and other attributes.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to be updated
 *         schema:
 *           type: integer
 *           example: 101
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: jane_updated
 *               email:
 *                 type: string
 *                 example: jane_updated@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *               role:
 *                 type: string
 *                 example: Employee
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/deactivate-user/{userId}:
 *   patch:
 *     tags:
 *       - User Management
 *     summary: Deactivate a user
 *     description: Deactivates a user account, marking it as inactive.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to be deactivated
 *         schema:
 *           type: integer
 *           example: 101
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.post('/create-user', AdminController.createUser);
router.get('/list-users', AdminController.getAllUsers);
router.put('/update-user/:userId', AdminController.updateUser);
router.patch('/deactivate-user/:userId', AdminController.deactivateUser);

// Geofence Management
/**
 * @swagger
 * /api/admin/create-geofence:
 *   post:
 *     tags:
 *       - Geofence Management
 *     summary: Create a new geofence
 *     description: Allows an admin to create a geofence by specifying its details, including the boundary and access type.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 example: Rawalpindi Office Zone
 *                 description: Name of the geofence.
 *               boundary:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       example: 33.6292
 *                       description: Latitude coordinate.
 *                     longitude:
 *                       type: number
 *                       example: 73.0731
 *                       description: Longitude coordinate.
 *               
 *     responses:
 *       201:
 *         description: Geofence created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Geofence created successfully
 *                 geofence:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Rawalpindi Office Zone
 *                     boundary:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                             example: 33.6292
 *                           longitude:
 *                             type: number
 *                             example: 73.0731
 *                     type:
 *                       type: string
 *                       example: allowed
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/admin/list-geofences:
 *   get:
 *     tags:
 *       - Geofence Management
 *     summary: List all geofences
 *     description: Fetches all geofences created in the system.
 *     responses:
 *       200:
 *         description: A list of geofences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   geoId:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Islamabad Office Zone
 *                   status:
 *                     type: string
 *                     example: Active
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /api/admin/single-geofence/{name}:
 *   get:
 *     tags:
 *       - Geofence Management
 *     summary: Fetch a single geofence by name
 *     description: Retrieve details of a geofence by its name.
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Geofence details fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 geofence:
 *                   type: object
 *                   example:
 *                     geo_id: 1
 *                     name: "Blue Area"
 *                     boundary: [{"latitude":33.7100, "longitude":73.0550}]
 *                     created_at: "2023-01-01T12:00:00.000Z"
 *       404:
 *         description: Geofence not found.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/admin/update-geofence/{geoId}:
 *   put:
 *     tags:
 *       - Geofence Management
 *     summary: Update a geofence
 *     description: Update details of an existing geofence.
 *     parameters:
 *       - name: geoId
 *         in: path
 *         required: true
 *         description: ID of the geofence to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Islamabad Office Zone
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       example: 33.6844
 *                     longitude:
 *                       type: number
 *                       example: 73.0479
 *     responses:
 *       200:
 *         description: Geofence updated successfully
 *       404:
 *         description: Geofence not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/admin/deactivate-geofence/{geoId}:
 *   patch:
 *     tags:
 *       - Geofence Management
 *     summary: Deactivate a geofence
 *     description: Soft delete a geofence by marking it as inactive.
 *     parameters:
 *       - name: geoId
 *         in: path
 *         required: true
 *         description: ID of the geofence to deactivate
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Geofence deactivated successfully
 *       404:
 *         description: Geofence not found
 *       500:
 *         description: Internal Server Error
 */


router.post('/create-geofence', GeofenceController.createGeofence); 
router.get('/list-geofences', GeofenceController.getAllGeofences);
router.get("/single-geofence/:name", GeofenceController.getGeofenceByName);
router.put('/update-geofence/:geoId', GeofenceController.updateGeofence); 
router.patch('/deactivate-geofence/:geoId', GeofenceController.deactivateGeofence); 

// Vehicle Management

/**
 * @swagger
 * /api/admin/create-vehicle:
 *   post:
 *     tags:
 *       - Vehicle Management
 *     summary: Create a new vehicle
 *     description: Adds a new vehicle to the system with details such as model, year, active status, and image. The vehicle will be linked to the Rawalpindi and Islamabad region in Pakistan.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 example: Toyota Corolla
 *               year:
 *                 type: number
 *                 example: 2022
 *               image:
 *                 type: string
 *                 example: "https://example.com/vehicle-image.jpg"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle created successfully
 *                 vehicle:
 *                   type: object
 *                   properties:
 *                     model:
 *                       type: string
 *                       example: Toyota Corolla
 *                     year:
 *                       type: number
 *                       example: 2022
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/admin/list-vehicles:
 *   get:
 *     tags:
 *       - Vehicle Management
 *     summary: Get all vehicles
 *     description: Retrieves a list of all vehicles in the system. This includes vehicles registered in the Rawalpindi and Islamabad regions of Pakistan.
 *     responses:
 *       200:
 *         description: A list of vehicles
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
 *                         type: number
 *                         example: 1
 *                       model:
 *                         type: string
 *                         example: Toyota Corolla
 *                       year:
 *                         type: number
 *                         example: 2022
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/admin/update-vehicle/{vehicleId}:
 *   put:
 *     tags:
 *       - Vehicle Management
 *     summary: Update a vehicle
 *     description: Updates details of an existing vehicle by its ID. This can be used to modify vehicle details like model, year, image, and active status for vehicles in Rawalpindi and Islamabad.
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the vehicle to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 example: Honda Civic
 *               year:
 *                 type: number
 *                 example: 2023
 *               image:
 *                 type: string
 *                 example: "https://example.com/new-vehicle-image.jpg"
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/admin/deactivate-vehicle/{vehicleId}:
 *   patch:
 *     tags:
 *       - Vehicle Management
 *     summary: Deactivate a vehicle
 *     description: Marks a vehicle as inactive without removing it from the system. This is typically done for vehicles that are no longer operational in Rawalpindi or Islamabad.
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the vehicle to deactivate
 *     responses:
 *       200:
 *         description: Vehicle deactivated successfully
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal Server Error
 */

router.post('/create-vehicle', VehicleController.createVehicle); 
router.get('/list-vehicles', VehicleController.getAllVehicles);
router.put('/update-vehicle/:vehicleId', VehicleController.updateVehicle);
router.patch('/deactivate-vehicle/:vehicleId', VehicleController.deactivateVehicle); 

// Employee Management

/**
 * @swagger
 * /api/admin/list-employees:
 *   get:
 *     tags:
 *       - Employee Management
 *     summary: Get all employees
 *     description: Retrieves a list of all employees in the system.
 *     responses:
 *       200:
 *         description: A list of employees
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
 *                         type: number
 *                         example: 1
 *                       firstName:
 *                         type: string
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         example: Doe
 *                       address:
 *                         type: string
 *                         example: "123 Street, Rawalpindi, Pakistan"
 *                       phone:
 *                         type: string
 *                         example: "+92 300 1234567"
 *                       image:
 *                         type: string
 *                         example: "profile-image.jpg"
 *                       branchId:
 *                         type: integer
 *                         example: 1
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/admin/update-employee/{employeeId}:
 *   put:
 *     tags:
 *       - Employee Management
 *     summary: Update an employee
 *     description: Updates details of an existing employee by their ID.
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               address:
 *                 type: string
 *                 example: "456 Another Street, Islamabad, Pakistan"
 *               phone:
 *                 type: string
 *                 example: "+92 300 9876543"
 *               image:
 *                 type: string
 *                 example: "updated-profile-image.jpg"
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee updated successfully"
 *                 employee:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: number
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "Jane"
 *                     lastName:
 *                       type: string
 *                       example: "Smith"
 *                     address:
 *                       type: string
 *                       example: "456 Another Street, Islamabad, Pakistan"
 *                     phone:
 *                       type: string
 *                       example: "+92 300 9876543"
 *                     image:
 *                       type: string
 *                       example: "updated-profile-image.jpg"
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/admin/deactivate-employee/{employeeId}:
 *   patch:
 *     tags:
 *       - Employee Management
 *     summary: Deactivate an employee
 *     description: Marks an employee as inactive without removing them from the system.
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the employee to deactivate
 *     responses:
 *       200:
 *         description: Employee deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee deactivated successfully"
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal Server Error
 */
//router.post('/create-employee', EmployeeController.createEmployee);
router.get('/list-employees', EmployeeController.getAllEmployees); 
router.put('/update-employee/:employeeId', EmployeeController.updateEmployee); 
router.patch('/deactivate-employee/:employeeId', EmployeeController.deactivateEmployee); 


/**
 * @swagger
 * /api/admin/create-branch:
 *   post:
 *     tags:
 *       - Branch Management
 *     summary: Create a new branch
 *     description: Allows an admin to create a branch with details like name, address, phone, and manager in Islamabad or Rawalpindi, Pakistan.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Main Office
 *               address:
 *                 type: string
 *                 example: "123 Business St, Islamabad, Pakistan"
 *               phone:
 *                 type: string
 *                 example: "+92 300 1234567"

 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Branch created successfully"
 *                 branch:
 *                   type: object
 *                   properties:
 *                     branchId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Main Office"
 *                     address:
 *                       type: string
 *                       example: "123 Business St, Islamabad, Pakistan"
 *                     phone:
 *                       type: string
 *                       example: "+92 300 1234567"
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
* /api/admin/list-branches:
*   get:
*     tags:
*       - Branch Management
*     summary: Get all active branches
*     description: Fetches a list of all active branches in the system.
*     responses:
*       200:
*         description: List of active branches
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 branches:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       branchId:
*                         type: integer
*                         example: 1
*                       name:
*                         type: string
*                         example: "Main Office"
*                       address:
*                         type: string
*                         example: "123 Business St, City, Country"
*                       phone:
*                         type: string
*                         example: "+1234567890"
*                       managerId:
*                         type: integer
*                         example: 1
*                       is_active:
*                         type: boolean
*                         example: true
*       500:
*         description: Internal Server Error
*/

/**
 * @swagger
 * /api/admin/update-branch/{branchId}:
 *   put:
 *     tags:
 *       - Branch Management
 *     summary: Update an existing branch
 *     description: Allows an admin to update an existing branch's details.
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         description: ID of the branch to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Branch Name
 *               address:
 *                 type: string
 *                 example: 456 New St, City, Country
 *               phone:
 *                 type: string
 *                 example: "+9876543210"

 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Branch updated successfully"
 *                 branch:
 *                   type: object
 *                   properties:
 *                     branchId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Updated Branch Name"
 *                     address:
 *                       type: string
 *                       example: "456 New St, City, Country"
 *                     phone:
 *                       type: string
 *                       example: "+9876543210"
 *                     managerId:
 *                       type: integer
 *                       example: 2
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/admin/deactivate-branch/{branchId}:
 *   patch:
 *     tags:
 *       - Branch Management
 *     summary: Delete (soft delete) a branch
 *     description: Allows an admin to soft delete a branch.
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         description: ID of the branch to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Branch deleted successfully"
 *                 branch:
 *                   type: object
 *                   properties:
 *                     branchId:
 *                       type: integer
 *                       example: 1
 *                     is_active:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal Server Error
 */



router.post("/create-branch", BranchController.createBranch); 
router.get("/list-branches", BranchController.getAllBranches);
router.get("/branch/:branchId", BranchController.getBranchById);
router.put("/update-branch/:branchId", BranchController.updateBranch); 
router.patch("/deactivate-branch/:branchId", BranchController.deactivateBranch);



export default router;
