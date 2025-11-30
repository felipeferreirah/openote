import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    const results = (await query("SELECT * FROM deliveries WHERE id = ? AND user_id = ?", [id, userId])) as any[]

    if (results.length === 0) {
      return NextResponse.json({ error: "Entrega não encontrada" }, { status: 404 })
    }

    const delivery = results[0]

    const insertResult = await query(
      `INSERT INTO deliveries 
      (user_id, dataContratacao, saida, transportador, motorista, placa, nfVenda, cliente, cidade, valorPedagio, valorDescarga, valorFrete, caixas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        delivery.dataContratacao,
        delivery.saida,
        delivery.transportador,
        delivery.motorista,
        delivery.placa,
        delivery.nfVenda,
        delivery.cliente,
        delivery.cidade,
        delivery.valorPedagio,
        delivery.valorDescarga,
        delivery.valorFrete,
        delivery.caixas,
      ],
    )

    return NextResponse.json(
      { message: "Entrega duplicada com sucesso", id: (insertResult as any).insertId },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao duplicar entrega:", error)
    return NextResponse.json({ error: "Erro ao duplicar entrega" }, { status: 500 })
  }
}
