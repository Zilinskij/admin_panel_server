import { authService } from "../servises/auth.service";
import { Request, Response } from "express";

class AuthController {
  async loginUser(req: Request, res: Response) {
    const {email,password} = req.body;
    try {
  const result = await  authService.login(email,password);
  // console.log(result,'result from login service in login controller');
  
  res.cookie("refreshToken", result?.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    sameSite: "lax", // Може бути 'None', якщо міждоменний запит
  });
  res.cookie("accessToken", result?.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
    // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    maxAge: 10 * 1000, //10 секунд
    sameSite: "lax", // Може бути 'None', якщо міждоменний запит
  });
// console.log('OBJ WITHOUT PASSWORD',{password,...result?.user});
const {password:passwordMy,...userWithoutPassword} = result?.user;
  res.status(200).json(userWithoutPassword)
    } catch (error) {
      console.log("Помилка в контроллері: ", error);
      res.status(500).json({ message: "Помилка при авторизації" });
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      await authService.logout(req, res);
    } catch (error) {
      console.log("Помилка в контроллері: ", error);
      res.status(500).json({ message: "Помилка при виході" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
  
    const refreshToken = req.cookies.refreshToken;
  
    console.log('REFRESH TOKEN',refreshToken);
    
      
   const result = await  authService.refreshSecretToken(refreshToken);

   console.log(result,'resulty fropm refresh user in controller');
   const {password:newPassword,...userWithoutPasword} = result?.user
   
   res.cookie("refreshToken", result?.newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    sameSite: "lax", // Може бути 'None', якщо міждоменний запит
  });
  res.cookie("accessToken", result?.newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
    // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    maxAge: 10 * 1000, //10 секунд
    sameSite: "lax", // Може бути 'None', якщо міждоменний запит
  });
   res.status(200).json({
   ...userWithoutPasword
   })
    } catch (error) {
      console.error();
      res.status(500).json({ error: "Щось не працює" });
    }
  }
}

export const authController = new AuthController();
