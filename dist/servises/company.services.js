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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = void 0;
const db_pgadmin_1 = require("../db/db.pgadmin");
const trh_1 = __importDefault(require("../db/trh"));
let connection;
class CompanyService {
    getAllCompanies(limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offset = (page - 1) * limit;
                const result = yield trh_1.default.query("select kod, NURDOKL, NURDOKLFIX, NUR, ADRPUNKT, ADRVUL, ISCLIENT, ISPOSTACH, PERMN, PERNEGABARIT, DIRECTOR from ur order by kod limit $1 offset $2", [limit, offset]);
                const countResults = yield trh_1.default.query("SELECT count(*) from ur");
                const totalResults = parseInt(countResults.rows[0].count, 10);
                const totalPages = Math.ceil(totalResults / limit);
                console.log("Кількість записів: ", totalResults);
                console.log("Кількість сторінок ", totalPages);
                console.log("Page -  ", page);
                return {
                    data: result.rows,
                    pagination: {
                        totalResults,
                        totalPages,
                        currentPage: page,
                        pageSize: limit,
                    },
                };
            }
            catch (error) {
                console.error("DB error: ", error);
                throw new Error("Error fetching data company");
            }
        });
    }
    getCompanyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            connection = yield (0, db_pgadmin_1.connectToPostDb)();
            try {
                const result = yield connection.query(`
    SELECT * FROM danikompanij where id = ${id}`);
                return result;
            }
            catch (error) {
                throw new Error("Error fetching data company");
            }
        });
    }
    updateCompany(_a) {
        return __awaiter(this, arguments, void 0, function* ({ kod, nurdokl, nurdoklfix, nur, adrpunkt, adrvul, director, isclient, ispostach, iselse, isexp, permn, pernegabarit, }) {
            try {
                const result = yield trh_1.default.query("UPDATE ur SET nurdokl = $2, nurdoklfix = $3, nur = $4, adrpunkt = $5, adrvul = $6, director = $7, isclient = $8, ispostach = $9, iselse = $10, isexp = $11, permn = $12, pernegabarit = $13 WHERE kod = $1", [
                    kod,
                    nurdokl,
                    nurdoklfix,
                    nur,
                    adrpunkt,
                    adrvul,
                    director,
                    isclient,
                    ispostach,
                    iselse,
                    isexp,
                    permn,
                    pernegabarit,
                ]);
                console.log(result);
                return result;
            }
            catch (error) {
                console.error(error, 'in services');
                throw new Error("Error update user");
            }
        });
    }
    getCompanyByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            connection = yield (0, db_pgadmin_1.connectToPostDb)();
            try {
                const result = yield connection.query("SELECT * FROM danikompanij where imjakompanii = $1", [name]);
                console.log("Control -", result);
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error("Error fetching data company");
            }
        });
    }
    registerCompany(_a) {
        return __awaiter(this, arguments, void 0, function* ({ imjakompanii, kodkompanii, dyrector, stvorena, nomertel, adresa, kilkprac, kilkprychepiv, kilkavto, strahfirm, }) {
            connection = yield (0, db_pgadmin_1.connectToPostDb)();
            try {
                const result = yield connection.query("INSERT INTO danikompanij (imjakompanii, kodkompanii, dyrector, stvorena, nomertel, adresa, kilkprac, kilkprychepiv, kilkavto, strahfirm) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ", [
                    imjakompanii,
                    kodkompanii,
                    dyrector,
                    stvorena,
                    nomertel,
                    adresa,
                    kilkprac,
                    kilkprychepiv,
                    kilkavto,
                    strahfirm,
                ]);
                if (result) {
                    const row = yield connection.query("SELECT * FROM danikompanij WHERE id = $1", [result.insertId]);
                    return row;
                }
                return result;
            }
            catch (error) {
                console.log("Register company error:", error);
                throw new Error("Error register company");
            }
        });
    }
    deleteCompany(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, db_pgadmin_1.connectToPostDb)();
            try {
                const result = yield connection.execute("DELETE FROM danikompanij WHERE id = $1", [id]);
                return result;
            }
            catch (error) {
                throw new Error("Error fetching data company");
            }
        });
    }
}
exports.companyService = new CompanyService();
