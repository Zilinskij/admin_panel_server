"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyController = void 0;
const company_services_1 = require("../servises/company.services");
const server_1 = require("../server");
class CompanyController {
    getCompany(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = parseInt(req.query.limit, 20);
            const page = parseInt(req.query.page, 10);
            const company = yield company_services_1.companyService.getAllCompanies(limit, page);
            server_1.io.emit("data_table_updated", company);
            // console.log("Company controller getCompany:", company);
            res.json(company);
        });
    }
    getOneCompany(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const company = yield company_services_1.companyService.getCompanyById(id);
            res.json(company);
        });
    }
    getNameCompany(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { e } = req.params;
            console.log("Nazva kompanii -", e);
            const company = yield company_services_1.companyService.getCompanyByName(e);
            console.log("Company controller:", company.json);
            res.json(company);
        });
    }
    registerOneCompany(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield company_services_1.companyService.registerCompany(req.body);
            // console.log("Company id controller:", company);
            res.json(company);
        });
    }
    deleteOneCompany(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const company = yield company_services_1.companyService.deleteCompany(id);
            res.json(company);
        });
    }
    updateCompanyById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { kod } = req.params;
            const updateCompany = yield company_services_1.companyService.updateCompany(Object.assign(Object.assign({}, req.body), { kod }));
            res.json(updateCompany);
        });
    }
}
exports.companyController = new CompanyController();
