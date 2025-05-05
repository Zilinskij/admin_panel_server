import { connectToPostDb } from "../db/db.pgadmin";
import trh from "../db/trh";
import { ClientsIst } from "../types/clients/IST.client";
import { ApiEntry } from "../types/entry";

let connection;

class CompanyService {
  async getAllCompanies(limit: number, page: number) {
    try {
      const offset = (page - 1) * limit;
      const result = await trh.query(
        "select kod, NURDOKL, NURDOKLFIX, NUR, ADRPUNKT, ADRVUL, ISCLIENT, ISPOSTACH, PERMN, PERNEGABARIT, DIRECTOR from ur order by kod limit $1 offset $2",
        [limit, offset]
      );
      const countResults = await trh.query("SELECT count(*) from ur");
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
    } catch (error) {
      console.error("DB error: ", error);

      throw new Error("Error fetching data company");
    }
  }

  async getCompanyById(id: any) {
    connection = await connectToPostDb();
    try {
      const result = await connection.query(`
    SELECT * FROM danikompanij where id = ${id}`);

      return result;
    } catch (error) {
      throw new Error("Error fetching data company");
    }
  }

  async updateCompany({
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
  }: ClientsIst) {
    try {
      const result = await trh.query(
        "UPDATE ur SET nurdokl = $2, nurdoklfix = $3, nur = $4, adrpunkt = $5, adrvul = $6, director = $7, isclient = $8, ispostach = $9, iselse = $10, isexp = $11, permn = $12, pernegabarit = $13 WHERE kod = $1",
        [
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
        ]
      );
      console.log(result);
      
      return result;
    } catch (error) {
      console.error(error, 'in services');
      
      throw new Error("Error update user");
    }
  }

  async getCompanyByName(name: any) {
    connection = await connectToPostDb();
    try {
      const result = await connection.query(
        "SELECT * FROM danikompanij where imjakompanii = $1",
        [name]
      );
      console.log("Control -", result);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data company");
    }
  }

  async registerCompany({
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
  }: ApiEntry) {
    connection = await connectToPostDb();
    try {
      const result = await connection.query(
        "INSERT INTO danikompanij (imjakompanii, kodkompanii, dyrector, stvorena, nomertel, adresa, kilkprac, kilkprychepiv, kilkavto, strahfirm) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ",
        [
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
        ]
      );
      if (result) {
        const row = await connection.query(
          "SELECT * FROM danikompanij WHERE id = $1",
          [result.insertId]
        );
        return row;
      }

      return result;
    } catch (error) {
      console.log("Register company error:", error);
      throw new Error("Error register company");
    }
  }

  async deleteCompany(id: any) {
    const connection = await connectToPostDb();
    try {
      const result: any = await connection.execute(
        "DELETE FROM danikompanij WHERE id = $1",
        [id]
      );
      return result;
    } catch (error) {
      throw new Error("Error fetching data company");
    }
  }
}

export const companyService = new CompanyService();
