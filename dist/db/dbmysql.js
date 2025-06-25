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
exports.connectToLocalDatabase = connectToLocalDatabase;
const mysql = require('mysql2/promise');
require('dotenv').config();
function connectToLocalDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield mysql.createConnection({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                port: process.env.DABASE_PORT,
            });
            console.log('Підключення до локальної бази даних успішне!');
            return connection;
        }
        catch (error) {
            console.error('Помилка підключення до локальної бази даних:', error);
            throw error;
        }
    });
}
