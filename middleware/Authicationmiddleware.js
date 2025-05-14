import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret-123';

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  console.log(req.cookies);
  
  console.log(token);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log(decoded);
    console.log("Authorized user");
    
    
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}
