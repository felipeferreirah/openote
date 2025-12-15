import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST!,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!, // ✅ AQUI
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

console.log("MYSQL CONFIG:", {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  db: process.env.MYSQL_DATABASE,
})


export async function query(sql: string, values?: any[]) {
  const [rows] = await pool.execute(sql, values)
  return rows
}

export default pool
