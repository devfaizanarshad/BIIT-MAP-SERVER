import db from "../config/db.js"; // Database connection

const VehicleModel = {
  // Insert a new vehicle
  createVehicle: async (model, year, image, is_available = true) => {
    const query = `
      INSERT INTO Vehicle (model, year, image, is_available) 
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [model, year, image, is_available];
    const result = await db.query(query, values);
    return result.rows[0]; 
  },

  // Fetch a vehicle by ID
  getVehicleById: async (vehicleId) => {
    const query = `SELECT * FROM vehicle WHERE vehicle_id = $1 AND is_deleted = FALSE;`;
    const result = await db.query(query, [vehicleId]);
    return result.rows[0];
  },

  // Fetch all vehicles
  getAllVehicles: async () => {
    const query = `SELECT * FROM Vehicle WHERE is_deleted = FALSE;`;
    const result = await db.query(query);
    return result.rows; 
  },

  // Update vehicle details
  updateVehicle: async (vehicleId, model, year, image, is_available) => {
    
    console.log(vehicleId, model, year, image, is_available);
    
    
    const query = `
      UPDATE vehicle 
      SET model = $1, year = $2, is_available = $3 , image = $4
      WHERE vehicle_id = $5 RETURNING *;
    `;
    const values = [model, year, is_available, image, vehicleId];
    const result = await db.query(query, values);
    return result.rows[0]; 
  },

  // Soft delete a vehicle
  deleteVehicle: async (vehicleId) => {
    const query = `UPDATE vehicle SET is_deleted = TRUE WHERE vehicle_id = $1 RETURNING *;`;
    const result = await db.query(query, [vehicleId]);
    return result.rows[0]; 
  },

  // Assign a vehicle to an employee
  assignVehicleToEmployee: async (employeeId, vehicleId) => {
    const query = `
      INSERT INTO employee_vehicle (employee_id, vehicle_id, assign_date, return_date) 
      VALUES ($1, $2, NOW(), NULL) RETURNING *;
    `;
    const values = [employeeId, vehicleId];
    const result = await db.query(query, values);
    return result.rows[0]; 
  },

  // Fetch vehicles assigned to an employee
getVehiclesByEmployeeId: async (employeeId) => {
  const query = `
    SELECT v.*
    FROM vehicle v
    JOIN employee_vehicle ev ON v.vehicle_id = ev.vehicle_id
    WHERE ev.employee_id = $1 AND v.is_deleted = FALSE AND ev.return_date IS NULL;
  `;
  const result = await db.query(query, [employeeId]);
  return result.rows; // Returns an array of vehicles
}
};

export default VehicleModel;
