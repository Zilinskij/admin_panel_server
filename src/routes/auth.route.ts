import express from "express";
import { authController } from "../controllers/auth.controllers";
const router = express.Router();
export default router;

router.post("/logout", authController.logoutUser);
router.post("/login", authController.loginUser);
router.get("/getme", authController.refreshToken);
router.post("/register", authController.postRegisterUs);
     