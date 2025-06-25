import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routerState } from "./routerWrapper/routerState";
import http from "http";
import { Server } from "socket.io";
import { useCompanySockets } from "./sockets/companySocket";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Викликаємо функцію, яка повертає роботу усіх Routes
routerState(app);

io.on("connection", (socket) => {
  console.log(`Користувач ${socket.id} підключився`);
  useCompanySockets(socket, io);

  socket.on("disconect", () => {
    console.log(`Користувач ${socket.id} відключився`);
  });
});

// Запускаємо сервер | Server start
server.listen(PORT, () => {
  console.log(`⚡ Сервер запущено на порту ${PORT}`);
});

export { io };
export default app;
