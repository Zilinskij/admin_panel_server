import { connectToPostDb } from "../db/db.pgadmin";
import { ApiEntry } from "../types/entry";

let connection;

class CompanyService {
  async getAllCompanies() {
    connection = await connectToPostDb();
    try {
      const result = await connection.query("SELECT * from danikompanij ORDER BY id");
      return result.rows;
    } catch (error) {
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
    id,
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
        "UPDATE danikompanij SET  imjakompanii = $1, kodkompanii = $2, dyrector = $3,stvorena = $4, nomertel = $5, adresa = $6, kilkprac = $7, kilkprychepiv = $8, kilkavto = $9, strahfirm = $10 WHERE id = $11",
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
          id,
        ]
      );
      return result;
    } catch (error) {
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
