import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionString: process.env.DB_CONNECTION_STRING
};

export async function connectToDB() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("Підключення до Oracle встановлено база!");
    return connection;
  } catch (error) {
    console.error("Помилка підключення до Oracle:", error);
    throw error;
  }
}

