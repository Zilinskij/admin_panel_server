"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_services_1 = require("../servises/user.services");
class UserController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_services_1.userService.getAllUsers();
            console.log(users.rows, 'users in controller');
            res.json(users.rows);
        });
    }
    getOneUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const users = yield user_services_1.userService.getUserById(id);
            res.json(users);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield user_services_1.userService.deleteUserById(id);
            res.json(user);
        });
    }
    deleteUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_services_1.userService.deleteAllUsers();
            res.json(user);
        });
    }
    updateUserBiId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield user_services_1.userService.updateUser(id);
            res.json(user);
        });
    }
}
exports.userController = new UserController();
