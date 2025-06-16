import pool from "../config/db.js";


class MapLocationController {
    // Add a new location
    async addLocation(req, res) {
        console.log("Hello in add location");
        
        const { latitude, longitude, name, description, type} = req.body;
        console.log(req.body.image_url);
        
        let image = null;
        if (req.body.image_url) {
          image = `/uploads/${req.body.name}`;  
        }

        const query = `
            INSERT INTO map_locations (latitude, longitude, name, description, image_url, created_at, loc_type)
            VALUES ($1, $2, $3, $4, $5, NOW(), $6)
            RETURNING *;
        `;
        const values = [latitude, longitude, name, description, image, type];

        try {
            const result = await pool.query(query, values);
            return res.status(201).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to add location', details: error.message });
        }
    }

    // Get all locations
    async getLocationsByType(req, res) {

        const {type} = req.body;
        const query = 'SELECT * FROM map_locations WHERE loc_type = $1;';
        const values = [type];
        try {
            const result = await pool.query(query, values);
            return res.status(200).json(result.rows);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch locations', details: error.message });
        }
    }

    // Get a specific location by ID
    async getLocationById(req, res) {
        const { id } = req.params;
        const query = 'SELECT * FROM map_locations WHERE id = $1;';
        const values = [id];

        try {
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Location not found' });
            }

            return res.status(200).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch location', details: error.message });
        }
    }

    // Update a location
    async updateLocation(req, res) {
        const { id } = req.params;
        const { latitude, longitude, name, description, image_url } = req.body;

        const query = `
            UPDATE map_locations
            SET latitude = $1, longitude = $2, name = $3, description = $4, image_url = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [latitude, longitude, name, description, image_url, id];

        try {
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Location not found' });
            }

            return res.status(200).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update location', details: error.message });
        }
    }

    // Delete a location
    async deleteLocation(req, res) {
        const { id } = req.params;

        const query = 'DELETE FROM map_locations WHERE id = $1 RETURNING *;';
        const values = [id];

        try {
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Location not found' });
            }

            return res.status(200).json({ message: 'Location deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete location', details: error.message });
        }
    }
}

export default new MapLocationController();
