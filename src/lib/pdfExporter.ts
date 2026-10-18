import { jsPDF } from 'jspdf';
import { ChatMessage } from '../types';

/**
 * Remove marcações básicas de markdown para gerar um texto limpo no PDF
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/###\s+/g, '')
    .replace(/##\s+/g, '')
    .replace(/#\s+/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\$\$/g, '')
    .replace(/\$/g, '');
}

/**
 * Exporta uma recomendação técnica específica ou o histórico completo de campo como PDF
 */
export function exportToPDF(
  selectedCrop: string,
  contentOrMessages: string | ChatMessage[],
  isSingleMessage: boolean = false
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let y = margin;

  // --- CABEÇALHO DO DOCUMENTO ---
  doc.setFillColor(6, 78, 59); // Emerald 900
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('GEAAGRO NEMA IA', margin, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Consultor Virtual de Nutrição de Solo e Fitossanidade', margin, 21);
  doc.text(`Cultura Selecionada: ${selectedCrop}`, margin, 27);

  const formattedDate = new Date().toLocaleString('pt-BR');
  doc.text(`Gerado em: ${formattedDate}`, pageWidth - margin - 60, 15);
  doc.text('Suporte Embrapa / IAC', pageWidth - margin - 60, 21);

  y = 48;

  // --- TÍTULO DO RELATÓRIO ---
  doc.setTextColor(17, 24, 39); // Zinc 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const docTitle = isSingleMessage 
    ? 'LAUDO DE RECOMENDAÇÃO TÉCNICA INDIVIDUAL' 
    : 'RELATÓRIO DE ACOMPANHAMENTO DIÁRIO DE CAMPO';
  doc.text(docTitle, margin, y);
  y += 5;

  // Linha divisória verde
  doc.setDrawColor(16, 185, 129); // Emerald 500
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // --- RENDERIZAÇÃO DO CONTEÚDO ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81); // Zinc 700

  const addNewPageIfNecessary = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - margin - 15) {
      doc.addPage();
      y = margin;
      
      // Cabeçalho simplificado de nova página
      doc.setDrawColor(209, 213, 219);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text('GeaAgro Nema IA - Laudo Técnico Continuado', margin, y - 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
    }
  };

  if (isSingleMessage && typeof contentOrMessages === 'string') {
    // Exportar recomendação única
    const lines = contentOrMessages.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        y += 4;
        return;
      }

      if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
        const text = cleanMarkdown(trimmed);
        addNewPageIfNecessary(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(6, 78, 59); // Verde escuro
        const splitTitle = doc.splitTextToSize(text, contentWidth);
        doc.text(splitTitle, margin, y);
        y += (splitTitle.length * 5) + 2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);
      } else if (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || trimmed.startsWith('4.') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const text = cleanMarkdown(trimmed);
        addNewPageIfNecessary(8);
        doc.setFont('helvetica', 'bold');
        doc.text('•', margin, y);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(text, contentWidth - 4);
        doc.text(splitText, margin + 4, y);
        y += (splitText.length * 5) + 1;
      } else {
        const text = cleanMarkdown(trimmed);
        addNewPageIfNecessary(8);
        const splitText = doc.splitTextToSize(text, contentWidth);
        doc.text(splitText, margin, y);
        y += (splitText.length * 5) + 1;
      }
    });
  } else if (Array.isArray(contentOrMessages)) {
    // Exportar histórico completo do chat
    contentOrMessages.forEach((msg) => {
      // Ignora mensagem de boas-vindas se houver outras mensagens
      if (msg.id === 'welcome' && contentOrMessages.length > 1) return;

      addNewPageIfNecessary(20);
      
      // Cabeçalho da Mensagem (Remetente e Hora)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      if (msg.role === 'user') {
        doc.setTextColor(16, 185, 129); // Verde
        doc.text(`[PRODUTOR] - ${msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, margin, y);
      } else {
        doc.setTextColor(6, 78, 59); // Nema IA
        doc.text(`[NEMA IA] - ${msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, margin, y);
      }
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);

      const lines = msg.content.split('\n');
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) {
          y += 3;
          return;
        }

        if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
          const text = cleanMarkdown(trimmed);
          addNewPageIfNecessary(8);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(6, 78, 59);
          const splitTitle = doc.splitTextToSize(text, contentWidth);
          doc.text(splitTitle, margin, y);
          y += (splitTitle.length * 5) + 1;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(55, 65, 81);
        } else {
          const text = cleanMarkdown(trimmed);
          addNewPageIfNecessary(8);
          const splitText = doc.splitTextToSize(text, contentWidth);
          doc.text(splitText, margin, y);
          y += (splitText.length * 5) + 1;
        }
      });
      
      y += 6; // Espaço entre balões de mensagem
    });
  }

  // --- RODAPÉ DE ISENÇÃO E PÁGINA ---
  addNewPageIfNecessary(15);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - margin - 8, pageWidth - margin, pageHeight - margin - 8);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128); // Gray 500
  doc.text(
    'Aviso: Este laudo baseia-se em inteligência artificial integrada às normas técnicas da Embrapa e do IAC.',
    margin,
    pageHeight - margin - 4
  );
  doc.text(
    'Consulte sempre um engenheiro agrônomo credenciado antes de tomar decisões definitivas sobre manejo de insumos.',
    margin,
    pageHeight - margin - 1
  );

  // Nome do arquivo baseado na cultura e data
  const dateStr = new Date().toISOString().slice(0, 10);
  const cleanCropName = selectedCrop.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`Recomendacao_GeaAgro_${cleanCropName}_${dateStr}.pdf`);
}
