"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-0 shadow-2xl max-w-sm w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">Confirmar exclusão?</h3>
          <p className="text-sm text-slate-600 text-center mb-6">
            Tem certeza que deseja deletar este registro? Esta ação não pode ser desfeita.
          </p>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 min-w-24"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white min-w-24"
              disabled={isLoading}
            >
              {isLoading ? "Deletando..." : "Deletar"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
