import db from "../config/db.js";
import GeofenceModel from "./geofenceModel.js"
import LayerModel from "./Layer.js";

const UserLayerModel = {
createUserGeoLayer: async (geo_id, user_id, layer_type_id, is_permitted) => {

  console.log(geo_id, user_id, layer_type_id, is_permitted);
  

  const query = `
    INSERT INTO User_Geofence_Layer (geo_id, user_id, layer_type_id, is_permitted)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
   `;
  const result = await db.query(query, [geo_id, user_id, layer_type_id, is_permitted]);
  return result.rows[0];
},


getAllUserGeoLayer: async () => {
    const query = `SELECT * FROM User_Geofence_Layer ORDER BY id DESC`;
    const result = await db.query(query);
    return result.rows;
  },

getAllUserGeoLayerById: async (id) => {
  console.log("getAllUserGeoLayer", id);
  
    const query = `SELECT * FROM User_Geofence_Layer WHERE ugl_id = $1`;
    const result = await db.query(query, [id]);
    return result.rows;
  },

getAllUserGeoLayerPermitted: async () => {
    const query = `SELECT * FROM User_Geofence_Layer WHERE is_permitted = TRUE ORDER BY id DESC`;
    const result = await db.query(query);
    return result.rows;
  },

getAllUserGeoLayerBYUserId: async (user_id) => {
    const query = `SELECT * FROM User_Geofence_Layer WHERE user_id = $1 ORDER BY id DESC`;
    const result = await db.query(query, [user_id]);
    return result.rows;
  },

    // Hide an layer premission (set is_hidden to true)
permittedUserGeoLayer: async (Id) => {

  console.log(Id);
  

    try {
      const Layers = await UserLayerModel.getAllUserGeoLayerById(Id);
      console.log("Layers", Layers);
  
      
      if (Layers[0].is_permitted) {

      console.log("is_premitted is true", Layers[0].is_permitted);
        // If already hidden, show the Layer again
        const query = `UPDATE User_Geofence_Layer SET is_permitted = FALSE WHERE ugl_id = $1 RETURNING *;`;
        const result = await db.query(query, [Id]);
        return result.rows[0]; // Return the shown User Geo Layer
      }
      console.log("is_premitted is false", Layers[0].is_permitted);

      const query = `UPDATE User_Geofence_Layer SET is_permitted = TRUE WHERE ugl_id = $1 RETURNING *;`;
      const result = await db.query(query, [Id]);
      console.log(result);
      
      return result.rows[0]; // Return the hidden User Geo Layer
    } catch (error) {
      console.error('Error hiding Layer:', error);
      throw new Error('Error hiding Layer');
    }
  },

deleteLayer: async (id) => {
    const query = `DELETE FROM User_Geofence_Layer WHERE ugl_id = $1 RETURNING *`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

getAllUserAssignedGeoLayer: async () => {
const query = `SELECT *, g.name AS GeofenceName FROM user_geofence_layer ugl 
JOIN geofence g on g.geo_id = ugl.geo_id
JOIN layer_type l on l.id = ugl.layer_type_id
JOIN users u on u.user_id = ugl.user_id`;
    const result = await db.query(query);
    return result.rows;
  },

getAllUserAssignedGeoLayerByUserId: async (user_id) => {
const query = `SELECT *, g.name AS GeofenceName FROM user_geofence_layer ugl 
JOIN geofence g on g.geo_id = ugl.geo_id
JOIN layer_type l on l.id = ugl.layer_type_id
JOIN users u on u.user_id = ugl.user_id
WHERE ugl.user_id = ${user_id}`
;
    const result = await db.query(query);
    return result.rows;
  },


  
  
};

export default UserLayerModel;
