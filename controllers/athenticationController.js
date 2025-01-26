import UserModel from '../models/usersModel.js';

const AuthController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Check if user exists
      const user = await UserModel.checkUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare passwords
      const isMatch = await UserModel.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Remove sensitive information
      const { password: _, ...userResponse } = user;
      
      res.json({
        message: 'Login successful',
        user: {
          id: userResponse.user_id,
          username: userResponse.username,
          email: userResponse.email,
          role: userResponse.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  },

  logout(req, res) {
    res.json({ message: 'Logout successful' });
  },

    async resetPassword(req, res) {
      try {
        const { email, oldPassword, newPassword } = req.body;
        
        // Find user by email
        const user = await UserModel.checkUserByEmail(email);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Verify current password
        const isMatch = await UserModel.comparePassword(oldPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }
  
        // Update user with new password
        await UserModel.updateUser(
          user.user_id, 
          user.username, 
          user.email, 
          newPassword, 
          user.role
        );
  
        res.json({ message: 'Password reset successful' });
      } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Password reset failed' });
      }
    }
};

export default AuthController;