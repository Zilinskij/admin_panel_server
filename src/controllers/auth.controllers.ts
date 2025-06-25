import { authService } from "../servises/auth.service";
import { Request, Response, NextFunction } from "express";

class AuthController {
  async postRegisterUs(req: Request, res: Response, next: NextFunction) {
    const user = await authService.postRegisterUser(req.body);
    res.status(201).json(user);
  }

  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const result = await authService.login(req.body);

      if (result?.msg === "Password is incorect") {
        res.json(result?.msg);
        return;
      }
      if (result?.msg === "User not found") {
        res.json(result?.msg);
        return;
      }
      res.cookie("refresh_token", result?.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("access_token", result?.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 1000,
      });
      res.cookie("user_id", result?.user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 1000,
      });
      if (!result?.user) {
        res.status(404).json({
          message: "User not found",
        });
      }

      res.json(result?.user);
    } catch (error) {
      console.log(error);
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.log("Помилка в контроллері: ", error);
      res.status(500).json({ message: "Помилка при виході" });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;
      const result = await authService.refreshSecretToken(refreshToken);

      const { password_hash: newPassword, ...userWithoutPasword } =
        result?.user;

      res.cookie("refresh_token", result?.newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
        sameSite: "lax", // Може бути 'None', якщо міждоменний запит
      });
      res.cookie("access_token", result?.newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
        maxAge: 20 * 60 * 1000, //20 хвилин
        sameSite: "lax", // Може бути 'None', якщо міждоменний запит
      });
      res.cookie("user_id", result?.user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
      });
      res.status(200).json({
        ...userWithoutPasword,
      });
    } catch (error) {
      console.error("auth controllers logout error", error);
      res.status(500).json({ error: "Щось не працює" });
    }
  }
  async getOut(req: Request, res: Response) {
    try {
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.json({ message: "Logged out" });
    } catch (error) {
      console.error(error);
    }
  }
}

export const authController = new AuthController();
