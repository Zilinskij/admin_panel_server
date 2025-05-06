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
      const loginObject = {
        email: data.email,
      };

      const first = await trh.query(`call adm_user_login($1,$2)`, [
        loginObject,
        {},
      ]);

      const firstCheck = first.rows[0].rs;
      console.log(firstCheck);
      if (firstCheck.status === "error") {
        return {
          firstCheck: {
            error_message: firstCheck.error_message,
          },
        };
      }
      if (firstCheck.data.password_hash) {
        const comparePassword = await bcrypt.compare(
          data.password,
          firstCheck.data.password_hash
        );

        if (comparePassword) {
          const now = new Date();
          const sevenDaysLater = new Date(
            now.getTime() + 7 * 24 * 60 * 60 * 1000
          );
          const accessToken = jwt.sign(
            { user_id: firstCheck.data.id },
            `${process.env.JWT_ACCESS_SECRET!}`,
            { expiresIn: "15m" }
          );

          // Генерація refresh токену
          const refreshToken = jwt.sign(
            { user_id: firstCheck.data.id },
            `${process.env.JWT_REFRESH_SECRET!}`,
            { expiresIn: "7d" }
          );

          const tokenSave = await trh.query(`call adm_user_token($1,$2)`, [
            {
              id_admuser: firstCheck.data.id,
              refresh_token: refreshToken,
              dt_lifetime: sevenDaysLater,
            },
            {},
          ]);

          console.log(tokenSave.rows[0]);

          return {
            firstCheck,
            refreshToken,
            accessToken,
          };
        }
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
      console.log(user);

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
