import bcrypt from 'bcryptjs';  // Ensure bcrypt is imported
import UserModel from "../models/usersModel.js";
import EmployeeModel from "../models/employeeModel.js";
import ManagerModel from "../models/managerModel.js";
import BranchModel from "../models/branchModel.js";


class AdminController {
  // Create a new user
  static async createUser(req, res) {

    try {
      const { username, email, password, role, first_name, last_name, address, city, phone, branch_name } = req.body;

      console.log(req.body);
      console.log(req.file);
      
      
      
      let image = null;
      if (req.file) {
        image = `/uploads/${req.file.filename}`;  
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: 'Please Provide the valid email address.',
        })      
      }

    // Validate email before proceeding
    const existingUser = await UserModel.checkUserByEmail(email); // Check if email already exists
    if (existingUser) {
      return res.status(400).json({
        message: 'The email address is already in use. Please use a different email.',
      });
      }


      console.log(password);
      
      // Create the user
      const user = await UserModel.createUser(
        username,
        email,
        password,
        role
      );
      
      console.log("User created: " + JSON.stringify(user));

      // Get branch by name
      const branch = await BranchModel.getBranchByName(branch_name);
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      
      console.log("Branch found: " + branch.branch_id);

      let employee = {};
      let manager = {};

      const affectedTables = ['users']; // Track affected tables

      if (role.toLowerCase() === 'manager' || role.toLowerCase() === 'employee') {

        // Insert into Employee table
          employee = await EmployeeModel.createEmployee(
          user.user_id,
          first_name,
          last_name,
          address,
          city,
          phone,
          image
        );

        affectedTables.push('employee');

        
        console.log("Employee created: " + JSON.stringify(employee));

        // Assign employee to branch
        await BranchModel.assignEmployeeToBranch(
          employee.employee_id,
          branch.branch_id,
        );

        console.log("Employee assigned to branch");
        affectedTables.push('employee_branch');


        if (role.toLowerCase() === 'manager') {
          // Insert into Manager table
          manager = await ManagerModel.createManager(
            user.user_id,
          );

          console.log("Manager created: " + JSON.stringify(manager));
          affectedTables.push('manager');


          // Assign manager to branch
          await BranchModel.assignManagerToBranch(
            manager.manager_id,
            branch.branch_id,
          );

          console.log("Manager assigned to branch");
          affectedTables.push('manager_branch');

        }
      }

      // If user, employee, and manager objects exist, return success response
      if (user && employee && (role !== 'manager' || manager)) {
        return res.status(201).json({
          message: 'User created successfully',
          user: { username, email, role, first_name, last_name, address, city, phone, image, branch_name },
          affectedTables
        });
      } else {
        return res.status(400).json({ message: 'Error creating user or associated data affected table before error are :'+ affectedTables });
      }

    } catch (error) {
      console.error("Error: " + error);
      return res.status(500).json({ message: 'Error creating user and affected table before error are :'+ affectedTables });
    }
  }

  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      if (users.length >= 0) {
        return res.status(200).json({ users });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching users' });
    }
  }

  // Update a user
  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { username, email, role, password } = req.body;

      const users = await UserModel.updateUser(userId, username, email, password, role);

      return res.status(200).json({
        message: `User ${userId} updated successfully`,
        user: { userId, username, email, role },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  // Deactivate (soft delete) a user
  static async deactivateUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await UserModel.disableUser(userId);

      return res.status(200).json({
        message: `User ${userId} deactivated successfully`,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error deactivating user' });
    }
  }
}

export default AdminController;
