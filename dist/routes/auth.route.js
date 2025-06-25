"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const router = express_1.default.Router();
exports.default = router;
router.post("/logout", auth_controllers_1.authController.logoutUser);
router.post("/login", auth_controllers_1.authController.loginUser);
router.get("/getme", auth_controllers_1.authController.refreshToken);
router.post("/register", auth_controllers_1.authController.postRegisterUs);
