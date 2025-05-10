import db from "../config/db.js";  // Make sure to import your database connection

const CarSimulationModel = {
  
  // Create a new car simulation
  createCarSimulation: async (path, speed, start_time, end_time, is_congested) => {
    try {
      const query = `
        INSERT INTO car_simulations (path, speed, start_time, end_time, is_congested)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
      const values = [JSON.stringify(path), speed, start_time, end_time, is_congested];

      // Execute the query
      const result = await db.query(query, values);

      // Return the inserted row
      return result.rows[0];
    } catch (error) {
      console.error("Error creating car simulation:", error);
      throw new Error("Failed to create car simulation.");
    }
  },

  // Fetch all car simulations
  getAllCarSimulations: async () => {
    const query = `SELECT * FROM car_simulations;`;
    const result = await db.query(query);
    return result.rows;  // Return all car simulations
  },

  // Fetch car simulation by ID
  getCarSimulationById: async (car_id) => {
    const query = `SELECT * FROM car_simulations WHERE car_id = $1;`;
    const result = await db.query(query, [car_id]);
    return result.rows[0];  // Return a specific car simulation
  },

  // Update a car simulation
  updateCarSimulation: async (car_id, path, speed, start_time, end_time, is_congested) => {
    const query = `
      UPDATE car_simulations
      SET path = $1, speed = $2, start_time = $3, end_time = $4, is_congested = $5
      WHERE car_id = $6 RETURNING *;
    `;
    const values = [JSON.stringify(path), speed, start_time, end_time, is_congested, car_id];

    const result = await db.query(query, values);
    return result.rows[0];  // Return the updated car simulation
  },

  // Soft delete (deactivate) a car simulation
  disableCarSimulation: async (car_id) => {
    const query = `
      UPDATE car_simulations
      SET is_active = FALSE
      WHERE car_id = $1 RETURNING *;
    `;
    const result = await db.query(query, [car_id]);
    return result.rows[0];  // Return the deactivated car simulation
  },

  checkCongestionForAllCars: async (graphhopperCoordinates) => {
    try {
      const query = `
        SELECT * FROM check_congestion_for_all_cars($1::jsonb);
      `;
  
      const result = await db.query(query, [JSON.stringify(graphhopperCoordinates)]);
  
      const data = result.rows[0];
  
      return {
        status: data.congestion_status,
        matchedPoints: data.matched_points
      };
    } catch (error) {
      console.error("Error calling the congestion check function:", error);
      throw new Error("Failed to check congestion for all cars.");
    }
  }
  
  
};



export default CarSimulationModel;
