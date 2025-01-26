import EmployeeModel from "../models/employeeModel.js";
import EmployeeGeofenceModel from "../models/geofenceModel.js";
import VehicleModel from "../models/vehicleModel.js";


class EmployeeController {    
  
    // Get all employees
    static async getAllEmployees(req, res) {
      try {
        // Mock data
        const employees = await EmployeeModel.getAllEmployees();

        return res.status(200).json({ employees });
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching employees' });
      }
    }
  
    // Update an employee
    static async updateEmployee(req, res) {
      try {
        const { employeeId } = req.params;
        const { firstName, lastName, address, city, phone, image } = req.body;
       
        console.log(req.params, req.body
        );
        

        const employee = await EmployeeModel.updateEmployee(employeeId, firstName, lastName, address, city, phone, image)

        return res.status(200).json({
          message: `Employee ${employeeId} updated successfully`,
          employee: { employeeId, firstName, lastName, address, phone, image },
        });
      } catch (error) {
        return res.status(500).json({ message: 'Error updating employee' });
      }
    }
  
    // Deactivate (soft delete) an employee
    static async deactivateEmployee(req, res) {
      try {
        const { employeeId } = req.params;

        const employee = await EmployeeModel.deleteEmployee(employeeId)

        // Mock success response
        return res.status(200).json({
          message: `Employee ${employeeId} deactivated successfully`,
        });
      } catch (error) {
        return res.status(500).json({ message: 'Error deactivating employee' });
      }
    }

    // Get employee profile 
  static async getProfile(req, res) {
    try {
      const {employeeId} = req.params; 

      const profile = await EmployeeModel.getEmployeeById(employeeId);

      return res.status(200).json({ profile });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching employee profile' });
    }
  }

    // Get assigned geofences (mock response)
    static async getAssignedGeofences(req, res) {
      try {
        const { employeeId } = req.params;
    
        if (!employeeId || isNaN(employeeId)) {
          return res.status(400).json({ message: 'Invalid or missing employeeId' });
        }
    
        console.log(`Fetching geofences for employeeId: ${employeeId}`);
        const geofences = await EmployeeGeofenceModel.getGeofenceById(employeeId);
    
        if (!geofences || geofences.length === 0) {
          return res.status(404).json({ message: 'No geofences found for the employee' });
        }
    
        console.log(`Geofences fetched: `, geofences);
        return res.status(200).json({ geofences });
      } catch (error) {
        console.error('Error fetching geofences:', error);
        return res.status(500).json({ message: 'Error fetching assigned geofences' });
      }
    }

      // Get assigned vehicles (mock response)
  static async getAssignedVehicles(req, res) {
    try {
      const { employeeId } = req.params;
    
      if (!employeeId || isNaN(employeeId)) {
        return res.status(400).json({ message: 'Invalid or missing employeeId' });
      }
    
      console.log(`Fetching vehicles for employeeId: ${employeeId}`);
      const vehicles = await VehicleModel.getVehiclesByEmployeeId(employeeId);
    
      if (!vehicles || vehicles.length === 0) {
        return res.status(404).json({ message: 'No vehicles found for the employee' });
      }
    
      console.log(`Vehicles fetched: `, vehicles);
      return res.status(200).json({ vehicles });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return res.status(500).json({ message: 'Error fetching assigned vehicles' });
    }
  }
    
  }
  
  export default EmployeeController;
  