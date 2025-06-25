"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerState = void 0;
const user_route_1 = __importDefault(require("../routes/user.route"));
const company_route_1 = __importDefault(require("../routes/company.route"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const serverRoutes = [
    { path: "/users", name: user_route_1.default },
    { path: "/companyes", name: company_route_1.default },
    { path: "/auth", name: auth_route_1.default },
];
const routerState = (app) => {
    const myRoutes = serverRoutes.map((route) => {
        app.use(route.path, route.name);
    });
    return myRoutes;
};
exports.routerState = routerState;
