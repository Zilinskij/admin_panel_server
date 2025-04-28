import dotenv from "dotenv";
dotenv.config();
import { ApiRegister } from "../types/apiRegister";
import bcrypt from "bcryptjs";
import { connectToPostDb } from "../db/db.pgadmin";

let connection;

// Створіть тип для декодованого токену
// interface DecodedToken extends jwt.JwtPayload {
//   userId: number; // або string, залежно від того, який тип у вас є
// }
class UserService {
  async getAllUsers() {
    connection = await connectToPostDb();
    try {
      const result = await connection.query("SELECT * FROM users");
      return result;
    } catch (err) {
      throw new Error("Error fetching users");
    }
  }

  async getUserById(id: any) {
    connection = await connectToPostDb();
    try {
      const result = await connection.query(
        `SELECT * FROM users where id = ${id}`
      );
      return result;
    } catch (err) {
      throw new Error("Error fetching users");
    }
  }

  async postRegisterUser({ name, email, password }: ApiRegister) {
    connection = await connectToPostDb();
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(password);
    console.log(hash);

    try {
      const result = await connection.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        [name, email, hash, "user"]
      );

      // Повернення новоствореного користувача Return new user
      if (result) {
        const rows = await connection.query(
          "SELECT name, email FROM users WHERE id = $1",
          [result.insertId]
        );
        return rows;
      }
      return result.json();
    } catch (error: any) {
      console.error("Register user error:", error);
      throw new Error("Error register users");
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
    } finally {
      connection.end();
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
