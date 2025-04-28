import { Router } from "express";
const router = Router();
import { companyController } from "../controllers/company.controllers";
import { checkAuth } from "../middlewares/checkAuth";


router.get("/", companyController.getCompany);
router.get("/:id", companyController.getOneCompany);
router.get("/name/:e", companyController.getNameCompany);
router.post("/register",checkAuth, companyController.registerOneCompany);
router.delete("/delete/:id", companyController.deleteOneCompany);
router.put("/update/:id", companyController.updateCompanyById);

export default router;
