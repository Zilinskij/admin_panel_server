import { Request, Response } from "express";
import { userService } from "../servises/user.services";

class UserController {
  async getUsers(req:Request,res:Response) {
    const users = await userService.getAllUsers();
    res.json(users.rows);
  }

  async getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    const users = await userService.getUserById(id);
    res.json(users);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await userService.deleteUserById(id);
    res.json(user);
  }

  async deleteUsers(req: Request, res: Response) {
    const user = await userService.deleteAllUsers();
    res.json(user);
  }

  async updateUserBiId(req: Request, res: Response) {
    const { id }: any = req.params;
    const user = await userService.updateUser(id);
    res.json(user);
  }
}

export const userController = new UserController();
