import express from "express";
import multer from "multer";
import LayerController from "../controllers/layerController.js";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

/**
 * @swagger
 * /api/layers/create:
 *   post:
 *     tags:
 *       - Layer Management
 *     summary: Create a new layer
 *     description: Creates a new map layer (location, line, or threat). Location type requires a .png image.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hospital
 *               type:
 *                 type: string
 *                 enum: [location, line, threat]
 *                 example: location
 *               description:
 *                 type: string
 *                 example: This is a location layer
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Only required for location type (must be .png)
 *     responses:
 *       201:
 *         description: Layer created successfully
 *       400:
 *         description: Missing fields or invalid image
 *       500:
 *         description: Server error
 */
router.post("/create", upload.single("image"), LayerController.createLayer);

/**
 * @swagger
 * /api/layers/all:
 *   get:
 *     tags:
 *       - Layer Management
 *     summary: Get all layers
 *     description: Fetches all map layers stored in the system.
 *     responses:
 *       200:
 *         description: List of layers
 *       500:
 *         description: Server error
 */
router.get("/all", LayerController.getAllLayers);

/**
 * @swagger
 * /api/layers/type/{type}:
 *   get:
 *     tags:
 *       - Layer Management
 *     summary: Get layers by type
 *     description: Returns all layers filtered by a specific type.
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [location, line, threat]
 *         description: Type of the layer to filter by
 *     responses:
 *       200:
 *         description: Filtered list of layers
 *       500:
 *         description: Server error
 */
router.get("/type/:type", LayerController.getLayersByType);

/**
 * @swagger
 * /api/layers/assign:
 *   post:
 *     tags:
 *       - Layer Management
 *     summary: Assign a layer to a user
 *     description: Assigns a specific layer to a user with an optional time window.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - layer_type_id
 *               - start_time
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 5
 *               layer_type_id:
 *                 type: integer
 *                 example: 2
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-05T10:00:00"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-10T18:00:00"
 *     responses:
 *       201:
 *         description: Layer assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Layer assigned successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     layer_type_id:
 *                       type: integer
 *                     start_time:
 *                       type: string
 *                     end_time:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/assign", LayerController.assignLayerToUser);

/**
 * @swagger
 * /api/layers/assignments:
 *   get:
 *     tags:
 *       - Layer Management
 *     summary: Get all user-layer assignments
 *     description: Returns a list of which users are assigned to which layers along with start/end times.
 *     responses:
 *       200:
 *         description: Successfully fetched assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 5
 *                   username:
 *                     type: string
 *                     example: faizan_dev
 *                   layer_type_id:
 *                     type: integer
 *                     example: 3
 *                   layer_name:
 *                     type: string
 *                     example: PTCL Office
 *                   layer_category:
 *                     type: string
 *                     example: location
 *                   image:
 *                     type: string
 *                     example: /uploads/ptcl.png
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                   end_time:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get("/assignments", LayerController.getAllUserLayerAssignments);


/**
 * @swagger
 * /api/layers/{id}:
 *   get:
 *     tags:
 *       - Layer Management
 *     summary: Get a layer by ID
 *     description: Retrieves detailed information for a specific layer.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the layer
 *     responses:
 *       200:
 *         description: Layer data found
 *       404:
 *         description: Layer not found
 *       500:
 *         description: Server error
 */
router.get("/:id", LayerController.getLayerById);

/**
 * @swagger
 * /api/layers/user/{userId}/layers:
 *   get:
 *     tags:
 *       - Layer Management
 *     summary: Get all layers assigned to a specific user
 *     description: Fetches all active layers assigned to the given user based on their user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Successfully fetched user layers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Hospitals
 *                   type:
 *                     type: string
 *                     example: location
 *                   description:
 *                     type: string
 *                     example: All registered hospitals in the district
 *                   image:
 *                     type: string
 *                     example: /uploads/1699384712-hospital.png
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Server error
 */
router.get("/user/:userId/layers", LayerController.getUserLayers);


router.get("/Layertype/public", LayerController.getPublicLayers);




export default router;
