import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/signup", signup);
router.post("/login", login);

// PROTECTED ROUTES
router.use(protectRoute);
router.use(arcjetProtection);

router.post("/logout", logout);
router.put("/update-profile", updateProfile);

router.get("/check", (req, res) => {
  res.status(200).json(req.user);
});

export default router;
