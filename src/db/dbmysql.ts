const mysql = require('mysql2/promise');
require('dotenv').config();

export async function connectToLocalDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            port: process.env.DABASE_PORT,
        });
        console.log('Підключення до локальної бази даних успішне!');
        return connection;
    } catch (error) {
        console.error('Помилка підключення до локальної бази даних:', error);
        throw error;
    }
}