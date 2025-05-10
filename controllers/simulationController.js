import CarSimulationModel from "../models/carSimulationModel.js";

const CarSimulationController = {
  
  // Create a new car simulation
  createCarSimulation: async (req, res) => {
    try {
      const { path, speed, start_time, end_time, is_congested } = req.body;
      
      // Validate inputs (can add more validation if needed)
      if (!path || !speed || !start_time || !end_time) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const newSimulation = await CarSimulationModel.createCarSimulation(
        path,
        speed,
        start_time,
        end_time,
        is_congested
      );

      return res.status(201).json({
        message: "Car simulation created successfully",
        data: newSimulation
      });
    } catch (error) {
      console.error("Error in creating car simulation:", error);
      return res.status(500).json({ message: "Failed to create car simulation" });
    }
  },

  // Get all car simulations
  getAllCarSimulations: async (req, res) => {
    try {
      const simulations = await CarSimulationModel.getAllCarSimulations();
      return res.status(200).json({
        message: "Car simulations fetched successfully",
        data: simulations
      });
    } catch (error) {
      console.error("Error fetching car simulations:", error);
      return res.status(500).json({ message: "Failed to fetch car simulations" });
    }
  },

  // Get a specific car simulation by ID
  getCarSimulationById: async (req, res) => {
    try {
      const { car_id } = req.params;
      const simulation = await CarSimulationModel.getCarSimulationById(car_id);

      if (!simulation) {
        return res.status(404).json({ message: "Car simulation not found" });
      }

      return res.status(200).json({
        message: "Car simulation fetched successfully",
        data: simulation
      });
    } catch (error) {
      console.error("Error fetching car simulation:", error);
      return res.status(500).json({ message: "Failed to fetch car simulation" });
    }
  },

  // Update an existing car simulation
  updateCarSimulation: async (req, res) => {
    try {
      const { car_id } = req.params;
      const { path, speed, start_time, end_time, is_congested } = req.body;

      // Validate inputs
      if (!path || !speed || !start_time || !end_time) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const updatedSimulation = await CarSimulationModel.updateCarSimulation(
        car_id,
        path,
        speed,
        start_time,
        end_time,
        is_congested
      );

      return res.status(200).json({
        message: "Car simulation updated successfully",
        data: updatedSimulation
      });
    } catch (error) {
      console.error("Error updating car simulation:", error);
      return res.status(500).json({ message: "Failed to update car simulation" });
    }
  },

  // Disable (soft delete) a car simulation
  disableCarSimulation: async (req, res) => {
    try {
      const { car_id } = req.params;

      const disabledSimulation = await CarSimulationModel.disableCarSimulation(car_id);

      if (!disabledSimulation) {
        return res.status(404).json({ message: "Car simulation not found" });
      }

      return res.status(200).json({
        message: "Car simulation disabled successfully",
        data: disabledSimulation
      });
    } catch (error) {
      console.error("Error disabling car simulation:", error);
      return res.status(500).json({ message: "Failed to disable car simulation" });
    }
  },

  checkCongestion: async (req, res) => {
    try {
      // Extract graphhopper coordinates from the request body
      const { graphhopper_coordinates } = req.body;

      console.log(graphhopper_coordinates);
      

      // If coordinates are not provided, send a 400 error response
      if (!graphhopper_coordinates || !Array.isArray(graphhopper_coordinates)) {
        return res.status(400).json({
          message: "Invalid input. Please provide valid graphhopper_coordinates in array format.",
        });
      }

      // Call the CarSimulationModel to check congestion
      const result = await CarSimulationModel.checkCongestionForAllCars(graphhopper_coordinates);

      // Return a success response along with the result of the procedure
      return res.status(200).json({
        message: "Congestion check completed successfully.",
        result,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error occurred in checkCongestion controller:", error);

      return res.status(500).json({
        message: "Failed to check congestion.",
        error: error.message,
      });
    }
  },

};

export default CarSimulationController;
