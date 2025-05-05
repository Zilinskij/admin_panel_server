import { Pool } from "pg";
import dotenv from "dotenv";

// Завантаження змінних середовища з .env файлу
dotenv.config();

// Налаштування пулу з'єднань
const trh = new Pool({
  connectionString: process.env.POSTGRESQL_DB_URI_NEW, // Використовуємо URI з .env
  max: 300, // Максимальна кількість з'єднань в пулі
//   min: 30, // Мінімальна кількість з'єднань в пулі
  idleTimeoutMillis: 10000, // Час бездіяльності до закриття з'єднання
  connectionTimeoutMillis: 2000, // Максимальний час на спробу підключення
});


export default trh;