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
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_services_1 = require("./user.services");
const trh_1 = __importDefault(require("../db/trh"));
let connection;
class AuthService {
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginObject = {
                    email: data.email,
                };
                const first = yield trh_1.default.query(`call adm_user_login($1,$2)`, [
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
                    const comparePassword = yield bcryptjs_1.default.compare(data.password, firstCheck.data.password_hash);
                    if (comparePassword) {
                        const now = new Date();
                        const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        const accessToken = jsonwebtoken_1.default.sign({ user_id: firstCheck.data.id }, `${process.env.JWT_ACCESS_SECRET}`, { expiresIn: "15m" });
                        // Генерація refresh токену
                        const refreshToken = jsonwebtoken_1.default.sign({ user_id: firstCheck.data.id }, `${process.env.JWT_REFRESH_SECRET}`, { expiresIn: "7d" });
                        const tokenSave = yield trh_1.default.query(`call adm_user_token($1,$2)`, [
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
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    refreshSecretToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const userData = yield user_services_1.userService.getUserById(decoded === null || decoded === void 0 ? void 0 : decoded.user_id);
                const user = userData.rows[0];
                console.log(user);
                if (!user) {
                    return { message: "Користувача не знайдено" };
                }
                const newAccessToken = jsonwebtoken_1.default.sign({ user_id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "20m" });
                const newRefreshToken = jsonwebtoken_1.default.sign({ user_id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "10d" });
                return {
                    newAccessToken,
                    user,
                    newRefreshToken,
                };
            }
            catch (error) {
                return { message: "Недійсний refresh token" };
            }
        });
    }
    postRegisterUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
            const registerObject = {
                email: data === null || data === void 0 ? void 0 : data.email,
                name: data === null || data === void 0 ? void 0 : data.name,
                surname: data === null || data === void 0 ? void 0 : data.surname,
                password_hash: hashedPassword,
            };
            const result = yield trh_1.default.query("call adm_user_reestr($1,$2)", [
                registerObject,
                {},
            ]);
            console.log(registerObject, "result registerObject for register");
            console.log(result.rows[0], "result for register");
            return result.rows[0];
        });
    }
}
exports.authService = new AuthService();
