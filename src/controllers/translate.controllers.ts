import { Request, Response } from "express";
import { translateService } from "../servises/translate.services";
import { getUserValues } from "./userDto/user.dto";

class TranslateController {
  async translateKeysByTbl(req: Request, res: Response) {
    const tbl = req.body.tbl as string;
    const result = await translateService.getAllKeysByTbl(tbl);
    res.json(result);
  }

  async takeAllFields(req: Request, res: Response) {
    const value = req.body.value;
    const result = await translateService.allFields(value);
    res.json(result);
  }

  async translaits(req: Request, res: Response) {
    const key = req.params.key;
    const tbl = req.params.tbl;
    const value = await translateService.allTranslate(key, tbl);
    res.json(value);
  }

  async filterKeys(req: Request, res: Response) {
    const filtersCome = req.body.filters;
    const tbl = req.body.tbl;
    const filters = Array.isArray(filtersCome) ? filtersCome : [filtersCome];
    const result = await translateService.filteredKeys(filters, tbl);
    res.json(result);
  }

  async editValues(req: Request, res: Response) {
    const { user_id, name } = getUserValues(req);
    const { tbl, fld, keystr, lang, value, oper, ids, expr, id_admuser } =
      req.body;
    const procObj = {
      id_admuser,
      tbl,
      fld,
      keystr,
      lang,
      expr,
      oper: 1,
    };
    const result = await translateService.tarasProcedura(procObj);
    res.json(result);
  }

  async deleteValues(req: Request, res: Response) {
    const { user_id, name } = getUserValues(req);
    const { tbl, fld, keystr, lang, value, oper, ids, expr, id_admuser } =
      req.body;
    const procObj = {
      id_admuser,
      tbl,
      fld,
      keystr,
      lang,
      expr,
      oper: 2,
    };
    const result = await translateService.translDelete(procObj);
    res.json(result);
  }

  async fieldsTransl(req: Request, res: Response) {
    const result = await translateService.translForMoreFields();
    res.json(result);
  }
}

export const translateController = new TranslateController();
