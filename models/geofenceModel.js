import db from "../config/db.js"; 

const GeofenceModel = {
  // Create a new geofence
  createGeofence: async (name, boundary, type) => {
    const query = `
      INSERT INTO geofence (name, boundary) 
      VALUES ($1, $2) RETURNING *;
    `;
    const values = [name, JSON.stringify(boundary)]; // Serialize boundary to JSON string
    const result = await db.query(query, values);
    return result.rows[0]; // Return the created geofence
  },

  // Fetch a geofence by ID
  getGeofenceById: async (geo_id) => {
    const query = `SELECT * FROM geofence WHERE geo_id = $1;`;
    const result = await db.query(query, [geo_id]);
    return result.rows[0]; // Return the geofence
  },

  // Fetch all geofences
  getAllGeofences: async () => {
    const query = `SELECT * FROM geofence where is_deleted = FALSE;`;
    const result = await db.query(query);
    return result.rows; // Return all geofences
  },

  // Update a geofence
  updateGeofence: async (geo_id, name, boundary) => {

    console.log(geo_id, name, boundary);
    
    const query = `
      UPDATE geofence 
      SET name = $1, boundary = $2
      WHERE geo_id = $3 RETURNING *;
    `;
    const values = [name, boundary,geo_id];
    const result = await db.query(query, values);
    return result.rows[0]; // Return the updated geofence
  },

  // Delete a geofence (set is_active to false)
  deleteGeofence: async (geo_id) => {
    const query = `UPDATE geofence SET is_deleted = TRUE WHERE geo_id = $1 RETURNING *;`;
    const result = await db.query(query, [geo_id]);
    return result.rows[0]; // Return the disabled geofence
  },
};

export default GeofenceModel;
