import jwt from 'jsonwebtoken';
import UserModel from '../models/usersModel.js';

const JWT_SECRET = 'secret-123';

const AuthController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.checkUserByEmail(email);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const isMatch = await UserModel.comparePassword(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const { password: _, ...userResponse } = user;

      const token = jwt.sign({
        id: userResponse.user_id,
        email: userResponse.email,
        role: userResponse.role
      }, JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60,
});


      res.json({
        message: 'Login successful',
        user: {
          id: userResponse.user_id,
          username: userResponse.username,
          email: userResponse.email,
          role: userResponse.role,
          employee_id: userResponse.employee_id,
          manager_id: userResponse.manager_id,
          image: userResponse.image,
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  },

  logout(req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  },

  async resetPassword(req, res) {
    try {
      const { email, oldPassword, newPassword } = req.body;
      const user = await UserModel.checkUserByEmail(email);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const isMatch = await UserModel.comparePassword(oldPassword, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

      await UserModel.updateUser(
        user.user_id,
        user.username,
        user.email,
        newPassword,
        user.role
      );

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).json({ error: 'Password reset failed' });
    }
  }
};

export default AuthController;
