import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userService } from "./user.services";
import { ApiRegister } from "../types/apiRegister";
import { TAdminLoginData, TAdminRegisterData } from "../types/auth/auth.types";
import trh from "../db/trh";
import { error } from "console";

interface DecodedToken extends jwt.JwtPayload {
  user_id: number; // або string, залежно від того, який тип у вас є
}
let connection;
class AuthService {
  async login(data: TAdminLoginData) {
    try {
      const checkUser = await trh.query(
        `select * from admusr where email = $1`,
        [data.email]
      );
      const user = checkUser.rows[0]

      if (!user.id) {
        return {
          msg: "User with this email doesnt exist",
        };
      }

      const checkPassword = await bcrypt.compare(
        data.password,
        user.password_hash
      );

      console.log(checkPassword, "checkpassword");
      if (!checkPassword) {
        return {
          msg: "Password is incorect",
        };
      }


            const accessToken = jwt.sign(
        { user_id: user.id },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "20m" }
      );
      const refreshToken = jwt.sign(
        { user_id: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "10d" }
      );
    const { password_hash, ...userWithoutPassword } = user;
      return {
        user:userWithoutPassword,
        accessToken,
        refreshToken
      }
    } catch (error) {
      console.log(error);
    }
  }

  async refreshSecretToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as DecodedToken;

      const userData = await userService.getUserById(decoded?.user_id);
      const user = userData.rows[0];
   

      if (!user) {
        return { message: "Користувача не знайдено" };
      }
      const newAccessToken = jwt.sign(
        { user_id: user.id },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "20m" }
      );
      const newRefreshToken = jwt.sign(
        { user_id: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "10d" }
      );

      return {
        newAccessToken,
        user,
        newRefreshToken,
      };
    } catch (error) {
      return { message: "Недійсний refresh token" };
    }
  }

  async postRegisterUser(data: TAdminRegisterData) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const registerObject = {
      email: data?.email,
      name: data?.name,
      surname: data?.surname,
      password_hash: hashedPassword,
    };
    const result = await trh.query("call adm_user_reestr($1,$2)", [
      registerObject,
      {},
    ]);

    console.log(registerObject, "result registerObject for register");

    console.log(result.rows[0], "result for register");
    return result.rows[0];
  }
}

export const authService = new AuthService();
