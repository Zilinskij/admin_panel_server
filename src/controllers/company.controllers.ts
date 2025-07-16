import { NextFunction, Response, Request } from "express";
import { companyService } from "../servises/company.services";
import { io } from "../server";

class CompanyController {
  async getCompany(req: Request, res: Response, next: NextFunction) {
    const limit = parseInt(req.query.limit as string, 20);
    const page = parseInt(req.query.page as string, 10);
    const company = await companyService.getAllCompanies(limit, page);
    io.emit("data_table_updated", company);
    res.json(company);
  }

  async getNameCompany(req: Request, res: Response, next: NextFunction) {
    const { e } = req.params;
    const company = await companyService.getCompanyByName(e);
    res.json(company);
  }
  async registerOneCompany(req: Request, res: Response, next: NextFunction) {
    const company = await companyService.registerCompany(req.body);
    res.json(company);
  }
  async deleteOneCompany(req: Request, res: Response, next: NextFunction) {
    const { id }: any = req.params;
    const company = await companyService.deleteCompany(id);
    res.json(company);
  }

  async createNewCompany(req: Request, res: Response) {
    const { company_name, id_country, locality, id_admuser, edrpou } = req.body;
    const proc = {
      id_admuser,
      company_name,
      id_country,
      locality,
      edrpou,
    };
    console.log(proc, "- proc");

    const result = await companyService.createCompany(proc);
    res.json(result);
  }

  async fieldsCompany(req: Request, res: Response) {
    const result = await companyService.companyForFields();
    res.json(result);
  }
}

export const companyController = new CompanyController();
