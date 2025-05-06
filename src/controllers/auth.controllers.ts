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
      if (result?.firstCheck.error_message) {
        res.json({
          firstCheck:result.firstCheck
        })
      }else {
        res.cookie("refreshToken", result?.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
          sameSite: "lax", // Може бути 'None', якщо міждоменний запит
        });
        res.cookie("accessToken", result?.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
          maxAge: 30 * 60 * 1000, //30 хвилин
          sameSite: "lax", // Може бути 'None', якщо міждоменний запит
        });
        const { password_hash: passwordMy, ...userWithoutPassword } = result?.firstCheck.data;
        res.status(200).json(userWithoutPassword);
      }

    } catch (error) {
      console.log("Помилка в контроллері: ", error);
      res.status(500).json({ message: "Помилка при авторизації" });
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
     res.clearCookie('accessToken');
     res.clearCookie('refreshToken');
     res.status(200).json({status:'ok'})
    } catch (error) {
      console.log("Помилка в контроллері: ", error);
      res.status(500).json({ message: "Помилка при виході" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {     
      const refreshToken = req.cookies.refreshToken;
      const result = await authService.refreshSecretToken(refreshToken);
      
      const { password_hash: newPassword, ...userWithoutPasword } = result?.user;

      res.cookie("refreshToken", result?.newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
        sameSite: "lax", // Може бути 'None', якщо міждоменний запит
      });
      res.cookie("accessToken", result?.newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
        maxAge: 20 * 60 * 1000, //20 хвилин
        sameSite: "lax", // Може бути 'None', якщо міждоменний запит
      });
      res.status(200).json({
        ...userWithoutPasword,
      });
    } catch (error) {
      console.error('auth controllers logout error', error);
      res.status(500).json({ error: "Щось не працює" });
    }
  }
}

export const authController = new AuthController();
