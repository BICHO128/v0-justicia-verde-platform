import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "justicia_verde",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}

let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

export async function testConnection(): Promise<boolean> {
  try {
    const connection = await getPool().getConnection()
    await connection.ping()
    console.log("Database connected successfully")
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

export async function executeQuery<T>(query: string, params?: any[]): Promise<T> {
  try {
    const [rows] = await getPool().execute(query, params)
    return rows as T
  } catch (error) {
    console.error("Query execution error:", error)
    throw error
  }
}

export default getPool()
