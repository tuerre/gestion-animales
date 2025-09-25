import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No hay sesión activa" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }
  };
