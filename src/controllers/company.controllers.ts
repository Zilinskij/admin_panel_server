import { NextFunction, Response, Request } from "express";
import { companyService } from "../servises/company.services";
import { io } from "../server";

class CompanyController {
  async getCompany(req: Request, res: Response, next: NextFunction) {
    const limit = parseInt(req.query.limit as string, 20);
    const page = parseInt(req.query.page as string, 10);
    const company = await companyService.getAllCompanies(limit, page);
    io.emit("data_table_updated", company);
    // console.log("Company controller getCompany:", company);
    res.json(company);
  }
  async getOneCompany(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const company = await companyService.getCompanyById(id);
    res.json(company);
  }
  async getNameCompany(req: Request, res: Response, next: NextFunction) {
    const { e } = req.params;
    console.log("Nazva kompanii -", e);
    const company = await companyService.getCompanyByName(e);
    console.log("Company controller:", company.json);
    res.json(company);
  }
  async registerOneCompany(req: Request, res: Response, next: NextFunction) {
    const company = await companyService.registerCompany(req.body);
    // console.log("Company id controller:", company);
    res.json(company);
  }
  async deleteOneCompany(req: Request, res: Response, next: NextFunction) {
    const { id }: any = req.params;
    const company = await companyService.deleteCompany(id);
    res.json(company);
  }
  async updateCompanyById(req: Request, res: Response, next: NextFunction) {
    const { kod }: any = req.params;
    const updateCompany = await companyService.updateCompany({
      ...req.body,
      kod,
    });
    res.json(updateCompany);
  }
}

export const companyController = new CompanyController();
