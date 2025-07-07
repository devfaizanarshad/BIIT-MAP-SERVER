import db from "../config/db.js";
import EmployeeController from "../controllers/employeeController.js";
import EmployeeModel from "./employeeModel.js";

const UserLocationModel = {
  // Insert a new user location
  createUserLocation: async (userId, longitude, latitude) => {

    console.log("Before insert", userId, longitude, latitude);

    const res = await EmployeeModel.getEmployeeById(userId);
    console.log(res.user_id);
  

    const query = `
      INSERT INTO userlocation (user_id, longitude, latitude) 
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [res.user_id, longitude, latitude];
    const result = await db.query(query, values);

    console.log("After insert", result);
    
    return result.rows[0]; // Returns the created location
  },

  // Fetch a user's location by location ID
  getUserLocationById: async (locationId) => {
    const query = `SELECT * FROM userlocation WHERE ulocation_id = $1 AND is_active = TRUE;`;
    const result = await db.query(query, [locationId]);
    return result.rows[0]; // Returns the location details
  },

  // Fetch all locations for a specific user
  getLocationsByUserId: async (userId) => {
    const query = `
      SELECT * FROM userlocation 
      WHERE user_id = $1 AND is_active = TRUE 
      ORDER BY date DESC, time DESC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows; // Returns the location history for the user
  },

  // Soft delete a user location (mark as inactive)
  deleteUserLocation: async (locationId) => {
    const query = `
      UPDATE userlocation 
      SET is_active = FALSE 
      WHERE ulocation_id = $1 
      RETURNING *;
    `;
    const result = await db.query(query, [locationId]);
    return result.rows[0]; // Returns the updated location record
  },

  // Fetch geofence data for the user
  getEmployeeGeofence: async (employee_id) => {
    const query = `
      SELECT 
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
        g.geo_id,
        g.name AS geofence_name,
        g.boundary AS geofence_boundary,
        eg.is_active,
        eg.is_violating,
        eg.start_time,
        eg.end_time,
        eg.start_date,
        eg.end_date,
        eg.type
      FROM 
        Employee_Geofence eg
      JOIN 
        Employee e ON eg.employee_id = e.employee_id
      JOIN 
        Geofence g ON eg.geo_id = g.geo_id
      WHERE 
        e.is_deleted = FALSE
        AND g.is_deleted = FALSE
        AND e.employee_id = $1; -- Corrected placeholder
    `;
    const result = await db.query(query, [employee_id]);
    return result.rows; // Return all geofence details for the employee
  },

   async updateGeofenceViolationStatus(employeeId, geo_id, isViolating) {
    const query = `UPDATE employee_geofence SET is_violating = $1 WHERE geo_id = $2 AND employee_id = $3`;
    await db.query(query, [isViolating, geo_id, employeeId]);
  },  

  async createViolation(userLocationId, geo_id, violationType, startTime) {
    const query = `
      INSERT INTO geofence_violation (user_location_id, geo_id, violation_type, start_time)
      VALUES ($1, $2, $3, $4)
    `;
    await db.query(query, [userLocationId, geo_id, violationType, startTime]);
  },

  async endViolation(geo_id, endTime) {
    const query = `
      UPDATE userlocation_geofence_violation 
      SET end_time = $1 
      WHERE geo_id = $2 AND end_time IS NULL
    `;
    await db.query(query, [endTime, geo_id]);
  }
  
};

export default UserLocationModel;
