import db from "../config/db.js";  // Make sure to import your database connection
import LayerModel from '../models/Layer.js';

const ThreatSimulationModel = {

    // Create a new threat simulation
      createThreatSimulation: async (path, start_time, end_time, threat_level) => {
        console.log("Creating threat simulation with path:", path, "start_time:", start_time, "end_time:", end_time, "threat_level:", threat_level);

        const layer = await LayerModel.getLayerTypeId(threat_level);
        console.log("Layer ID:", layer);
        const id = layer.id;

        try {
          const query = `
            INSERT INTO threat_route (path, start_time, end_time, threat_level, layer_type_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
          `;
          const values = [JSON.stringify(path), start_time, end_time, threat_level, id];

          // Execute the query
          const result = await db.query(query, values);
    
          // Return the inserted row
          return result.rows[0];
        } catch (error) {
          console.error("Error creating threat simulation:", error);
          throw new Error("Failed to create threat simulation.");
        }
      },

    // Fetch all threat simulations
  getAllThreatSimulations: async () => {
        const query = `SELECT * FROM threat_route;`;
        const result = await db.query(query);
        return result.rows;
},

// Fetch threat simulations by threat level
  getThreatSimulationsByLevel: async (threat_level) => {
        const query = `
          SELECT * FROM threat_route
          WHERE threat_level = $1;
        `;
        const values = [threat_level];
        const result = await db.query(query, values);
        return result.rows;
  }

};

export default ThreatSimulationModel;
