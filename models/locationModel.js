import db from "../config/db.js";

const LocationModel = {
  // Insert a new location
  createLocation: async (name, longitude, latitude, description, image) => {
    const query = `
      INSERT INTO location (name, longitude, latitude, description, image) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [name, longitude, latitude, description, image];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Fetch a location by ID
  getLocationById: async (locationId) => {
    const query = `SELECT * FROM location WHERE location_id = $1;`;
    const result = await db.query(query, [locationId]);
    return result.rows[0];
  },

  // Fetch all locations
  getAllLocations: async () => {
    const query = `SELECT * FROM location;`;
    const result = await db.query(query);
    return result.rows;
  },

  // Update a location
  updateLocation: async (locationId, name, longitude, latitude, description, image) => {
    const query = `
      UPDATE location 
      SET name = $1, longitude = $2, latitude = $3, description = $4, image = $5 
      WHERE location_id = $6 RETURNING *;
    `;
    const values = [name, longitude, latitude, description, image, locationId];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Delete a location
  deleteLocation: async (locationId) => {
    const query = `DELETE FROM location WHERE location_id = $1 RETURNING *;`;
    const result = await db.query(query, [locationId]);
    return result.rows[0];
  },
};

export default LocationModel;
