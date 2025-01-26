import GeofenceModel from "../models/geofenceModel.js";

class GeofenceController {
    // Create a new geofence
    static async createGeofence(req, res) {
      try {
        const { name, boundary} = req.body;
    
        // Ensure boundary is parsed as an array of objects
        const parsedBoundary = Array.isArray(boundary)
          ? boundary
          : JSON.parse(boundary);
    
        // Validate boundary format
        if (
          !Array.isArray(parsedBoundary) ||
          !parsedBoundary.every(
            (point) => typeof point.latitude === 'number' && typeof point.longitude === 'number'
          )
        ) {
          return res.status(400).json({
            message: 'Invalid boundary format. It must be an array of {latitude, longitude} objects.',
          });
        }
    
        // Save geofence
        const geofence = await GeofenceModel.createGeofence(
          name,
          parsedBoundary
        );
    
        return res.status(201).json({
          message: 'Geofence created successfully',
          geofence,
        });
      } catch (error) {
        console.error('Error creating geofence:', error);
        return res.status(500).json({ message: 'Error creating geofence' });
      }
    }
    
    // Get all geofences
    static async getAllGeofences(req, res) {
      try {
        // Mock data
        const geofences = await GeofenceModel.getAllGeofences();
        return res.status(200).json({ geofences });
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching geofences' });
      }
    }
  
    static async updateGeofence(req, res) {
      try {
        const { geoId } = req.params;
        const { name, coordinates} = req.body;
    
        console.log('Request Params:', req.params);
        console.log('Request Body:', req.body);
    
        const updatedResult = await GeofenceModel.updateGeofence(geoId, name, coordinates);
    
        console.log('Update Result:', updatedResult);
    
        if (!updatedResult) {
          console.log('Update failed: No rows affected.');
          return res.status(404).json({ message: `Geofence ${geoId} not found or not updated` });
        }
    
        return res.status(200).json({
          message: `Geofence ${geoId} updated successfully`,
          geofence: { geoId, name, coordinates},
        });
      } catch (error) {
        console.error('Error in updateGeofence:', error);
        return res.status(500).json({ message: 'Error updating geofence', error: error.message });
      }
    }
    
    // Deactivate (soft delete) a geofence
    static async deactivateGeofence(req, res) {
      try {
        const { geoId } = req.params;
        
        const geofence = GeofenceModel.deleteGeofence(geoId)

        return res.status(200).json({
          message: `Geofence ${geoId} deactivated successfully`,
        });
      } catch (error) {
        return res.status(500).json({ message: 'Error deactivating geofence' });
      }
    }
  }
  
  export default GeofenceController;
  