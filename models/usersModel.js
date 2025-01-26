import bcrypt from 'bcryptjs'; // For password hashing
import db from "../config/db.js"; 

const UserModel = {
  
  // Insert a new user
  createUser: async (username, email, password, role) => {
    try {

      console.log(username, email, password, role);
      
      if (!password) {
        throw new Error("Password is required");
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword);  // Log hashed password for debugging
  
      const query = `
        INSERT INTO users (username, email, password, role) 
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const values = [username, email, hashedPassword, role];
      const result = await db.query(query, values);
      const { password: hashedPasswordResponse, ...user } = result.rows[0]; // Exclude password from response
      return user; // Return user without password
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  },  

  // Fetch a user by ID
  getUserById: async (user_id) => {
    try {
      const query = `SELECT * FROM users WHERE user_id = $1;`;
      const result = await db.query(query, [user_id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Error fetching user');
    }
  },

  // Fetch all users
  getAllUsers: async () => {
    try {
      const query = `SELECT * FROM users WHERE is_deleted = FALSE;`;  // Only fetch active users
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error fetching users');
    }
  },

  // Update a user
  updateUser: async (user_id, username, email, password, role) => {
    try {
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const query = `
        UPDATE users 
        SET username = $1, email = $2, password = $3, role = $4
        WHERE user_id = $5 RETURNING *;
      `;
      const values = [username, email, hashedPassword || password, role, user_id];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error updating user');
    }
  },

  // Delete a user (by setting is_active to false)
  disableUser: async (user_id) => {
    try {
      const query = `UPDATE users SET is_deleted = TRUE WHERE user_id = $1 RETURNING *;`;
      const result = await db.query(query, [user_id]);
      return result.rows[0]; // Return the disabled user
    } catch (error) {
      console.error('Error disabling user:', error);
      throw new Error('Error disabling user');
    }
  },

  // Check if a user exists by email (for login)
  checkUserByEmail: async (email) => {
    try {
      const query = `SELECT * FROM users WHERE email = $1 AND is_deleted = FALSE;`;  // Only active users
      const result = await db.query(query, [email]);
      return result.rows[0]; // Return the user if found
    } catch (error) {
      console.error('Error checking user by email:', error);
      throw new Error('Error checking user by email');
    }
  },

  // Compare passwords during login
  comparePassword: async (enteredPassword, storedPassword) => {
    try {
      return await bcrypt.compare(enteredPassword, storedPassword); // Compare password with hashed password
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error('Error comparing passwords');
    }
  }
};

export default UserModel;
