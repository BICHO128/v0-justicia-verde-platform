import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "justicia_verde",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("[v0] Database connected successfully")
    connection.release()
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return false
  }
}

export default pool
