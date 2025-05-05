import { Router } from "express";
const router = Router();
import { userController } from "../controllers/user.controllers";

router.get("/", userController.getUsers);
router.get("/:id", userController.getOneUser);
router.delete("/delete/:id", userController.deleteUser);
router.delete("/delete", userController.deleteUsers);
router.post("/update/:id", userController.deleteUsers);

export default router;
