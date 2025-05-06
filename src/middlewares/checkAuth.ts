import { Request, Response, NextFunction } from "express";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken && accessToken === undefined) {
      res.status(401).send("Please authenticate");
    } else {
      next();
    }
  } catch (error) {
    console.log(error, 'checkAuth error');
    res.status(401).json({ message: "Unauthorized" });
  }
}
