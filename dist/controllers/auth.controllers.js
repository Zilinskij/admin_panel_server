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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../servises/auth.service");
class AuthController {
    postRegisterUs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_service_1.authService.postRegisterUser(req.body);
            res.status(201).json(user);
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield auth_service_1.authService.login(req.body);
                if (result === null || result === void 0 ? void 0 : result.firstCheck.error_message) {
                    res.json({
                        firstCheck: result.firstCheck
                    });
                }
                else {
                    res.cookie("refreshToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
                        sameSite: "lax", // Може бути 'None', якщо міждоменний запит
                    });
                    res.cookie("accessToken", result === null || result === void 0 ? void 0 : result.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
                        maxAge: 30 * 60 * 1000, //30 хвилин
                        sameSite: "lax", // Може бути 'None', якщо міждоменний запит
                    });
                    const _a = result === null || result === void 0 ? void 0 : result.firstCheck.data, { password_hash: passwordMy } = _a, userWithoutPassword = __rest(_a, ["password_hash"]);
                    res.status(200).json(userWithoutPassword);
                }
            }
            catch (error) {
                console.log("Помилка в контроллері: ", error);
                res.status(500).json({ message: "Помилка при авторизації" });
            }
        });
    }
    logoutUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                res.status(200).json({ status: 'ok' });
            }
            catch (error) {
                console.log("Помилка в контроллері: ", error);
                res.status(500).json({ message: "Помилка при виході" });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                const result = yield auth_service_1.authService.refreshSecretToken(refreshToken);
                const _a = result === null || result === void 0 ? void 0 : result.user, { password_hash: newPassword } = _a, userWithoutPasword = __rest(_a, ["password_hash"]);
                res.cookie("refreshToken", result === null || result === void 0 ? void 0 : result.newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
                    sameSite: "lax", // Може бути 'None', якщо міждоменний запит
                });
                res.cookie("accessToken", result === null || result === void 0 ? void 0 : result.newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", // Для безпеки тільки на HTTPS
                    maxAge: 20 * 60 * 1000, //20 хвилин
                    sameSite: "lax", // Може бути 'None', якщо міждоменний запит
                });
                res.status(200).json(Object.assign({}, userWithoutPasword));
            }
            catch (error) {
                console.error('auth controllers logout error', error);
                res.status(500).json({ error: "Щось не працює" });
            }
        });
    }
}
exports.authController = new AuthController();
