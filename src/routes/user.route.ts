import { Router } from "express";
const router = Router();
import { userController } from "../controllers/user.controllers";
import { checkAuth } from "../middlewares/checkAuth";

router.get("/",checkAuth, userController.getUsers);
router.get("/:id", userController.getOneUser);
router.post("/register", userController.postRegisterUs);
router.delete("/delete/:id", userController.deleteUser);
router.delete("/delete", userController.deleteUsers);
router.post("/update/:id", userController.deleteUsers);

export default router;
