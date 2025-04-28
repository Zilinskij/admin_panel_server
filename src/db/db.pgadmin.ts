const { Client } = require("pg");

export async function connectToPostDb() {
  const connectionPgLocal = new Client({
    host: process.env.POSTGRESS_LOCAL_DATABASE_HOST,
    port: process.env.POSTGRESS_LOCAL_DATABASE_PORT,
    database: process.env.POSTGRESS_LOCAL_DATABASE_NAME,
    user: process.env.POSTGRESS_LOCAL_DATABASE_USER,
    password: process.env.POSTGRESS_LOCAL_DATABASE_PASSWORD,
  });
  try {
    await connectionPgLocal.connect();
    return connectionPgLocal;
  } catch (error) {
    console.error("Помилка підключення до бд Postgres Local", error);
    return null;
  }
}
