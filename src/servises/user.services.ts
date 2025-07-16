import dotenv from "dotenv";
dotenv.config();
import { ApiRegister } from "../types/apiRegister";
import { connectToPostDb } from "../db/db.pgadmin";
import trh from "../db/trh";

let connection;

// Створіть тип для декодованого токену
// interface DecodedToken extends jwt.JwtPayload {
//   userId: number; // або string, залежно від того, який тип у вас є
// }
class UserService {
  async getAllUsers() {
    try {
      const result = await trh.query("SELECT * FROM admusr");
      return result;
    } catch (err) {
      throw new Error("Error fetching users");
    }
  }

  async getUserById(id: any) {
    try {
      const result = await trh.query(
        `SELECT * FROM admusr where id = $1`,[id]
      );
      return result;
    } catch (err) {
      throw new Error("Error fetching users");
    }
  }


  async deleteUserById(id: any) {
    connection = await connectToPostDb();
    try {
      const result = await connection.query("DELETE FROM users WHERE id = $1", [
        id,
      ]);
      return result;
    } catch (error) {
      throw new Error("Error delete user");
    }
  }

  async deleteAllUsers() {
    connection = await connectToPostDb();
    try {
      const result = await connection.query("DELETE FROM users");
      return result;
    } catch (error) {
      throw new Error("Error delete users");
    }
  }

  async updateUser({ name, email }: ApiRegister) {
    connection = await connectToPostDb();
    try {
      const result = await connection.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3",
        [name, email]
      );
      return result;
    } catch (error) {
      throw new Error("Error update user");
    } 
  }
}

export const userService = new UserService();
