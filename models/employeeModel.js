import db from "../config/db.js"; 

const EmployeeModel = {
  // Insert a new employee
  createEmployee: async (userId, firstName, lastName, address, city, phone, image) => {
    try {
      const query = `
        INSERT INTO employee (user_id, first_name, last_name, address, city, phone, image) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
      `;
      const values = [userId, firstName, lastName, address, city, phone, image];
      const result = await db.query(query, values);
      return result.rows[0]; // Return the created employee
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Error creating employee');
    }
  },

  // Fetch an employee by ID
  getEmployeeById: async (employeeId) => {
    try {
      const query = `
      SELECT * FROM employee e 
      JOIN employee_branch eb
      ON e.employee_id = eb.employee_id
      JOIN branches b
      ON b.branch_id = eb.branch_id
      JOIN users u
      ON u.user_id = e.user_id
      WHERE e.employee_id= $1;
      `;
      const result = await db.query(query, [employeeId]);
      return result.rows[0]; // Return the employee
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw new Error('Error fetching employee');
    }
  },

  // Fetch all employees
  getAllEmployees: async () => {
    try {
      const query = `SELECT * FROM employee WHERE is_deleted = FALSE;`;
      const result = await db.query(query);
      return result.rows; // Return all employees
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Error fetching employees');
    }
  },

  // Update an employee's details
  updateEmployee: async (employeeId, firstName, lastName, address, city, phone, image) => {
    try {

      console.log(employeeId, firstName, lastName, address, city, phone, image);
      
      const query = `
        UPDATE employee 
        SET first_name = $1, last_name = $2, address = $3, city = $4, phone = $5, image = $6 
        WHERE employee_id = $7 RETURNING *;
      `;
      const values = [firstName, lastName, address, city, phone, image, employeeId];
      const result = await db.query(query, values);
      return result.rows[0]; // Return the updated employee
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Error updating employee');
    }
  },

  // Delete an employee (set is_active to false)
  deleteEmployee: async (employeeId) => {
    try {
   
      const query = `UPDATE employee SET is_deleted = TRUE WHERE user_id = $1 RETURNING *;`;
      const result = await db.query(query, [employeeId]);
      return result.rows[0]; // Return the disabled employee
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Error deleting employee');
    }
  },

  // Hide an employee (set is_hidden to true)
  hideEmployee: async (employeeId) => {
    try {
      const employee = await EmployeeModel.getEmployeeById(employeeId);
      console.log(employee);
      
      if (employee.is_hidden) {
        // If already hidden, show the employee again
        const query = `UPDATE employee SET is_hidden = FALSE WHERE employee_id = $1 RETURNING *;`;
        const result = await db.query(query, [employeeId]);
        return result.rows[0]; // Return the shown employee
      }
      const query = `UPDATE employee SET is_hidden = TRUE WHERE employee_id = $1 RETURNING *;`;
      const result = await db.query(query, [employeeId]);
      return result.rows[0]; // Return the hidden employee
    } catch (error) {
      console.error('Error hiding employee:', error);
      throw new Error('Error hiding employee');
    }
  },
};

export default EmployeeModel;
