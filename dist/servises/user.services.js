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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_pgadmin_1 = require("../db/db.pgadmin");
const trh_1 = __importDefault(require("../db/trh"));
let connection;
// Створіть тип для декодованого токену
// interface DecodedToken extends jwt.JwtPayload {
//   userId: number; // або string, залежно від того, який тип у вас є
// }
class UserService {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield trh_1.default.query("SELECT * FROM admusr");
                console.log(result);
                return result;
            }
            catch (err) {
                throw new Error("Error fetching users");
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield trh_1.default.query(`SELECT * FROM admusr where id = $1`, [id]);
                return result;
            }
            catch (err) {
                throw new Error("Error fetching users");
            }
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            connection = yield (0, db_pgadmin_1.connectToPostDb)();
            try {
                const result = yield connection.query("DELETE FROM users WHERE id = $1", [
                    id,
                ]);
                return result;
            }
            catch (error) {
                throw new Error("Error delete user");
            }
        });
    }
    deleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            connection = yield (0, db_pgadmin_1.connectToPostDb)();
            try {
                const result = yield connection.query("DELETE FROM users");
                return result;
            }
            catch (error) {
                throw new Error("Error delete users");
            }
        });
    }
    updateUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email }) {
            connection = yield (0, db_pgadmin_1.connectToPostDb)();
            try {
                const result = yield connection.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email]);
                return result;
            }
            catch (error) {
                throw new Error("Error update user");
            }
        });
    }
}
exports.userService = new UserService();
