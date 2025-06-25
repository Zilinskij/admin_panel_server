"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Завантаження змінних середовища з .env файлу
dotenv_1.default.config();
// Налаштування пулу з'єднань
const trh = new pg_1.Pool({
    connectionString: process.env.POSTGRESQL_DB_URI_NEW, // Використовуємо URI з .env
    max: 300, // Максимальна кількість з'єднань в пулі
    //   min: 30, // Мінімальна кількість з'єднань в пулі
    idleTimeoutMillis: 10000, // Час бездіяльності до закриття з'єднання
    connectionTimeoutMillis: 2000, // Максимальний час на спробу підключення
});
exports.default = trh;
