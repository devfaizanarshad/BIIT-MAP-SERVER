import express from 'express';
import path from 'path';
import LocationController from '../controllers/locationController.js';
import mapLocationController from '../controllers/mapAdminController.js';
import CarSimulationController from '../controllers/simulationController.js';
import LayerModel from '../models/Layer.js';
import multer from 'multer';
import polyline from '@mapbox/polyline';
import fetch from 'node-fetch';
import db from "../config/db.js";  
import { log } from 'console';


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
 *               type:
 *                 type: string
 *                 description: Type of the map location.
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

/**
 * @swagger
 * /api/location/map-locations:
 *   post:
 *     summary: Get locations by type (e.g., hospitals, toll plazas).
 *     tags:
 *       - Map Locations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "hospital"  # Could be "ptcl", "toll", etc.
 *     responses:
 *       200:
 *         description: Returns locations for the given type.
 *       400:
 *         description: Type is missing or invalid.
 */
router.post('/map-locations', (req, res) => {
  const { type } = req.body;
  if (!type) {
    return res.status(400).json({ error: 'Location type is required' });
  }
  mapLocationController.getLocationsByType(req, res);
});

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



router.post('/threat-simulation', CarSimulationController.createThreatSimulation);

router.get('/threat-simulation/all', CarSimulationController.getAllThreatSimulations);

router.get('/threat-simulation/:threat_level', CarSimulationController.getThreatSimulationsByLevel);

router.post("/get-route", async (req, res) => {
  const { source, destination } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ error: "Source and destination are required." });
  }

  const sourceParam = source.join(",");
  const destinationParam = destination.join(",");

  const url = `http://localhost:8989/route?point=${sourceParam}&point=${destinationParam}&type=json&profile=car`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.paths || data.paths.length === 0) {
      return res.status(404).json({ error: "No route found" });
    }

    const path = data.paths[0];
    const decodedPoints = polyline.decode(path.points); // [lat, lng]

    // --- Call Congestion API ---
    const congestionRes = await fetch('http://localhost:3000/api/location/check-congestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ graphhopper_coordinates: decodedPoints })
    });

    const congestionData = await congestionRes.json();
    const congestedPoints =
      congestionData?.result?.status === "Segment is Congested"
        ? congestionData.result.matchedPoints
        : [];

    // --- Final Response ---
    return res.json({
      path: decodedPoints,
      congestedPoints: congestedPoints
    });

  } catch (error) {
    console.error("Backend error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ POST /api/map-lines → Create new polyline
router.post('/map-lines', async (req, res) => {
  const { name, description, category, hasThreat, threatLevel, geometry } = req.body;

  // Validate required fields
  if (!name || !category || !geometry) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields (name, category, geometry)' 
    });
  }

  // Validate geometry format
  if (!Array.isArray(geometry) || geometry.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Geometry must be an array of at least 2 coordinates'
    });
  }

  try {
    // Convert geometry to PostgreSQL-compatible format
    const coordinates = JSON.stringify(geometry);

    
    const layer = await LayerModel.getLayerTypeId(category);
    console.log("Layer ID:", layer);
    const id = layer.id;

    const result = await db.query(`
      INSERT INTO map_lines (
        name, description, category, has_threat, threat_level, coordinates, layer_type_id
      ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
      RETURNING *
    `, [
      name,
      description || null,
      category,
      Boolean(hasThreat), // Ensure boolean value
      hasThreat ? threatLevel : null,
      coordinates,
      id
    ]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save map line',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ GET /api/map-lines → Fetch all or filter by category/threat
router.get('/map-lines/all', async (req, res) => {
  try {
    const query = `
      SELECT id, name, description, category, has_threat, threat_level, coordinates
      FROM map_lines
    `;

    const result = await db.query(query);

    const lines = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      hasThreat: row.has_threat,
      threatLevel: row.threat_level,
      coordinates: row.coordinates // Already in [lng, lat]
    }));

    res.json(lines);
  } catch (error) {
    console.error('Error fetching map lines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ GET /api/map-lines → Fetch all or filter by category/threat
router.get('/map-lines/:category', async (req, res) => {
  try {
    const { category } = req.params;

    console.log(typeof(category));
    

    const query = `
      SELECT id, name, description, category, has_threat, threat_level, coordinates
      FROM map_lines
      WHERE category = $1
    `;
    const values = [category];
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    const result = await db.query(query, values);

    const lines = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      hasThreat: row.has_threat,
      threatLevel: row.threat_level,
      coordinates: row.coordinates // Already in [lng, lat]
    }));

    res.json(lines);
  } catch (error) {
    console.error('Error fetching map lines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
