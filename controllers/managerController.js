import ManagerModel from "../models/employeeGeofenceModel.js";
import VehicleModel from "../models/vehicleModel.js";
import Manager from "../models/managerModel.js";


class ManagerController {
  // Assign geofence to employee
  static async assignGeofenceToEmployees(req, res) {
    try {
      const { employeeIds, geoId, start_date, end_date, start_time, end_time, type } = req.body;
  
      // Check if employeeIds is an array and is not empty
      if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
        return res.status(400).json({ message: "Please provide a valid list of employee IDs." });
      }
  
      // Ensure valid type (optional, depending on your requirements)
      if (!type) {
        return res.status(400).json({ message: "Geofence type is required" });
      }
  
      // Loop over employeeIds and assign geofence to each employee
      for (let i = 0; i < employeeIds.length; i++) {
        const employeeId = employeeIds[i];
  
        // Check if geofence assignment already exists for this employee
        const existingAssignment = await Manager.checkGeofenceExists(employeeId, geoId);
  
        if (existingAssignment) {
          return res.status(400).json({
            message: `Geofence ${geoId} is already assigned to employee ${employeeId}.`
          });
        }
  
        // Assign geofence to the employee
        await ManagerModel.assignGeofenceToEmployee(employeeId, geoId, start_date, end_date, start_time, end_time, type);
      }
  
      // Mock success response
      return res.status(200).json({
        message: `Geofence ${geoId} assigned to employees ${employeeIds.join(', ')} successfully.`,
      });
    } catch (error) {
      console.error("Error assigning geofence to employees:", error);
      return res.status(500).json({ message: "Error assigning geofence" });
    }
  }
  
  

  // Assign vehicle to employee
  static async assignVehicleToEmployee(req, res) {
    try {
      const { employeeId, vehicleId } = req.body;
      
      const vehicle = VehicleModel.assignVehicleToEmployee(employeeId, vehicleId)

      return res.status(200).json({
        message: `Vehicle ${vehicleId} assigned to employee ${employeeId} successfully`,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error assigning vehicle" });
    }
  }

  // Monitor employee locations
  static async getEmployeeLocations(req, res) {
    try {

      const { employeeId } = req.params;
      
      // Mock data: List of employee locations
      const employeeLocations = await Manager.getEmployeeLocationById(employeeId)

      console.log(employeeLocations);


      return res.status(200).json({ employeeLocations });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching employee locations" });
    }
  }

  // View geofence violations
  static async getAllViolations(req, res) {
    try {
      // Mock data: List of violations
      const violations = [
        { violationId: 1, employeeId: 1, geoId: 1, violationTime: "2024-11-23T10:30:00" },
      ];
      return res.status(200).json({ violations });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching violations" });
    }
  }

  // Get employees under a specific manager
  static async getEmployeesByManagerId(req, res) {
    try {
      const { managerId } = req.params;
      const employees = await Manager.getEmployeesByManagerId(managerId);
      return res.status(200).json({ employees });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching employees under manager" });
    }
  }

    // Get employees under a specific manager
    static async getEmployeesLocationByManagerId(req, res) {
      try {
        const { managerId } = req.params;
        const employees = await Manager.getEmployeeLocationsByManagerId(managerId);
        return res.status(200).json({ employees });
      } catch (error) {
        return res.status(500).json({ message: "Error fetching employees locations under manager" });
      }
    }

  // Get vehicles assigned to an employee
  static async getVehiclesByEmployeeId(req, res) {
    try {
      const { employeeId } = req.params;
      // Mock data: Replace this with DB call if needed
      const vehicles = [
        { vehicleId: 1, model: "Toyota Corolla", licensePlate: "ABC-123" },
        { vehicleId: 2, model: "Honda Civic", licensePlate: "XYZ-789" },
      ];
      return res.status(200).json({ vehicles });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching vehicles for employee" });
    }
  }

  static async getEmployeeViolationsByManagerId(req, res) {
    try {
      const { managerId } = req.params;
      // Mock data: Replace this with DB call if needed

      const violation = await Manager.getEmployeeViolations(managerId);

      return res.status(200).json({ violation });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching voilations for employees" });
    }
  }

    static async getViolationsByDate(req, res) {
      try {
        const { managerId, date } = req.query;
  
        if (!managerId || !date) {
          return res.status(400).json({ message: "Missing managerId or date" });
        }
  
        // Fetch violations for the manager on the specified date
        const violations = await Manager.getEmployeeViolationsByDate(managerId, date);
  
        return res.status(200).json({ violations });
      } catch (error) {
        console.error("Error fetching violations by date:", error);
        return res.status(500).json({ message: "Error fetching violations by date" });
      }
    }
  

  // Violation by employee ID
  static async getViolationsByEmployeeId(req, res) {
    try {
      const { employeeId } = req.params; // Employee ID passed as a route parameter
      const violations = await Manager.getViolationHistoryForEmployee(employeeId);

      return res.status(200).json({ violations });
    } catch (error) {
      console.error("Error fetching violations for employee:", error);
      return res.status(500).json({ message: "Error fetching violations for employee" });
    }
  }

  // Violation for a group of employees
  static async getViolationsForGroup(req, res) {
    try {
      const { employeeIds } = req.body; // Array of employee IDs passed in the body
      if (!employeeIds || !Array.isArray(employeeIds)) {
        return res.status(400).json({ message: "Invalid employee IDs" });
      }

      const violations = await Manager.getViolationHistoryForGroup(employeeIds);

      return res.status(200).json({ violations });
    } catch (error) {
      console.error("Error fetching violations for group:", error);
      return res.status(500).json({ message: "Error fetching violations for group" });
    }
  }

  static async getFilteredViolations(req, res) {
    try {
        const { managerId, start_date, end_date, employee_id, geo_id } = req.query;

        // Call the model to fetch violations with the given filters
        const violations = await Manager.getFilteredViolationsModel(managerId, start_date, end_date, employee_id, geo_id);

        // Return the result as JSON
        return res.status(200).json({ violations });
    } catch (error) {
        console.error("Error fetching filtered violations:", error);
        return res.status(500).json({ message: "Error fetching filtered violations" });
    }
}

}

export default ManagerController;
