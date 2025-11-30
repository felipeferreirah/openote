"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DeliveryForm from "@/components/delivery-form"
import DeliveryTable from "@/components/delivery-table"
import FilterSection from "@/components/filter-section"
import AuthForm from "@/components/auth-form"
import type { Delivery } from "@/types/delivery"
import { Plus, LogOut, Loader2 } from "lucide-react"

export default function Home() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchDeliveries()
    }
  }, [user])

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("/api/deliveries", {
        headers: {
          "x-user-id": user.id,
        },
      })
      const data = await response.json()
      const mappedData = data.map((item: any) => ({
        id: item.id.toString(),
        dataContratacao: item.dataContratacao,
        saida: Number(item.saida) || 1,
        transportador: item.transportador,
        motorista: item.motorista,
        placa: item.placa,
        nfVenda: item.nfVenda,
        cliente: item.cliente,
        cidade: item.cidade,
        valorPedagio: Number(item.valorPedagio) || 0,
        valorDescarga: Number(item.valorDescarga) || 0,
        valorFrete: Number(item.valorFrete) || 0,
        caixas: Number(item.caixas) || 0,
      }))
      setDeliveries(mappedData)
      setFilteredDeliveries(mappedData)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar entregas:", error)
      setIsLoading(false)
    }
  }

  const handleFilterChange = (dateStart: string, dateEnd: string) => {
    if (!dateStart && !dateEnd) {
      setFilteredDeliveries(deliveries)
      return
    }

    const filtered = deliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery.dataContratacao)
      const start = dateStart ? new Date(dateStart) : new Date("1900-01-01")
      const end = dateEnd ? new Date(dateEnd) : new Date("2100-12-31")

      return deliveryDate >= start && deliveryDate <= end
    })

    setFilteredDeliveries(filtered)
  }

  const handleAddDelivery = async (newDelivery: Delivery) => {
    setIsSubmitting(true)
    try {
      if (editingDelivery) {
        const response = await fetch(`/api/deliveries/${editingDelivery.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({
            dataContratacao: newDelivery.dataContratacao,
            saida: newDelivery.saida,
            transportador: newDelivery.transportador,
            motorista: newDelivery.motorista,
            placa: newDelivery.placa,
            nfVenda: newDelivery.nfVenda,
            cliente: newDelivery.cliente,
            cidade: newDelivery.cidade,
            valorPedagio: newDelivery.valorPedagio,
            valorDescarga: newDelivery.valorDescarga,
            valorFrete: newDelivery.valorFrete,
            caixas: newDelivery.caixas,
          }),
        })

        if (response.ok) {
          await fetchDeliveries()
          setIsFormOpen(false)
          setEditingDelivery(null)
        }
      } else {
        const response = await fetch("/api/deliveries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({
            dataContratacao: newDelivery.dataContratacao,
            saida: newDelivery.saida,
            transportador: newDelivery.transportador,
            motorista: newDelivery.motorista,
            placa: newDelivery.placa,
            nfVenda: newDelivery.nfVenda,
            cliente: newDelivery.cliente,
            cidade: newDelivery.cidade,
            valorPedagio: newDelivery.valorPedagio,
            valorDescarga: newDelivery.valorDescarga,
            valorFrete: newDelivery.valorFrete,
            caixas: newDelivery.caixas,
          }),
        })

        if (response.ok) {
          await fetchDeliveries()
          setIsFormOpen(false)
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar/editar entrega:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDelivery = async (id: string) => {
    try {
      const response = await fetch(`/api/deliveries/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id,
        },
      })

      if (response.ok) {
        await fetchDeliveries()
      }
    } catch (error) {
      console.error("Erro ao deletar entrega:", error)
    }
  }

  const handleDuplicateDelivery = async (id: string) => {
    setIsDuplicating(id)
    try {
      const response = await fetch("/api/deliveries/duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        await fetchDeliveries()
      }
    } catch (error) {
      console.error("Erro ao duplicar entrega:", error)
    } finally {
      setIsDuplicating(null)
    }
  }

  const handleEditDelivery = (delivery: Delivery) => {
    setEditingDelivery(delivery)
    setIsFormOpen(true)
  }

  const handleExportPDF = async (dateStart: string, dateEnd: string) => {
    setIsExporting(true)
    try {
      const { generatePDF } = await import("@/utils/pdf-generator")
      generatePDF(filteredDeliveries, dateStart, dateEnd)
    } finally {
      setIsExporting(false)
    }
  }

  const calculateTotals = () => {
    const totalFrete = filteredDeliveries.reduce((sum, d) => sum + (d.valorFrete || 0), 0)
    const totalPedagio = filteredDeliveries.reduce((sum, d) => sum + (d.valorPedagio || 0), 0)
    const totalDescarga = filteredDeliveries.reduce((sum, d) => sum + (d.valorDescarga || 0), 0)

    return { totalFrete, totalPedagio, totalDescarga }
  }

  const totals =
    filteredDeliveries.length > 0 ? calculateTotals() : { totalFrete: 0, totalPedagio: 0, totalDescarga: 0 }

  if (!user) {
    return <AuthForm onSuccess={setUser} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header com logout */}
        <div className="mb-6 sm:mb-8 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
              Gestão de Entregas
            </h1>
            <p className="text-sm sm:text-base text-slate-600">Bem-vindo, {user.name}</p>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("user")
              setUser(null)
            }}
            variant="outline"
            size="sm"
            className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 whitespace-nowrap"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>

        {/* Filter Section */}
        <FilterSection
          onFilterChange={handleFilterChange}
          onExport={handleExportPDF}
          totalDeliveries={filteredDeliveries.length}
          isExporting={isExporting}
        />

        {/* Action Button */}
        <div className="mb-6 sm:mb-8">
          <Button
            onClick={() => {
              setEditingDelivery(null)
              setIsFormOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            size="sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Nova Entrega</span>
          </Button>
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <DeliveryForm
            onSubmit={handleAddDelivery}
            onClose={() => {
              setIsFormOpen(false)
              setEditingDelivery(null)
            }}
            editingDelivery={editingDelivery}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Content */}
        <Card className="bg-white shadow-lg border-0 overflow-hidden">
          {isLoading ? (
            <div className="p-8 sm:p-12 text-center">
              <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto animate-spin text-blue-600 mb-4" />
              <p className="text-slate-500 text-sm sm:text-base">Carregando entregas...</p>
            </div>
          ) : filteredDeliveries.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="text-slate-400 mb-4">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m0 0L4 7m8 4v10l8-4v-10L12 11m0 0L4 7"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-600 mb-2">Nenhuma entrega encontrada</h3>
              <p className="text-sm sm:text-base text-slate-500 mb-6">
                {deliveries.length === 0
                  ? "Clique em 'Nova Entrega' para começar"
                  : "Nenhuma entrega corresponde aos filtros selecionados"}
              </p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Entrega
              </Button>
            </div>
          ) : (
            <DeliveryTable
              deliveries={filteredDeliveries}
              onDelete={handleDeleteDelivery}
              onDuplicate={handleDuplicateDelivery}
              onEdit={handleEditDelivery}
              isDuplicating={isDuplicating}
            />
          )}
        </Card>

        {/* Footer Stats */}
        {filteredDeliveries.length > 0 && (
          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <Card className="p-3 sm:p-4 bg-blue-50 border-0">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Total de Entregas</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{filteredDeliveries.length}</p>
            </Card>
            <Card className="p-3 sm:p-4 bg-green-50 border-0">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Frete Total</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1 truncate">
                R$ {totals.totalFrete.toFixed(2)}
              </p>
            </Card>
            <Card className="p-3 sm:p-4 bg-orange-50 border-0">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Pedágio Total</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1 truncate">
                R$ {totals.totalPedagio.toFixed(2)}
              </p>
            </Card>
            <Card className="p-3 sm:p-4 bg-purple-50 border-0">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Descarga Total</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1 truncate">
                R$ {totals.totalDescarga.toFixed(2)}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
