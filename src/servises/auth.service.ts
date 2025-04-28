import { Request, Response } from "express";
import { connectToPostDb } from "../db/db.pgadmin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userService } from "./user.services";

class AuthService {
  async login(email:string,password:string) {
    const connection = await connectToPostDb();
console.log('procec jwt access',process.env.JWT_ACCESS_SECRET);
console.log('procec jwt refresh',process.env.JWT_REFRESH_SECRET);

    try {
      const result = await connection.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      const user = result.rows[0];
      console.log(user);

      if (!user) {
        return {msg:'user not found'}
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {msg:'not valid password'}
      }
      const accessToken =  jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "1h" }
      );
      const refreshToken =  jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "6h" }
      );


      return { user, accessToken,refreshToken };
    } catch (error) {
      console.error("Помилка при логіні:", error);

    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      console.log("TEST SERVER - Користувач вийшов");
      res.status(200).json({ message: "Ви успішно вийшли" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Помилка при виході" });
    }
  }

  async refreshSecretToken(refreshToken:string) {

   
console.log(refreshToken,'refresh token in service');
    
    // if (!refreshToken) {
    //   return { message: "Refresh token відсутній" }
    // }
    try {
  
      
      const decoded:any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      console.log('DECODEDF',decoded);
 
      const userData = await userService.getUserById(decoded?.id);
      const user = userData.rows[0]
    
      

      if (!user) {
        return { message: "Користувача не знайдено" }
      }
      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "10s" }
      );
      const newRefreshToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "10d" }
      );


      return {
       newAccessToken,user,newRefreshToken
      }
    } catch (error) {
      return { message: "Недійсний refresh token" }
    }
  }
  // async getMe(req: Request, res: Response) {
  //   const connection = await connectToPostDb();
  //   const { email, password } = req.body;
  //   console.log(req.body);

  //   const JWT_SECRET = process.env.JWT_SECRET;
  //   if (!JWT_SECRET) {
  //     throw new Error("JWT_SECRET не визначено");
  //   }

  //   try {
  //     const result = await connection.query(
  //       "SELECT * FROM users WHERE email = $1",
  //       [email]
  //     );
  //     const user = result.rows[0];
  //     console.log(user);

  //     if (!user) {
  //       res.status(404).json("Користувача не знайдено");
  //     }
  //     const isPasswordValid = await bcrypt.compare(password, user.password);
  //     if (!isPasswordValid) {
  //       res.status(404).json("Помилка авторизації");
  //     }
  //     const token = await jwt.sign(
  //       { id: user.id, name: user.name, email: user.email, role: user.role },
  //       JWT_SECRET,
  //       { expiresIn: "6h" }
  //     );
  //     res.cookie("token", token, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
  //       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
  //       sameSite: "lax", // Може бути 'None', якщо міждоменний запит
  //     });
  //     return res.status(200).json({ user, token });
  //   } catch (error) {
  //     console.error("Помилка при логіні:", error);
  //     return res.status(500).json({ message: "Помилка сервера" });
  //   }
  // }
}

export const authService = new AuthService();
