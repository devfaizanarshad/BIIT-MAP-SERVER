import db from "../config/db.js"; 

const ManagerModel = {
  // Insert a new manager
  createManager: async (userId) => {
    try {
      const query = `
        INSERT INTO manager (user_id) 
        VALUES ($1) RETURNING *;
      `;
      const values = [userId];
      const result = await db.query(query, values);
      return result.rows[0]; // Return the created manager
    } catch (error) {
      console.error('Error creating manager:', error);
      throw new Error('Error creating manager');
    }
  }, 

  // Fetch a manager by ID
  getManagerById: async (managerId) => {
    try {
      const query = `SELECT * FROM manager WHERE manager_id = $1;`;
      const result = await db.query(query, [managerId]);
      return result.rows[0]; // Return the manager
    } catch (error) {
      console.error('Error fetching manager:', error);
      throw new Error('Error fetching manager');
    }
  },

  // Fetch all managers
  getAllManagers: async () => {
    try {
      const query = `SELECT * FROM manager;`;
      const result = await db.query(query);
      return result.rows; // Return all managers
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw new Error('Error fetching managers');
    }
  },

  // Update manager details
  updateManager: async (managerId, assignDate, resignDate) => {
    try {
      const query = `
        UPDATE manager 
        SET assign_date = $1, resign_date = $2 
        WHERE manager_id = $3 RETURNING *;
      `;
      const values = [assignDate, resignDate, managerId];
      const result = await db.query(query, values);
      return result.rows[0]; // Return the updated manager
    } catch (error) {
      console.error('Error updating manager:', error);
      throw new Error('Error updating manager');
    }
  },

  // Delete a manager (set is_active to false)
  deleteManager: async (managerId) => {
    try {
      const query = `UPDATE manager SET is_deleted = TRUE WHERE manager_id = $1 RETURNING *;`;
      const result = await db.query(query, [managerId]);
      return result.rows[0]; // Return the disabled manager
    } catch (error) {
      console.error('Error deleting manager:', error);
      throw new Error('Error deleting manager');
    }
  },

getEmployeesByManagerId: async (managerId) => {
  try {
    const query = `
      SELECT 
        e.employee_id,
        e.first_name,
        e.last_name,
        e.address,
        e.city,
        e.phone,
        e.image,
        m.manager_id,
        m.user_id AS manager_user_id
      FROM 
        Employee e
      INNER JOIN 
        Employee_Branch eb ON e.employee_id = eb.employee_id
      INNER JOIN 
        Manager_Branch mb ON eb.branch_id = mb.branch_id
      INNER JOIN 
        Manager m ON mb.manager_id = m.manager_id
      WHERE 
        m.manager_id = $1;
    `;
    const result = await db.query(query, [managerId]);
    return result.rows; // Return the list of employees
  } catch (error) {
    console.error("Error fetching employees for manager:", error);
    throw new Error("Error fetching employees for manager");
  }
},

// Fetch current locations of employees under a specific manager
getEmployeeLocationsByManagerId: async (managerId) => {
  try {
    const query = `
      SELECT 
        e.employee_id,
        e.first_name,
        e.last_name,
        e.city,
        ul.longitude,
        ul.latitude,
        ul.created_at AS location_timestamp
      FROM 
        Employee e
      INNER JOIN 
        Employee_Branch eb ON e.employee_id = eb.employee_id
      INNER JOIN 
        Manager_Branch mb ON eb.branch_id = mb.branch_id
      INNER JOIN 
        Manager m ON mb.manager_id = m.manager_id
      INNER JOIN 
        UserLocation ul ON e.user_id = ul.user_id
      WHERE 
        m.manager_id = $1
      ORDER BY 
        ul.created_at DESC;
    `;
    const result = await db.query(query, [managerId]);
    return result.rows; // Return the list of employees with their locations
  } catch (error) {
    console.error("Error fetching employee locations for manager:", error);
    throw new Error("Error fetching employee locations for manager");
  }
},

getEmployeeViolations: async (managerId) => {
  try {
    // Step 1: Get the employees of the manager
    const employees = await ManagerModel.getEmployeesByManagerId(managerId);

    // Step 2: Extract the employee IDs
    const employeeIds = employees.map(emp => emp.employee_id);

    if (employeeIds.length === 0) {
      return { message: 'No employees found under this manager.' };
    }

    // Step 3: Fetch violations for the employees
    const query = `
      SELECT 
        ev.ulocation_id, 
        ev.violation_type, 
        ev.violation_time, 
        ev.geo_id, 
        g.name AS geo_name, 
        e.employee_id, 
        e.first_name, 
        e.last_name
      FROM 
        UserLocation_Geofence_Violation ev
      JOIN 
        UserLocation ul ON ev.ulocation_id = ul.ulocation_id
      JOIN 
        Employee e ON ul.user_id = e.user_id
      LEFT JOIN 
        Geofence g ON ev.geo_id = g.geo_id
      WHERE 
        e.employee_id = ANY($1::int[])  -- Replace $1 with an array of employee IDs
      ORDER BY 
        ev.violation_time DESC;
    `
    
    const result = await db.query(query, [employeeIds]);
    
    console.log(result);
    
    return result.rows; // Return the violation data
  } catch (error) {
    console.error("Error fetching employee violations:", error);
    throw new Error("Error fetching employee violations");
  }
},

getEmployeeLocationById : async (employeeId) => {
  try {
    const query = `
      SELECT 
        e.employee_id,
        e.first_name,
        e.last_name,
        e.city,
        ul.longitude,
        ul.latitude,
        ul.created_at AS location_timestamp
      FROM 
        Employee e
      JOIN 
        UserLocation ul ON e.user_id = ul.user_id
      WHERE 
        e.employee_id = $1
      ORDER BY ul.created_at DESC
      LIMIT 1;
    `;
    const result = await db.query(query, [employeeId]);
    
    return result.rows[0]; // Return the latest location of the employee
  } catch (error) {
    console.error("Error fetching employee location:", error);
    throw new Error("Error fetching employee location");
  }

},

getViolationHistoryForEmployee: async (employeeId) => {
  try {
    const query = `
      SELECT 
        ev.ulocation_id, 
        ev.violation_type, 
        ev.violation_time, 
        ev.geo_id, 
        g.name AS geo_name
      FROM 
        UserLocation_Geofence_Violation ev
      JOIN 
        Geofence g ON ev.geo_id = g.geo_id
      WHERE 
        ev.ulocation_id IN (
          SELECT ulocation_id 
          FROM UserLocation 
          WHERE user_id = $1 -- Specific employee ID
        )
      ORDER BY 
        ev.violation_time DESC;
    `;
    const result = await db.query(query, [employeeId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching violation history for employee:', error);
    throw new Error('Error fetching violation history for employee');
  }
},

getEmployeeViolationsByDate: async (managerId, violationDate) => {
  try {
    const employees = await ManagerModel.getEmployeesByManagerId(managerId);
    const employeeIds = employees.map((emp) => emp.employee_id);

    if (employeeIds.length === 0) {
      return { message: 'No employees found under this manager.' };
    }

    const query = `
      SELECT 
        ev.ulocation_id, 
        ev.violation_type, 
        ev.violation_time, 
        ev.geo_id, 
        g.name AS geo_name, 
        e.employee_id, 
        e.first_name, 
        e.last_name
      FROM 
        UserLocation_Geofence_Violation ev
      JOIN 
        UserLocation ul ON ev.ulocation_id = ul.ulocation_id
      JOIN 
        Employee e ON ul.user_id = e.user_id
      LEFT JOIN 
        Geofence g ON ev.geo_id = g.geo_id
      WHERE 
        e.employee_id = ANY($1::int[]) 
        AND DATE(ev.violation_time) = $2 -- Filter by date
      ORDER BY 
        ev.violation_time DESC;
    `;
    const result = await db.query(query, [employeeIds, violationDate]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching employee violations by date:', error);
    throw new Error('Error fetching employee violations by date');
  }
},

getViolationHistoryForGroup: async (employeeIds) => {
  try {
    if (!employeeIds || employeeIds.length === 0) {
      throw new Error("Employee IDs are required to fetch violation history.");
    }

    const query = `
      SELECT 
        ev.ulocation_id, 
        ev.violation_type, 
        ev.violation_time, 
        ev.geo_id, 
        g.name AS geo_name, 
        e.employee_id, 
        e.first_name, 
        e.last_name
      FROM 
        UserLocation_Geofence_Violation ev
      JOIN 
        UserLocation ul ON ev.ulocation_id = ul.ulocation_id
      JOIN 
        Employee e ON ul.user_id = e.user_id
      LEFT JOIN 
        Geofence g ON ev.geo_id = g.geo_id
      WHERE 
        e.employee_id = ANY($1::int[]) -- Filter by group of employee IDs
      ORDER BY 
        ev.violation_time DESC;
    `;
    const result = await db.query(query, [employeeIds]); // Pass an array of employee IDs
    return result.rows; // Return the violation history for the group
  } catch (error) {
    console.error("Error fetching violation history for group:", error);
    throw new Error("Error fetching violation history for group");
  }
}

};

export default ManagerModel;
