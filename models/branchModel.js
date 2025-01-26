import db from "../config/db.js";

const BranchModel = {
  // Create a new branch
  createBranch: async (name, address, phoneNo) => {
    const query = `
      INSERT INTO branches (name, address, phoneNo) 
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [name, address, phoneNo];
    const result = await db.query(query, values);
    return result.rows[0]; 
  },

  // Get branch by ID
  getBranchById: async (branchId) => {
    const query = `SELECT * FROM branches WHERE branch_id = $1 AND is_deleted = FALSE;`;
    const result = await db.query(query, [branchId]);
    return result.rows[0]; 
  },

  // Get branch by name
  getBranchByName: async (name) => {
    const query = `SELECT branch_id FROM branches WHERE name = $1 AND is_deleted = FALSE;`;
    const result = await db.query(query, [name]);
    return result.rows[0]; 
  },

  // Get all branches
  getAllBranches: async () => {
    const query = `
      SELECT * FROM branches WHERE is_deleted = FALSE;
    `;
    const result = await db.query(query);
    console.log(result);
    
    return result.rows; 
  },

  // Update branch details
  updateBranch: async (branchId, name, address, phoneNo) => {
    const query = `
      UPDATE branches 
      SET name = $1, address = $2, phoneNo = $3
      WHERE branch_id = $4 RETURNING *;
    `;
    const values = [name, address, phoneNo, branchId];
    const result = await db.query(query, values);
    return result.rows[0]; 
  },

  // Soft delete a branch
  deleteBranch: async (branchId) => {
    const query = `UPDATE branches SET is_deleted = TRUE WHERE branch_id = $1 RETURNING *;`;
    const result = await db.query(query, [branchId]);
    return result.rows[0]; 
  },

  // Assign an employee to a branch
  assignEmployeeToBranch: async (employeeId, branchId) => {
    const query = `
      INSERT INTO Employee_Branch (employee_id, branch_id) 
      VALUES ($1, $2) RETURNING *;
    `;
    const values = [employeeId, branchId];
    const result = await db.query(query, values);
    return result.rows[0]; 
  },

  // Assign a manager to a branch
  assignManagerToBranch: async (managerId, branchId) => {
    const query = `
      INSERT INTO Manager_Branch (manager_id, branch_id) 
      VALUES ($1, $2) RETURNING *;
    `;
    const values = [managerId, branchId];
    const result = await db.query(query, values);
    return result.rows[0]; 
  },
};

export default BranchModel;
