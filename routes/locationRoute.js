import express from 'express';
import path from 'path';
import LocationController from '../controllers/locationController.js';
import mapLocationController from '../controllers/mapAdminController.js';
import CarSimulationController from '../controllers/simulationController.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), 'uploads')); // Ensures cross-platform compatibility
    },
    filename: (req, file, cb) => {
      const username = req.body.username || req.body.model || req.body.name || 'default';
      const sanitizedUsername = username.replace(/[^a-zA-Z0-9_-]/g, '');
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const imageName = `${sanitizedUsername}-${Date.now()}${fileExtension}`;
      cb(null, imageName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  }
});

/**
 * @swagger
 * /api/location/{employeeId}/add-location:
 *   post:
 *     summary: Track geofence boundary
 *     description: Allows an admin or manager to add a new location for an employee.
 *     tags:
 *       - Track geofence boundary
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         description: ID of the employee
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Latitude of the employee's location.
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Longitude of the employee's location.
 *     responses:
 *       200:
 *         description: Location added successfully
 *       400:
 *         description: Invalid input or location data
 *       404:
 *         description: Employee not found
 */
router.post('/:employeeId/add-location', LocationController.addLocation);

/**
 * @swagger
 * /api/location/add-map-location:
 *   post:
 *     summary: Add a new map location.
 *     description: Allows an admin to add a new location on the map, including coordinates, description, and optional image.
 *     tags:
 *       - Add a new map location
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Latitude of the map location.
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Longitude of the map location.
 *               name:
 *                 type: string
 *                 description: Name of the map location.
 *               description:
 *                 type: string
 *                 description: Description of the map location.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the location (optional).
 *     responses:
 *       201:
 *         description: Map location added successfully.
 *       400:
 *         description: Invalid input or location data.
 */
router.post('/add-map-location', upload.single('image'), (req, res, next) => {  

  console.log(req.body);
  
  if (!req.body.image_url) {
    return res.status(400).json({ error: 'Image file is required' });
  }
  mapLocationController.addLocation(req, res, next);
});

router.get('/map-locations', mapLocationController.getAllLocations);

/**
 * @swagger
 * /api/location/search-location:
 *   get:
 *     summary: Search for a location by query.
 *     description: Searches for a location using a query string, and returns matching results.
 *     tags:
 *       - Search Location
 *     parameters:
 *       - name: location
 *         in: query
 *         description: Search query for location.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       description:
 *                         type: string
 *       500:
 *         description: Error fetching location.
 */
router.get('/search-location', LocationController.getSerachLocation);


/**
 * @swagger
 * /api/location/car-simulation:
 *   post:
 *     summary: Create a new car simulation.
 *     description: Allows creating a new car simulation with car path, speed, time, and congestion info.
 *     tags:
 *       - Car Simulation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                       format: float
 *                       description: Latitude of the car's location.
 *                     lon:
 *                       type: number
 *                       format: float
 *                       description: Longitude of the car's location.
 *               speed:
 *                 type: integer
 *                 description: Speed of the car in km/h.
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time of the simulation.
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: End time of the simulation.
 *               is_congested:
 *                 type: boolean
 *                 description: Flag indicating whether the path is congested.
 *     responses:
 *       201:
 *         description: Car simulation created successfully.
 *       400:
 *         description: Invalid input or missing fields.
 */
router.post('/car-simulation', CarSimulationController.createCarSimulation);
/**
 * @swagger
 * /api/location/check-congestion:
 *   post:
 *     summary: Check congestion status of the car simulation path.
 *     description: Checks the congestion status of a car's path based on speed and time data.
 *     tags:
 *       - Car Simulation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                       format: float
 *                       description: Latitude of the car's location.
 *                     lon:
 *                       type: number
 *                       format: float
 *                       description: Longitude of the car's location.
 *               speed:
 *                 type: integer
 *                 description: Speed of the car in km/h.
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time of the simulation.
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: End time of the simulation.
 *     responses:
 *       200:
 *         description: Congestion status of the car path.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_congested:
 *                   type: boolean
 *                   description: Flag indicating if the path is congested.
 *       400:
 *         description: Invalid input or missing fields.
 *       500:
 *         description: Error checking congestion status.
 */
router.post('/check-congestion', CarSimulationController.checkCongestion);

export default router;
