import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params

    const results = (await query("SELECT * FROM deliveries WHERE id = ? AND user_id = ?", [id, userId])) as any[]

    if (results.length === 0) {
      return NextResponse.json({ error: "Entrega não encontrada" }, { status: 404 })
    }

    await query("DELETE FROM deliveries WHERE id = ?", [id])

    return NextResponse.json({ message: "Entrega deletada com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao deletar entrega:", error)
    return NextResponse.json({ error: "Erro ao deletar entrega" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const results = (await query("SELECT * FROM deliveries WHERE id = ? AND user_id = ?", [id, userId])) as any[]

    if (results.length === 0) {
      return NextResponse.json({ error: "Entrega não encontrada" }, { status: 404 })
    }

    const {
      saida,
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
      UPDATE deliveries SET
        saida = ?,
        dataContratacao = ?,
        transportador = ?,
        motorista = ?,
        placa = ?,
        nfVenda = ?,
        cliente = ?,
        cidade = ?,
        valorPedagio = ?,
        valorDescarga = ?,
        valorFrete = ?,
        caixas = ?
      WHERE id = ? AND user_id = ?
    `

    await query(sql, [
      saida,
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
      id,
      userId,
    ])

    return NextResponse.json({ message: "Entrega atualizada com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao atualizar entrega:", error)
    return NextResponse.json({ error: "Erro ao atualizar entrega" }, { status: 500 })
  }
}
