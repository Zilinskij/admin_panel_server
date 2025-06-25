import { Router } from "express";
import { translateController } from "../controllers/translate.controllers";
const router = Router();

router.get("/:tbl/:key", translateController.translaits);
router.post("/filter", translateController.filterKeys);
router.post("/edit", translateController.editValues);
router.post("/delete", translateController.deleteValues);
router.post("/all-fields", translateController.takeAllFields);
router.post("/tbl-fields", translateController.fieldsTransl);
router.post("/tbl-key", translateController.translateKeysByTbl);

export default router;
