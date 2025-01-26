import db from "../config/db.js";

const UserLocationGeofenceViolationModel = {

  // Create a geofence violation record
  createViolation: async (ulocationId, geoId, violationType, violationTime) => {
    const query = `
      INSERT INTO userlocation_geofence_violation (ulocation_id, geo_id, violation_type, violation_time) 
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [ulocationId, geoId, violationType, violationTime];
    const result = await db.query(query, values);
    return result.rows[0];  // Returns the created violation record
  },

  // Fetch all active violations
  getAllViolations: async () => {
    const query = `SELECT * FROM userlocation_geofence_violation WHERE is_active = TRUE;`;
    const result = await db.query(query);
    return result.rows;  // Returns all active violation records
  },

  // Fetch violations by user location ID
  getViolationsByLocationId: async (ulocationId) => {
    const query = `
      SELECT * FROM userlocation_geofence_violation 
      WHERE ulocation_id = $1 AND is_active = TRUE;
    `;
    const result = await db.query(query, [ulocationId]);
    return result.rows;  // Returns the violations associated with a particular location
  },

  // Soft delete (deactivate) a violation record
  disableViolation: async (violationId) => {
    const query = `
      UPDATE userlocation_geofence_violation 
      SET is_active = FALSE 
      WHERE violation_id = $1 
      RETURNING *;
    `;
    const result = await db.query(query, [violationId]);
    return result.rows[0];  // Returns the updated violation record
  }
};

export default UserLocationGeofenceViolationModel;
