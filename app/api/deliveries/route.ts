import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const results = await query("SELECT * FROM deliveries WHERE user_id = ? ORDER BY dataContratacao DESC", [userId])
    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar entregas:", error)
    return NextResponse.json({ error: "Erro ao buscar entregas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const data = await request.json()

    const {
      dataContratacao,
      transportador,
      motorista,
      placa,
      nfVenda,
      cliente,
      cidade,
      valorPedagio,
      valorDescarga,
      valorFrete,
      caixas,
    } = data

    const sql = `
      INSERT INTO deliveries (
        user_id, dataContratacao, transportador, motorista, placa, nfVenda,
        cliente, cidade, valorPedagio, valorDescarga, valorFrete, caixas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result = await query(sql, [
      userId,
      dataContratacao,
      transportador,
      motorista,
      placa,
      nfVenda,
      cliente,
      cidade,
      valorPedagio || 0,
      valorDescarga || 0,
      valorFrete || 0,
      caixas || 0,
    ])

    return NextResponse.json(
      {
        id: (result as any).insertId,
        message: "Entrega criada com sucesso",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar entrega:", error)
    return NextResponse.json({ error: "Erro ao criar entrega" }, { status: 500 })
  }
}
