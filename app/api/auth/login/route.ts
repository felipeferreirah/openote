import { query } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 })
    }

    const results = (await query("SELECT * FROM users WHERE email = ?", [email])) as any[]

    if (results.length === 0 || !verifyPassword(password, results[0].password)) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 })
    }

    const user = results[0]

    // Retornar dados do usuário (o token será armazenado no localStorage)
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        token: `user-${user.id}-${Date.now()}`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
