import db from "../config/db.js";

const LayerModel = {
createLayer: async (name, type, description, image, is_public = false) => {
  const query = `
    INSERT INTO layer_type (name, type, description, image, is_public)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await db.query(query, [name, type, description, image, is_public]);
  return result.rows[0];
},


  getAllLayers: async () => {
    const query = `SELECT * FROM layer_type WHERE is_public = FALSE ORDER BY id DESC`;
    const result = await db.query(query);
    return result.rows;
  },

  getLayersByType: async (type) => {
    const query = `SELECT * FROM layer_type WHERE type = $1 ORDER BY id DESC`;
    const result = await db.query(query, [type]);
    return result.rows;
  },

  getLayerById: async (id) => {
    const query = `SELECT * FROM layer_type WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

    getLayerTypeId: async (name) => {
    console.log("Fetching layer type ID for name:", name);
      
    const query = `SELECT id FROM layer_type WHERE name = $1`;
    const result = await db.query(query, [name]);
    return result.rows[0];
  },

getPublicLayers: async () => {
  console.log('i am here');
  
  const query = `SELECT * FROM layer_type WHERE is_public = TRUE ORDER BY id DESC;`;
  const result = await db.query(query);
  return result.rows;
},


  updateLayer: async (id, name, type, description, image) => {
    const query = `
      UPDATE layer_type
      SET name = $1, type = $2, description = $3, image = $4
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(query, [name, type, description, image, id]);
    return result.rows[0];
  },

  deleteLayer: async (id) => {
    const query = `DELETE FROM layer_type WHERE id = $1 RETURNING *`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  assignLayerToUser: async (user_id, layer_type_id, start_time = null, end_time = null) => {

    console.log("Assigning layer to user:", {
      user_id,
      layer_type_id,
      start_time,
      end_time
    });
    
    const query = `
      INSERT INTO user_layer_access (user_id, layer_type_id, start_time, end_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [user_id, layer_type_id, start_time, end_time];
    const result = await db.query(query, values);
    return result.rows[0];
  },

getAssignedLayers : async () => {

  const query = `
    SELECT 
      ula.id,
      u.user_id,
      u.username,
      lt.id AS layer_type_id,
      lt.name AS layer_name,
      lt.type AS layer_category,
      lt.image,
      ula.start_time,
      ula.end_time,
      ula.is_hidden
    FROM user_layer_access ula
    JOIN users u ON ula.user_id = u.user_id
    JOIN layer_type lt ON ula.layer_type_id = lt.id
    ORDER BY u.user_id, lt.name;
  `;
  const result = await db.query(query);
  return result.rows;
},

// getUserAssignedLayers : async (user_id) => {
//   const query = `
//     SELECT lt.*
//     FROM user_layer_access ula
//     JOIN layer_type lt ON lt.id = ula.layer_type_id
//     WHERE ula.user_id = $1
//     AND (ula.end_time IS NULL OR ula.end_time > NOW())
//     ORDER BY lt.name;
//   `;
//   const result = await db.query(query, [user_id]);
//   return result.rows;
// }

getUserAssignedLayers : async (user_id) => {

  console.log(user_id);
  

  const query = `
    SELECT lt.*
FROM user_layer_access ula
JOIN layer_type lt ON lt.id = ula.layer_type_id
WHERE ula.user_id = $1
  AND ula.is_hidden = FALSE
ORDER BY lt.name;

  `;
  const result = await db.query(query, [user_id]);
  return result.rows;
},

  getUserLayerById: async (id) => {
    const query = `SELECT * FROM user_layer_access WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  // Hide an employee (set is_hidden to true)
  hideUserLayer: async (Id) => {
    try {
      const Layers = await LayerModel.getUserLayerById(Id);
      console.log(Layers);
      
      if (Layers.is_hidden) {
        // If already hidden, show the Layer again
        const query = `UPDATE user_layer_access SET is_hidden = FALSE WHERE id = $1 RETURNING *;`;
        const result = await db.query(query, [Id]);
        return result.rows[0]; // Return the shown employee
      }
      const query = `UPDATE user_layer_access SET is_hidden = TRUE WHERE id = $1 RETURNING *;`;
      const result = await db.query(query, [Id]);
      return result.rows[0]; // Return the hidden employee
    } catch (error) {
      console.error('Error hiding Layer:', error);
      throw new Error('Error hiding Layer');
    }
  },

    getLocationsByType: async(name) =>{

          const query = 'SELECT * FROM map_locations WHERE loc_type = $1;';
          const values = [name];
          try {
              const result = await db.query(query, values);
              return result.rows; 
          } catch (error) {
              return res.status(500).json({ error: 'Failed to fetch locations', details: error.message });
          }
      }
  
};

export default LayerModel;
