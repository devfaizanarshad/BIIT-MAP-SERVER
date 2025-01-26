import ManagerModel from "../models/employeeGeofenceModel.js";
import VehicleModel from "../models/vehicleModel.js";
import Manager from "../models/managerModel.js";


class ManagerController {
  // Assign geofence to employee
  static async assignGeofenceToEmployee(req, res) {
    try {
      const { employeeId, geoId, start_date, end_date, start_time, end_time, type } = req.body;


      const assignGeofence = ManagerModel.assignGeofenceToEmployee(employeeId, geoId, start_date, end_date, start_time, end_time, type);
      

      // Mock success response
      return res.status(200).json({
        message: `Geofence ${geoId} assigned to employee ${employeeId} successfully`,
      });
    } catch (error) {
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
}

export default ManagerController;
