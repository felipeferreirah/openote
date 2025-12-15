import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    const hashedPassword = hashPassword(password)

    const sql = `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`
    const result = await query(sql, [email, hashedPassword, name])

    return NextResponse.json(
      {
        id: (result as any).insertId,
        email,
        name,
        message: "Usuário criado com sucesso",
      },
      { status: 201 },
    )
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json({ error: `Erro ao criar usuário: ${error.message}` }, { status: 500 })
  }
}
