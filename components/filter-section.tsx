"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Filter } from "lucide-react"
import { useState } from "react"

interface FilterSectionProps {
  onFilterChange: (dateStart: string, dateEnd: string) => void
  onExport: (dateStart: string, dateEnd: string) => void
  totalDeliveries: number
  isExporting: boolean
}

export default function FilterSection({ onFilterChange, onExport, totalDeliveries, isExporting }: FilterSectionProps) {
  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")

  const handleFilterClick = () => {
    onFilterChange(dateStart, dateEnd)
  }

  const handleExportClick = () => {
    onExport(dateStart, dateEnd)
  }

  return (
    <Card className="bg-white shadow-lg border-0 p-4 sm:p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Filtrar por Data</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 justify-center items-center">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Data Início</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Data Fim</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 col-span-1 sm:col-span-2 lg:col-span-2">
            <Button onClick={handleFilterClick} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">
              Filtrar
            </Button>
            <Button
              onClick={handleExportClick}
              disabled={isExporting || totalDeliveries === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>

        {dateStart || dateEnd ? (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            Mostrando entregas de {dateStart ? new Date(dateStart).toLocaleDateString("pt-BR") : "qualquer data"} até{" "}
            {dateEnd ? new Date(dateEnd).toLocaleDateString("pt-BR") : "qualquer data"}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
