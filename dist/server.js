"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routerState_1 = require("./routerWrapper/routerState");
const http_1 = __importDefault(require("http"));
// const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3001",
        credentials: true,
    },
});
exports.io = io;
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:3001", credentials: true }));
app.use((0, cookie_parser_1.default)());
// Викликаємо функцію, яка повертає роботу усіх Routes
(0, routerState_1.routerState)(app);
// io.on("connection", (socket) => {
//     console.log(`Користувач ${socket.id} підключився`);
//     socket.on("update", (e) => {
//         socket.emit("update1", e.email);
//     });
//     socket.on("disconect", () => {
//         console.log(`Користувач ${socket.id} відключився`);
//     });
// });
// Запускаємо сервер | Server start
server.listen(PORT, () => {
    console.log(`⚡ Сервер запущено на порту ${PORT}`);
});
exports.default = app;
