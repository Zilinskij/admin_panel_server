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
        `select a.id,
                a.company_name,
                a.dt_reestr ,
                a.is_active,
                a.edrpou,
                a.lat,
                a.lon,
                a.locality,
                b.idnt2 as country,
                a.dt_blocked,
                a.dt_deleted
        from company a
        left join country b on a.id_country = b.id
        order by a.company_name 
        limit $1 offset $2`,
        [limit, offset]
      );
      const countResults = await trh.query("SELECT count(*) from company");
      const totalResults = parseInt(countResults.rows[0].count, 10);
      const totalPages = Math.ceil(totalResults / limit);
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

  async getCompanyByName(name: any) {
    connection = await connectToPostDb();
    try {
      const result = await connection.query(
        `SELECT * 
        FROM danikompanij 
        where imjakompanii = $1`,
        [name]
      );
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
        `INSERT INTO danikompanij 
                (imjakompanii, 
                kodkompanii, 
                dyrector, 
                stvorena, 
                nomertel, 
                adresa, 
                kilkprac, 
                kilkprychepiv, 
                kilkavto, 
                strahfirm) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) `,
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
          `SELECT * 
          FROM danikompanij 
          WHERE id = $1`,
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
        `DELETE FROM danikompanij 
        WHERE id = $1`,
        [id]
      );
      return result;
    } catch (error) {
      throw new Error("Error fetching data company");
    }
  }

  async createCompany(proc: {
    id_admuser: number;
    company_name: string;
    id_country: number;
    locality: string;
    edrpou: string;
  }) {
    try {
      const procString = JSON.stringify({...proc, function_name: "adm_company_reestr"});
      const result = await trh.query("call adm_run($1, $2)", [
        procString,
        {},
      ]);
      return result.rows[0].rs;
    } catch (error: any) {
      console.error("DB error:", error);
      throw new Error("Error filtered keys");
    }
  }

  async companyForFields() {
    try {
      const result = await trh.query(
        "select id, country_name from country order by country_name"
      );
      return result.rows
    } catch (error) {
      console.error("DB error:", error);
      throw new Error("Error company for fields");
    }
  }
}

export const companyService = new CompanyService();
