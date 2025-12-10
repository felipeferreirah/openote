"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Delivery } from "@/types/delivery"
import { X, Loader2 } from "lucide-react"

interface DeliveryFormProps {
  onSubmit: (delivery: Delivery) => void
  onClose: () => void
  editingDelivery?: Delivery | null
  isSubmitting: boolean
}



export default function DeliveryForm({ onSubmit, onClose, editingDelivery, isSubmitting }: DeliveryFormProps) {
  const [formData, setFormData] = useState<Partial<Delivery>>({
    dataContratacao: new Date().toISOString().split("T")[0],
    saida: 1,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingDelivery) {
      const formattedData = {
        ...editingDelivery,
        dataContratacao: editingDelivery.dataContratacao
          ? editingDelivery.dataContratacao.split("T")[0].split(" ")[0]
          : new Date().toISOString().split("T")[0],
      }
      setFormData(formattedData)
    }
  }, [editingDelivery])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Valor") || name === "caixas" || name === "saida"
          ? value === ""
            ? 0
            : Number.parseFloat(value)
          : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const requiredFields = [
      "dataContratacao",
      "saida",
      "transportador",
      "motorista",
      "placa",
      "nfVenda",
      "cliente",
      "cidade",
    ]

    requiredFields.forEach((field) => {
      if (!formData[field as keyof Delivery]) {
        newErrors[field] = "Campo obrigatório"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData as Delivery)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-white border-0 shadow-2xl my-auto">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
            {editingDelivery ? "Editar Entrega" : "Nova Entrega"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 flex-shrink-0"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {/* Data Contratação */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                Data Contratação *
              </label>
              <input
                type="date"
                name="dataContratacao"
                value={formData.dataContratacao || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.dataContratacao && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.dataContratacao}</p>
              )}
            </div>

            {/* Saída */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Nº da Saída *</label>
              <input
                type="number"
                name="saida"
                placeholder="Ex: 1, 2, 3..."
                value={formData.saida || ""}
                onChange={handleChange}
                min="1"
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.saida && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.saida}</p>}
            </div>

            {/* Transportador */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                Transportador *
              </label>
              <input
                type="text"
                name="transportador"
                placeholder="Nome da transportadora"
                value={formData.transportador || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.transportador && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.transportador}</p>}
            </div>

            {/* Motorista */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Motorista *</label>
              <input
                type="text"
                name="motorista"
                placeholder="Nome do motorista"
                value={formData.motorista || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.motorista && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.motorista}</p>}
            </div>

            {/* Placa */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Placa *</label>
              <input
                type="text"
                name="placa"
                placeholder="ABC-1234"
                value={formData.placa || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.placa && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.placa}</p>}
            </div>

            {/* NF Venda */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">NF Venda *</label>
              <input
                type="text"
                name="nfVenda"
                placeholder="Número da NF"
                value={formData.nfVenda || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.nfVenda && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.nfVenda}</p>}
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Cliente *</label>
              <input
                type="text"
                name="cliente"
                placeholder="Nome do cliente"
                value={formData.cliente || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.cliente && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.cliente}</p>}
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Cidade *</label>
              <input
                type="text"
                name="cidade"
                placeholder="Cidade de destino"
                value={formData.cidade || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.cidade && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.cidade}</p>}
            </div>

            {/* Caixas */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Caixas</label>
              <input
                type="number"
                name="caixas"
                placeholder="0"
                value={formData.caixas || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Valor Pedágio */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                Valor Pedágio (R$)
              </label>
              <input
                type="number"
                step="0.01"
                name="valorPedagio"
                placeholder="0.00"
                value={formData.valorPedagio || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Valor Descarga */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                Valor Descarga (R$)
              </label>
              <input
                type="number"
                step="0.01"
                name="valorDescarga"
                placeholder="0.00"
                value={formData.valorDescarga || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Valor Frete */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                Valor Frete (R$)
              </label>
              <input
                type="number"
                step="0.01"
                name="valorFrete"
                placeholder="0.00"
                value={formData.valorFrete || ""}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Buttons - stack on mobile, side by side on desktop */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-300 bg-transparent w-full sm:w-auto order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : editingDelivery ? (
                "Atualizar Entrega"
              ) : (
                "Salvar Entrega"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
