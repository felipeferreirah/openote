import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "138.68.232.90",
  port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASS || "135157",
  database: process.env.MYSQL_DB || "delivery_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function query(sql: string, values?: any[]) {
  const connection = await pool.getConnection()
  try {
    const [results] = await connection.execute(sql, values)
    return results
  } finally {
    connection.release()
  }
}

export default pool
