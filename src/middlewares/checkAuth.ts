import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.accessToken;

    console.log(accessToken, "Перевірка чек аус accessToken");
    if (!accessToken && accessToken === undefined) {
      console.log("accec", accessToken);

      res.status(401).send("Please authenticate");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
}
