import express from 'express';
import LocationController from '../controllers/locationController.js';
import mapLocationController from '../controllers/mapAdminController.js';

const router = express.Router();

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
 *         application/json:
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
 *               image_url:
 *                 type: string
 *                 description: URL of an image for the location (optional).
 *     responses:
 *       201:
 *         description: Map location added successfully.
 *       400:
 *         description: Invalid input or location data.
 */
router.post('/add-map-location', mapLocationController.addLocation);

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

export default router;
