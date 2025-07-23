import LayerModel from "../models/Layer.js";
import UserLayerModel from "../models/userGeofenceLayerModel.js";

const UserGeoLayer = {
createUserGeoLayer: async (req, res) => {
  try {
    const { geo_id, user_id, layer_type_id, is_permitted } = req.body;
    console.log("Received body:", req.body);


    // Create the User Geo layer
    const newLayer = await UserLayerModel.createUserGeoLayer(geo_id, user_id, layer_type_id, is_permitted);
    return res.status(200).json(newLayer);

  } catch (error) {
    console.error("Error creating User geo layer:", error);
    return res.status(500).json({ message: "Server error" });
  }
},

  getUserGeoLayer: async (req, res) => {
    const { user_id } = req.params;
    try {
      const layers = await UserLayerModel.getAllUserGeoLayerBYUserId(user_id);
      return res.status(200).json(layers);
    } catch (error) {
      console.error("Error fetching User Geo layers:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },


// Hide sensitive user geo id
permitUserGeoLayer: async(req, res) =>{

  console.log(req.params.Id);
  

      try {        

        // getting ugl Id
        const { Id } = req.params;        

        const Layer = await UserLayerModel.permittedUserGeoLayer(Id)
        return res.status(200).json({
          message: `User Geo Layers ${Id} Hidden successfully`,
        });
      } catch (error) {
        return res.status(500).json({ message: 'Error Hiding Layer' });
      }
    },

    
getAllUserGeoLayerAssignments: async (req, res) => {

    console.log("Fetching all user geo layer assignments...");
    

  try {
    const data = await UserLayerModel.getAllUserAssignedGeoLayer();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching layer assignments:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
},

getAllUserGeoLayerAssignmentsByUser: async (req, res) => {

  const {user_id} = req.params;

  console.log(user_id);
  

    console.log("Fetching all user geo layer assignments...");
    

  try {
    const data = await UserLayerModel.getAllUserAssignedGeoLayerByUserId(user_id);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching layer assignments:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
},



};

export default UserGeoLayer;
