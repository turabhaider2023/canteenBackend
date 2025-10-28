import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(403).json("Invalid Token");
      }

      if (!decoded?.UserInfo) {
        console.error('JWT decoded structure invalid:', decoded);
        return res.status(403).json("Invalid Token Structure");
      }

      if (!decoded.UserInfo.email || !decoded.UserInfo.roles) {
        console.error('JWT missing required fields:', decoded.UserInfo);
        return res.status(403).json("Invalid Token Content");
      }

      // Store user info in a single object
      req.user = {
        email: decoded.UserInfo.email,
        roles: decoded.UserInfo.roles,
        supportUser: decoded.UserInfo?.supportuser || false
      };

      next();
    }
  );
};
