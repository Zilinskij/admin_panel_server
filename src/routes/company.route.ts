import { Router } from "express";
const router = Router();
import { companyController } from "../controllers/company.controllers";
import { checkAuth } from "../middlewares/checkAuth";

router.get("/", companyController.getCompany);
router.get("/name/:e", companyController.getNameCompany);
router.post("/register", checkAuth, companyController.registerOneCompany);
router.delete("/delete/:id", companyController.deleteOneCompany);
router.post("/create", companyController.createNewCompany)
router.get('/fields', companyController.fieldsCompany)

export default router;
