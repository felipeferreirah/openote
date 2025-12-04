import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { Delivery } from "@/types/delivery"

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export function generatePDF(deliveries: Delivery[], dateStart?: string, dateEnd?: string) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // Header
  doc.setFillColor(30, 58, 138)
  doc.rect(0, 0, 297, 25, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("Relatório de Entregas", 15, 18)

  // Date
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  let headerText = `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`
  if (dateStart || dateEnd) {
    headerText += ` | Período: ${dateStart ? new Date(dateStart).toLocaleDateString("pt-BR") : "início"} até ${dateEnd ? new Date(dateEnd).toLocaleDateString("pt-BR") : "fim"}`
  }
  doc.text(headerText, 280, 18, { align: "right" })

  const tableData = deliveries.map((delivery) => [
    delivery.saida,
    formatDate(delivery.dataContratacao),
    delivery.transportador,
    delivery.motorista,
    delivery.placa,
    delivery.nfVenda,
    delivery.cliente,
    delivery.cidade,
    delivery.caixas || "-",
    `R$ ${(delivery.valorPedagio || 0).toFixed(2)}`,
    `R$ ${(delivery.valorDescarga || 0).toFixed(2)}`,
    `R$ ${(delivery.valorFrete || 0).toFixed(2)}`,
  ])

  const totalFrete = deliveries.reduce((sum, d) => sum + (d.valorFrete || 0), 0)
  const totalPedagio = deliveries.reduce((sum, d) => sum + (d.valorPedagio || 0), 0)
  const totalDescarga = deliveries.reduce((sum, d) => sum + (d.valorDescarga || 0), 0)
  const grandTotal = totalPedagio + totalDescarga + totalFrete

  // Create table
  autoTable(doc, {
    startY: 35,
    head: [
      [
        "Saída",
        "Data",
        "Transportador",
        "Motorista",
        "Placa",
        "NF",
        "Cliente",
        "Cidade",
        "Caixas",
        "Pedágio",
        "Descarga",
        "Frete",
      ],
    ],
    body: tableData,
    foot: [
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "TOTAL",
        `${deliveries.length} entregas`,
        "",
        `R$ ${totalPedagio.toFixed(2)}`,
        `R$ ${totalDescarga.toFixed(2)}`,
        `R$ ${totalFrete.toFixed(2)}`,
      ],
    ],
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      fontSize: 9,
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [30, 30, 30],
      fontSize: 8,
      halign: "left",
      valign: "middle",
    },
    footStyles: {
      fillColor: [209, 213, 219],
      textColor: [30, 30, 30],
      fontStyle: "bold",
      fontSize: 9,
      halign: "left",
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      9: { halign: "right" },
      10: { halign: "right" },
      11: { halign: "right" },
      8: { halign: "center" },
    },
    margin: { top: 10, right: 10, bottom: 30, left: 10 },
  })

  // Add summary
  const pageHeight = doc.internal.pageSize.getHeight()
  const finalY = (doc as any).lastAutoTable.finalY || 150

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 58, 138)
  doc.text(`Valor Total da Entrega: R$ ${grandTotal.toFixed(2)}`, 15, finalY + 15)

  // Footer
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("Sistema de Gestão de Entregas", 15, pageHeight - 10)
  doc.text(`Página 1 de 1`, 280, pageHeight - 10, { align: "right" })

  // Save the PDF
  const fileName =
    dateStart || dateEnd
      ? `entregas_${dateStart || "inicio"}_a_${dateEnd || "fim"}.pdf`
      : `entregas_${new Date().toISOString().split("T")[0]}.pdf`

  doc.save(fileName)
}
