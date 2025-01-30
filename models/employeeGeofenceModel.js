import db from "../config/db.js";

const EmployeeGeofenceModel = {
    
  // Assign a geofence to a user
  assignGeofenceToEmployee: async (employee_id, geoId, startDate, endDate, startTime, endTime, type) => {
    try {
      // Ensure valid type (optional, depending on your requirements)
      if (!type) {
        throw new Error("Geofence type is required");
      }
  
      const query = `
        INSERT INTO Employee_Geofence (employee_id, geo_id, start_date, end_date, start_time, end_time, type) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
      `;
      const values = [employee_id, geoId, startDate, endDate, startTime, endTime, type];
  
      // Execute the query
      const result = await db.query(query, values);
  
      // Return the inserted row
      return result.rows[0];
    } catch (error) {
      console.error("Error assigning geofence to employee:", error);
      throw new Error("Failed to assign geofence to employee.");
    }
  },
  
    
  // Fetch a user's geofence assignments by user ID
  getGeofencesByEmployeeId: async (userId) => {
    const query = `SELECT * FROM Employee_Geofence WHERE employee_Id = $1 AND is_active = TRUE;`;
    const result = await db.query(query, [userId]);
    return result.rows; 
  },

  // Fetch all geofence assignments
  getAllUserGeofences: async () => {
    const query = `SELECT * FROM Employee_Geofence WHERE is_active = TRUE;`;
    const result = await db.query(query);
    return result.rows; 
  },

  // Soft delete (deactivate) a user's geofence assignment
  disableUserGeofence: async (userId, geoId) => {
    const query = `
      UPDATE user_geofence 
      SET is_active = FALSE 
      WHERE user_id = $1 AND geo_id = $2 
      RETURNING *;
    `;
    const result = await db.query(query, [userId, geoId]);
    return result.rows[0]; 
  },
};

export default EmployeeGeofenceModel;
