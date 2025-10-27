import express from "express";
import { loginUser } from "../controller/authController.js"; 
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyRoles } from "../middleware/verifyRoles.js";

const router = express.Router();

// Public Route → Login (no token required)
router
  .route("/login")
  .post(loginUser);

// Protected Route → for verifying token validity
router
  .route("/verify")
  .get(verifyToken, (req, res) => {
    res.json({
      message: "Token verified successfully!",
      user: req.user, // from verifyToken
    });
  });

//Example: Admin-only route
router
  .route("/admin-dashboard")
  .get(verifyToken, verifyRoles("admin"), (req, res) => {
    res.json({
      message: "Welcome to the Admin Dashboard!",
      user: req.user,
    });
  });

export default router;


