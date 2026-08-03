import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const testDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    console.log("✅ Database Connected Successfully");

    const [rows] = await connection.query("SELECT 1 AS test");
    console.log(rows);

    await connection.end();
  } catch (error) {
    console.log("❌ Database Connection Failed");
    console.log(error.message);
  }
};

testDB();
