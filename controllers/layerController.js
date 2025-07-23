import LayerModel from "../models/Layer.js";

const LayerController = {
createLayer: async (req, res) => {
  try {
    const { name, type, description, is_public } = req.body;
    const file = req.file;

    console.log("Received file:", file);
    console.log("Received body:", req.body);
    


    // Basic validations
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    if (!file) {
      return res.status(400).json({ message: "Image (.png) is required for all layer types" });
    }

    
    // Only accept .png images
    if (file.mimetype !== "image/png") {
      return res.status(400).json({ message: "Only .png files are allowed for layers" });
    }

    const image = file.filename;

    // Create the layer
    const newLayer = await LayerModel.createLayer(name, type, description, image, is_public);
    return res.status(200).json(newLayer);

  } catch (error) {
    console.error("Error creating layer:", error);
    return res.status(500).json({ message: "Server error" });
  }
},

  getAllLayers: async (req, res) => {
    try {
      const layers = await LayerModel.getAllLayers();
      return res.status(200).json(layers);
    } catch (error) {
      console.error("Error fetching layers:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getLayersByType: async (req, res) => {
    try {
      const { type } = req.params;
      const layers = await LayerModel.getLayersByType(type);
      return res.status(200).json(layers);
    } catch (error) {
      console.error("Error fetching layers by type:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getLayerById: async (req, res) => {
    try {
      const { id } = req.params;
      const layer = await LayerModel.getLayerById(id);

      if (!layer) {
        return res.status(404).json({ message: "Layer not found" });
      }

      return res.status(200).json(layer);
    } catch (error) {
      console.error("Error fetching layer by ID:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  
  assignLayerToUser: async (req, res) => {
    try {
      const { user_id, layer_type_id, start_time, end_time } = req.body;

      if (!user_id || !layer_type_id) {
        return res.status(400).json({ message: "user_id, layer_type_id are required" });
      }

      let assigned = null;

      // if start time and end time are provided send them as well otherwise don't send them
      if (start_time == null && end_time == null) {

        assigned = await LayerModel.assignLayerToUser(
        user_id,
        layer_type_id 
      );

    }
      else {
         assigned = await LayerModel.assignLayerToUser(
          user_id,
          layer_type_id,
          start_time || null,
          end_time || null
        );
      }


      return res.status(201).json({
        message: "Layer assigned successfully",
        data: assigned,
      });
    } catch (error) {
      console.error("Error assigning layer:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getAllUserLayerAssignments: async (req, res) => {

    console.log("Fetching all user layer assignments...");
    

  try {
    const data = await LayerModel.getAssignedLayers();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching layer assignments:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
},

// layerController.js
getUserLayers: async (req, res) => {
  const userId = req.params.userId;
  try {
    const layers = await LayerModel.getUserAssignedLayers(userId);
    return res.status(200).json(layers);
  } catch (error) {
    console.error("Error fetching user layers:", error);
    return res.status(500).json({ message: "Server error" });
  }
},


// layerController.js
getPublicLayers: async (req, res) => {
      console.log("Fetching public layers...");
  try {

    
    const layers = await LayerModel.getPublicLayers();
    return res.status(200).json(layers);
  } catch (error) {
    console.error("Error fetching public layers:", error);
    return res.status(500).json({ message: "Server error" });
  }
},

        // Hide sensitive employee
hideUserLayer: async(req, res) =>{
      try {
        const { Id } = req.params;

        const employee = await LayerModel.hideUserLayer(Id)

        // Mock success response
        return res.status(200).json({
          message: `Layers ${Id} Hidden successfully`,
        });
      } catch (error) {
        return res.status(500).json({ message: 'Error Hiding Layer' });
      }
    },   



};

export default LayerController;
