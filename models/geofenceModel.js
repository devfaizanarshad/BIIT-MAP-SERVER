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

  // Fetch a geofence by Employee ID
  getGeofencesByEmployeeId: async (employeeId) => {
    try {
      const query = `
        SELECT 
            eg.employee_id,
            eg.geo_id,
            g.name AS geofence_name,
            g.boundary AS geofence_boundary,
            eg.type AS access_type,
            eg.start_date,
            eg.end_date,
            eg.start_time,
            eg.end_time,
            eg.is_active,
            eg.is_violating
        FROM 
            Employee_Geofence eg
        JOIN 
            Geofence g ON eg.geo_id = g.geo_id
        WHERE 
            eg.employee_id = $1;
      `;

      const result = await db.query(query, [employeeId]);
      return result.rows;
    } catch (error) {
      console.error("Error fetching geofences for employee:", error);
      throw new Error("Database error while fetching geofences for employee");
    }
  },

  getGeofencesByEmployee: async (filters) => {
    try {
      const { employeeId, geoId } = filters;
  
      // Start building the query
      let query = `
        SELECT 
            eg.employee_id,
            eg.geo_id,
            g.name AS geofence_name,
            g.boundary AS geofence_boundary,
            eg.type AS access_type,
            eg.start_date,
            eg.end_date,
            eg.start_time,
            eg.end_time,
            eg.is_active,
            eg.is_violating
        FROM 
            Employee_Geofence eg
        JOIN 
            Geofence g ON eg.geo_id = g.geo_id
        JOIN 
            Employee e ON e.employee_id = eg.employee_id
      `;
  
      // Add WHERE clause dynamically based on filters
      const conditions = [];
      const values = [];
  
      if (employeeId) {
        conditions.push("eg.employee_id = $1");
        values.push(employeeId);
      }
  
      if (geoId) {
        conditions.push(`eg.geo_id = $${values.length + 1}`);
        values.push(geoId);
      }
  
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
  
      // Execute the query with dynamic values
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error fetching geofences for employees:", error);
      throw new Error("Database error while fetching geofences for employee");
    }
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
    console.log(result);
    
    return result.rows[0]; // Return the disabled geofence
  },

/// Get geofence by name
  getGeofenceByName: async (name) => {
    try {
      const query = `
        SELECT * 
        FROM geofence
        WHERE name = $1 AND is_deleted = FALSE;
      `;
      const values = [name];
      const result = await db.query(query, values);

      // Check if a geofence was found and return the result
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error("Error fetching geofence by name:", error);
      throw new Error("Error fetching geofence by name");
    }
  },
};

export default GeofenceModel;
