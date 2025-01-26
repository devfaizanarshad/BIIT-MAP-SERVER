import vehicleModel from "../models/vehicleModel.js"

class VehicleController {
    // Create a new vehicle
    static async createVehicle(req, res) {
      try {
        const { model, year, image } = req.body;
    
        console.log("Request Body:", req.body);
    
        const vehicle = await vehicleModel.createVehicle(model, year, image);
    
        console.log("Database Response:", vehicle);
    
        return res.status(201).json({
          message: 'Vehicle created successfully',
          vehicle: { model, year, isActive: true }, // Assuming `isActive` defaults to true.
        });
      } catch (error) {
        console.error("Error in createVehicle:", error);
        return res.status(500).json({ message: 'Error creating vehicle' });
      }
    }
    
    // Get all vehicles
    static async getAllVehicles(req, res) {
      try {
        console.log("Fetching all vehicles...");
        const vehicles = await vehicleModel.getAllVehicles();
        console.log("Vehicles from DB:", vehicles);
    
        return res.status(200).json({ vehicles });
      } catch (error) {
        console.error("Error in getAllVehicles:", error);
        return res.status(500).json({ message: 'Error fetching vehicles' });
      }
    }
    
  // Update a vehicle
static async updateVehicle(req, res) {
  try {
    const { vehicleId } = req.params;
    const { model, year, image, is_available } = req.body;

    console.log("Request Params:", req.params);
    console.log("Request Body:", req.body);

    // Call the vehicleModel to update the vehicle
    const result = await vehicleModel.updateVehicle(vehicleId, model, year, image, is_available);

    console.log("Database Update Result:", result);

    // Check if any rows were affected
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: `Vehicle ${vehicleId} not found or no changes made` });
    }

    // Return success response
    return res.status(200).json({
      message: `Vehicle ${vehicleId} updated successfully`,
      vehicle: { vehicleId, model, year, is_available },
    });
  } catch (error) {
    console.error("Error updating vehicle:", error.message);
    return res.status(500).json({ message: `Error updating vehicle: ${error.message}` });
  }
}

    // Deactivate (soft delete) a vehicle
    static async deactivateVehicle(req, res) {
      try {
        const { vehicleId } = req.params;
        
        const vehicle = await vehicleModel.deleteVehicle(vehicleId);

        return res.status(200).json({
          message: `Vehicle ${vehicleId} deactivated successfully`,
        });
      } catch (error) {
        return res.status(500).json({ message: 'Error deactivating vehicle' });
      }
    }
  }
  
  export default VehicleController;
  