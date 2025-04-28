import { NextFunction, Request, Response } from "express";
import { userService } from "../servises/user.services";
import jwt from "jsonwebtoken";

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    const users = await userService.getAllUsers();
    console.log("PROSTO CONTROLLER", users);
    res.json(users);
  }

  async getOneUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const users = await userService.getUserById(id);
    console.log("PROSTO CONTROLLER", users);
    res.json(users);
  }

  async postRegisterUs(req: Request, res: Response, next: NextFunction) {
    const user = await userService.postRegisterUser(req.body);
    res.status(201).json(user);
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await userService.deleteUserById(id);
    res.json(user);
  }

  async deleteUsers(req: Request, res: Response, next: NextFunction) {
    const user = await userService.deleteAllUsers();
    res.json(user);
  }

  async updateUserBiId(req: Request, res: Response, next: NextFunction) {
    const { id }: any = req.params;
    const user = await userService.updateUser(id);
    res.json(user);
  }

}

export const userController = new UserController();
