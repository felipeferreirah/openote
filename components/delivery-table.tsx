"use client"

import type { Delivery } from "@/types/delivery"
import { Trash2, Copy, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import ConfirmDeleteModal from "./confirm-delete-modal"

interface DeliveryTableProps {
  deliveries: Delivery[]
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onEdit: (delivery: Delivery) => void
  isDuplicating: string | null
}

const getSaidaColor = (saida: number) => {
  const colors = [
    "bg-blue-100 border-l-4 border-blue-500",
    "bg-green-100 border-l-4 border-green-500",
    "bg-yellow-100 border-l-4 border-yellow-500",
    "bg-red-100 border-l-4 border-red-500",
    "bg-purple-100 border-l-4 border-purple-500",
    "bg-pink-100 border-l-4 border-pink-500",
    "bg-indigo-100 border-l-4 border-indigo-500",
    "bg-teal-100 border-l-4 border-teal-500",
    "bg-orange-100 border-l-4 border-orange-500",
    "bg-cyan-100 border-l-4 border-cyan-500",
  ]
  return colors[(saida - 1) % colors.length]
}

export default function DeliveryTable({
  deliveries,
  onDelete,
  onDuplicate,
  onEdit,
  isDuplicating,
}: DeliveryTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0)
  }

  const handleDeleteClick = async () => {
    if (!deleteConfirm) return

    setIsDeleting(true)
    try {
      await onDelete(deleteConfirm)
      setDeleteConfirm(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full">
      <ConfirmDeleteModal
        isOpen={deleteConfirm !== null}
        onConfirm={handleDeleteClick}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isDeleting}
      />

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-900">
                Saída
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-900">
                Data
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-900">
                Transportador
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-900">
                Motorista
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-900">
                Placa
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-900">
                NF
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-900">
                Cliente
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-900">
                Cidade
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-slate-900">
                Pedágio
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-slate-900">
                Descarga
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-slate-900">
                Frete
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-slate-900">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery, index) => (
              <tr
                key={delivery.id}
                className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                } ${getSaidaColor(delivery.saida)}`}
              >
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm font-bold text-sm">
                    {delivery.saida}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600">
                  {formatDate(delivery.dataContratacao)}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-900 font-medium truncate">
                  {delivery.transportador}
                </td>
                <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 truncate">
                  {delivery.motorista}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono text-slate-900">
                  {delivery.placa}
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600">
                  {delivery.nfVenda}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-900 truncate">
                  {delivery.cliente}
                </td>
                <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600">
                  {delivery.cidade}
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-right text-slate-900 font-medium">
                  {formatCurrency(delivery.valorPedagio)}
                </td>
                <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-right text-slate-900 font-medium">
                  {formatCurrency(delivery.valorDescarga)}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-right text-slate-900 font-medium">
                  {formatCurrency(delivery.valorFrete)}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(delivery)}
                      className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 h-8 w-8 p-0"
                      title="Editar entrega"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(delivery.id)}
                      disabled={isDuplicating === delivery.id}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Duplicar entrega"
                    >
                      {isDuplicating === delivery.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(delivery.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      title="Deletar entrega"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        {deliveries.map((delivery) => (
          <Card key={delivery.id} className={`border p-4 space-y-3 ${getSaidaColor(delivery.saida)}`}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm font-bold text-base flex-shrink-0">
                  {delivery.saida}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Data</p>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(delivery.dataContratacao)}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(delivery)}
                  className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 h-8 w-8 p-0"
                  title="Editar entrega"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDuplicate(delivery.id)}
                  disabled={isDuplicating === delivery.id}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Duplicar entrega"
                >
                  {isDuplicating === delivery.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(delivery.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  title="Deletar entrega"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Transportador</p>
                <p className="text-sm font-medium text-slate-900 truncate">{delivery.transportador}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Motorista</p>
                <p className="text-sm font-medium text-slate-900 truncate">{delivery.motorista}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Placa</p>
                <p className="text-sm font-mono text-slate-900">{delivery.placa}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">NF</p>
                <p className="text-sm text-slate-900">{delivery.nfVenda}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-200 pt-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Cliente</p>
                <p className="text-sm font-medium text-slate-900 truncate">{delivery.cliente}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Cidade</p>
                <p className="text-sm text-slate-900">{delivery.cidade}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm border-t border-slate-200 pt-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Pedágio</p>
                <p className="text-sm font-bold text-slate-900">{formatCurrency(delivery.valorPedagio)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Descarga</p>
                <p className="text-sm font-bold text-slate-900">{formatCurrency(delivery.valorDescarga)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Frete</p>
                <p className="text-sm font-bold text-slate-900">{formatCurrency(delivery.valorFrete)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
