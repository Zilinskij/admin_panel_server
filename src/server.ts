import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routerState } from "./routerWrapper/routerState";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser())

// Викликаємо функцію, яка повертає роботу усіх Routes
routerState(app)
// Запускаємо сервер | Server start
app.listen(PORT, () => {
  console.log(`⚡ Сервер запущено на порту ${PORT}`);
});


export default app;