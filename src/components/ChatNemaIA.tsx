import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChatMessage } from '../types';
import { getStoredMessages, saveAllStoredMessages, saveStoredMessage } from '../lib/indexedDB';
import { exportToPDF } from '../lib/pdfExporter';
import { AUTO_DETECT_CROP } from '../data/crops';
import { MarkdownRenderer } from './MarkdownRenderer';
import { 
  Send, 
  Bot, 
  User, 
  Image as ImageIcon, 
  Mic, 
  Trash2, 
  Sparkles, 
  Loader2, 
  X,
  Download,
  Sprout,
  HelpCircle,
  FileSpreadsheet,
  Camera,
  RefreshCw,
  FileText
} from 'lucide-react';

interface Props {
  selectedCrop: string;
  theme?: 'light' | 'dark';
}

const getLocalAgronomicResponse = (promptText: string, crop: string): string => {
  const normalized = promptText.toLowerCase();
  
  let response = `### 🎓 Diagnóstico da Base Científica Offline (Embrapa/IAC)\n\n`;
  response += `*Nota: Atuando no **Mecanismo de Contingência Local Offline** para garantir suporte ininterrupto.* \n\n`;

  if (normalized.includes('calagem') || normalized.includes('nc') || normalized.includes('calcário') || normalized.includes('ph')) {
    response += `#### 🩺 Parecer Técnico sobre Acidez & Calagem (${crop === AUTO_DETECT_CROP ? 'Geral' : crop})
Para a cultura de **${crop === AUTO_DETECT_CROP ? 'Sua Lavoura' : crop}**, a calagem visa elevar a Saturação por Bases (V%) para os níveis adequados recomendados pelo Manual de Adubação e Calagem:
1. **Saturação de Bases Alvo (V₂):** Recomendado elevar para o value de referência (ex: Soja/Milho = 60-70%, Café = 60%, Algodão = 70%).
2. **Fórmula da Necessidade de Calagem (NC em t/ha):**
   $$NC = \\frac{(V_2 - V_1) \\times CTC}{PRNT}$$
   Onde $V_1$ é a saturação atual e $CTC$ é a capacidade de troca catiônica do solo.
3. **Recomendações Práticas:** Incorporação uniforme de calcário dolomítico (para suprir Ca e Mg) de 2 a 3 meses antes do plantio para reação completa no solo.`;
  } else if (normalized.includes('nematoide') || normalized.includes('nema') || normalized.includes('praga') || normalized.includes('doença')) {
    response += `#### 🐛 Parecer sobre Nematoides e Fitossanidade (${crop === AUTO_DETECT_CROP ? 'Geral' : crop})
Para o manejo de pragas e nematoides (ex: Nematóide-das-galhas *Meloidogyne*, Nematóide de cisto *Heterodera*) na cultura de **${crop === AUTO_DETECT_CROP ? 'Sua Lavoura' : crop}**:
1. **Controle Cultural:** Rotação de culturas com espécies não hospedeiras, preferencialmente *Crotalaria spectabilis* ou *Crotalaria ochroleuca*.
2. **Controle Biológico:** Uso de nematicidas microbiológicos à base de *Bacillus subtilis*, *Bacillus methylotrophicus* ou fungos como *Purpureocillium lilacinum*.
3. **Prevenção:** Utilização de sementes certificadas livres de patógenos, higienização rigorosa de maquinários agrícolas entre talhões infestados e correção física/química do solo.`;
  } else if (normalized.includes('aduba') || normalized.includes('n-p-k') || normalized.includes('fosfor') || normalized.includes('potassio') || normalized.includes('nitrogenio')) {
    response += `#### 🧪 Recomendação de Nutrição e Fertilidade NPK (${crop === AUTO_DETECT_CROP ? 'Geral' : crop})
Recomendações técnicas locais com base no teor do solo para **${crop === AUTO_DETECT_CROP ? 'Sua Lavoura' : crop}**:
1. **Fósforo (P):** Nutriente essencial na fase inicial (desenvolvimento radicular). Fontes sugeridas: Superfosfato Simples (que fornece enxofre e cálcio) ou MAP.
2. **Potássio (K):** Regulação osmótica e enchimento de grãos/frutos. Aplicar parcelado em solos arenosos para evitar lixiviação.
3. **Nitrogênio (N):** Para gramíneas (Milho, Trigo), o fornecimento na semeadura e cobertura é crucial. Para leguminosas (Soja, Feijão), priorize a inoculação com *Bradyrhizobium* (FBN).`;
  } else {
    response += `#### 🌾 Parecer Técnico Geral (${crop === AUTO_DETECT_CROP ? 'Geral' : crop})
Olá! Sou o **Especialista de Contingência Nema IA**. Com base na sua solicitação sobre **${crop === AUTO_DETECT_CROP ? 'Sua Lavoura' : crop}**:
1. **Acompanhamento de Campo:** Recomendamos monitorar o talhão semanalmente (amostragem em zigue-zague).
2. **Manejo Biológico:** Estimule o microbioma do solo com adição de matéria orgânica de qualidade e bioinsumos.
3. **Correção de Solo:** Mantenha o pH em CaCl2 na faixa ideal de 5,5 a 6,2 para otimizar a disponibilidade de todos os macro e micronutrientes.
4. **Próximos Passos:** Se as dúvidas persistirem, consulte o laudo técnico laboratorial completo ou tente conectar-se novamente aos nossos servidores de IA principais assim que reestabelecidos.`;
  }

  return response;
};

export const ChatNemaIA: React.FC<Props> = ({ selectedCrop, theme = 'light' }) => {
  const cropLabel = selectedCrop === AUTO_DETECT_CROP ? 'Sua Lavoura (Detecção Automática de 200+ Culturas)' : selectedCrop;

  const [aiEngine, setAiEngine] = useState<'gemini' | 'backup' | 'local_embrapa'>('gemini');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Carrega o histórico do banco de dados IndexedDB
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await getStoredMessages();
        if (stored && stored.length > 0) {
          setMessages(stored);
        } else {
          const defaultWelcome: ChatMessage = {
            id: 'welcome',
            role: 'assistant',
            content: `Olá! Sou a **Nema IA GeaAgro**, sua assistente virtual técnica especializada em agronomia digital, fertilidade do solo, nutrição vegetal e suporte para mais de **200 culturas agrícolas brasileiras**.

✨ **Modo Automático Ativo**: Você não precisa escolher manualmente a cultura! Ao digitar sua dúvida, enviar fotos ou anexar um laudo de solo, eu identifico a cultura (Soja, Milho, Café, Manga, Alho, Eucalipto, etc.) e respondo com as diretrizes específicas da Embrapa/IAC.

Como posso ajudar no seu manejo hoje?
- 🧪 **Cálculo de Calagem e Gessagem** para alavancar a saturação de bases (V%).
- 🦠 **Identificação de Doenças, Pragas e Nematoides** (*Meloidogyne*, *Pratylenchus*, etc.).
- 🌿 **Sintomas de Deficiência Nutricional** nas folhas.
- 📋 **Preenchimento de Receituário Agronômico** regulatório.
- 📊 **Modelos de Negócios Agrícolas (Agro Canvas)**.

*Envie perguntas em texto, fotos de folhas/laudos ou use os atalhos abaixo!*`,
            timestamp: new Date(),
          };
          setMessages([defaultWelcome]);
          await saveStoredMessage(defaultWelcome);
        }
      } catch (err) {
        console.error('Erro ao ler mensagens do IndexedDB:', err);
      } finally {
        setHistoryLoaded(true);
      }
    };
    loadHistory();
  }, []);

  // Sincroniza qualquer alteração das mensagens de volta para o IndexedDB
  useEffect(() => {
    if (historyLoaded) {
      saveAllStoredMessages(messages);
    }
  }, [messages, historyLoaded]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Camera PWA Integration States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraFallbackInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async (mode: 'user' | 'environment' = 'environment') => {
    setCameraError(null);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        "Não foi possível acessar a câmera do dispositivo diretamente. Use a câmera do sistema ou anexe uma foto."
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const switchCamera = () => {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    if (isCameraOpen) {
      startCamera(cameraFacingMode);
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const quickPrompts = [
    selectedCrop === AUTO_DETECT_CROP
      ? `Como calcular a necessidade de calagem (NC) para Soja e Milho?`
      : `Como calcular a necessidade de calagem (NC) para ${selectedCrop}?`,
    `Quais os sintomas de deficiência de Potássio (K) e Magnésio (Mg) nas folhas?`,
    `Como realizar o manejo integrado de Nematoides (*Meloidogyne* e *Pratylenchus*)?`,
    `Quais informações são obrigatórias em um Receituário Agronômico correto?`,
    `Como montar a Proposta de Valor no Canvas Agro para a fazenda?`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setToastMessage('Selecione uma imagem menor que 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendDirectly = async (textToSend: string, engineToUse: 'gemini' | 'backup' | 'local_embrapa') => {
    setLoading(true);
    try {
      if (engineToUse === 'local_embrapa') {
        const localText = getLocalAgronomicResponse(textToSend, selectedCrop);
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: localText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const apiMessages = [...messages].map((m) => ({
          role: m.role,
          content: m.content,
        }));
        if (apiMessages.length === 0 || apiMessages[apiMessages.length - 1].content !== textToSend) {
          apiMessages.push({ role: 'user', content: textToSend });
        }
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            selectedCrop: selectedCrop,
            isBackup: engineToUse === 'backup',
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Falha de resposta do servidor da Nema IA.');
        }

        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.text || 'Não foi possível gerar uma resposta agronômica no momento.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Aviso do Sistema Nema IA**: ${err.message || 'Falha de resposta do servidor da Nema IA.'}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (overrideContent?: string) => {
    const textToSend = overrideContent || input;
    if (!textToSend.trim() && !selectedImage) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      imageUrl: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const imageToSend = selectedImage;
    setSelectedImage(null);
    setLoading(true);

    if (aiEngine === 'local_embrapa') {
      setTimeout(() => {
        const localText = getLocalAgronomicResponse(textToSend, selectedCrop);
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: localText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          imageBase64: imageToSend || undefined,
          selectedCrop: selectedCrop,
          isBackup: aiEngine === 'backup',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Falha de resposta do servidor da Nema IA.');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'Não foi possível gerar uma resposta agronômica no momento.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Aviso do Sistema Nema IA**: ${err.message || 'Falha de resposta do servidor da Nema IA.'}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Speech Recognition Speech-to-Text helper
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setToastMessage('Seu navegador não possui suporte a ditado por áudio. Você pode digitar normalmente.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const exportChat = () => {
    const text = messages
      .map(
        (m) =>
          `[${m.role.toUpperCase()} - ${m.timestamp.toLocaleTimeString()}]\n${m.content}\n-----------------------------------\n`
      )
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_Atendimento_Nema_IA_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-xl shadow-md overflow-hidden my-2 border transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-zinc-900 border-zinc-800' 
        : 'bg-stone-50 border-stone-200'
    }`}>
      {/* Top Chat Header */}
      <div className="bg-emerald-900 text-white p-2 sm:p-3.5 px-3 sm:px-5 flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden mr-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center text-emerald-300 shrink-0">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
              <h2 className="font-bold text-sm sm:text-base whitespace-nowrap">
                Nema IA GeaAgro
              </h2>
              <span className="text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-normal truncate">
                {selectedCrop === AUTO_DETECT_CROP ? 'Auto Detecção' : `Cultura: ${selectedCrop}`}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-200 truncate hidden sm:block">Consultoria Agronômica com Inteligência Artificial</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button
            onClick={exportChat}
            title="Exportar Histórico em Texto"
            className="p-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 rounded-lg text-xs flex items-center gap-1 border border-emerald-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Texto</span>
          </button>
          <button
            onClick={() => exportToPDF(selectedCrop, messages, false)}
            title="Exportar Relatório PDF Completo"
            className="p-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 rounded-lg text-xs flex items-center gap-1 border border-emerald-700 transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </button>
          <button
            onClick={() =>
              setMessages([
                {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: `Conversa reiniciada. Em que posso ajudar na lavoura de **${selectedCrop}** agora?`,
                  timestamp: new Date(),
                },
              ])
            }
            title="Nova Consulta"
            className="p-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 rounded-lg text-xs border border-emerald-700 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Engine Sub-header Selection */}
      <div className="bg-emerald-950 text-white py-2 px-4 sm:px-5 flex flex-wrap items-center justify-between text-xs gap-2 border-b border-emerald-900 shadow-inner">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${aiEngine === 'local_embrapa' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`}></span>
          <span className="text-emerald-300 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">Motor de Resposta IA:</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={aiEngine}
            onChange={(e) => setAiEngine(e.target.value as any)}
            className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-[11px] font-bold py-1 px-2 pr-4 rounded-lg border border-emerald-700 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer transition"
          >
            <option value="gemini">✨ Gemini 3.8 Flash (Nema Principal)</option>
            <option value="backup">🌐 Servidor Secundário (Nema Backup)</option>
            <option value="local_embrapa">🎓 Base Científica Local (Embrapa/IAC)</option>
          </select>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="bg-amber-500 text-stone-900 text-xs px-4 py-2 font-medium flex items-center justify-between border-b border-amber-600 animate-fadeIn">
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-stone-900 hover:text-black font-bold ml-2 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-950/60' : 'bg-stone-100/60'
      }`}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start max-w-[88%] sm:max-w-[80%] space-x-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-900 text-amber-300 border border-emerald-700'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 shadow-xs text-sm leading-relaxed transition-colors duration-300 ${
                  msg.role === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-none shadow-sm'
                    : theme === 'dark'
                      ? 'bg-zinc-800 text-zinc-150 border border-zinc-700 rounded-tl-none shadow-sm'
                      : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.imageUrl && (
                  <div className={`mb-3 rounded-lg overflow-hidden max-w-xs border ${
                    theme === 'dark' ? 'border-zinc-700' : 'border-stone-200'
                  }`}>
                    <img src={msg.imageUrl} alt="Imagem enviada" className="w-full object-cover max-h-56" />
                  </div>
                )}

                {msg.role === 'assistant' ? (
                  <div>
                    <MarkdownRenderer content={msg.content} />
                    {msg.content.includes('Falha de resposta do servidor') && (
                      <div className={`mt-4 pt-3 border-t space-y-3 ${
                        theme === 'dark' ? 'border-zinc-700' : 'border-red-150'
                      }`}>
                        <p className={`text-[11px] font-bold ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-stone-600'
                        }`}>
                          O servidor principal está indisponível. Para não ficar sem suporte no talhão, selecione um mecanismo alternativo de inteligência:
                        </p>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setAiEngine('local_embrapa');
                              const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                              if (lastUserMsg) {
                                handleSendDirectly(lastUserMsg.content, 'local_embrapa');
                              }
                            }}
                            className={`rounded-xl px-3 py-2 text-xs font-bold text-left flex items-center justify-between transition cursor-pointer border ${
                              theme === 'dark'
                                ? 'bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border-emerald-900'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-200'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <Sprout className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
                              <span>Base Científica Local (Embrapa/IAC)</span>
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                              theme === 'dark' ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-200 text-emerald-900'
                            }`}>Offline & Instantâneo</span>
                          </button>
                          <button
                            onClick={() => {
                              setAiEngine('backup');
                              const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                              if (lastUserMsg) {
                                handleSendDirectly(lastUserMsg.content, 'backup');
                              }
                            }}
                            className={`rounded-xl px-3 py-2 text-xs font-bold text-left flex items-center justify-between transition cursor-pointer border ${
                              theme === 'dark'
                                ? 'bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border-amber-900'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-850 border border-amber-250'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <Bot className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>Servidor Secundário (Nema Backup)</span>
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                              theme === 'dark' ? 'bg-amber-900 text-amber-200' : 'bg-amber-200 text-amber-900'
                            }`}>Servidor Reserva</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}

                <div
                  className={`text-[10px] flex items-center justify-between gap-4 border-t pt-2.5 mt-3 transition-colors duration-300 ${
                    msg.role === 'user' 
                      ? 'border-emerald-700/30 text-emerald-200' 
                      : theme === 'dark' 
                        ? 'border-zinc-700/60 text-zinc-500' 
                        : 'border-stone-200/80 text-stone-400'
                  }`}
                >
                  {msg.role === 'assistant' && msg.id !== 'welcome' ? (
                    <button
                      onClick={() => exportToPDF(selectedCrop, msg.content, true)}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition cursor-pointer"
                      title="Exportar esta recomendação específica em PDF"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Baixar Laudo PDF</span>
                    </button>
                  ) : (
                    <span></span>
                  )}
                  <span>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className={`flex items-center space-x-2 border px-4 py-3 rounded-2xl shadow-xs text-xs font-medium transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-zinc-800 border-zinc-700 text-emerald-400' 
                : 'bg-white border-stone-200 text-emerald-800'
            }`}>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Nema IA processando análise agronômica...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className={`pt-2.5 pb-1 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-stone-50 border-stone-200'
      }`}>
        <div className={`flex items-center space-x-2 text-xs mb-1.5 font-medium px-4 ${
          theme === 'dark' ? 'text-zinc-400' : 'text-stone-500'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Atalhos de Consulta no Campo:</span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none px-4">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={loading}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer disabled:opacity-50 border ${
                theme === 'dark'
                  ? 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-750 hover:text-white hover:border-zinc-600'
                  : 'bg-white hover:bg-emerald-50 border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-800'
              }`}
            >
              {qp}
            </button>
          ))}
          {/* Add invisible spacer element to preserve right padding on scroll */}
          <div className="w-1 shrink-0"></div>
        </div>
      </div>

      {/* Input Form */}
      <div className={`p-3 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
      }`}>
        {selectedImage && (
          <div className="mb-2 relative inline-block">
            <img
              src={selectedImage}
              alt="Anexo"
              className="w-16 h-16 object-cover rounded-lg border border-emerald-500 shadow-xs"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 cursor-pointer shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-1 sm:gap-2">
          {/* Action Buttons */}
          <div className="flex items-center mb-0.5 shrink-0 -ml-1 sm:ml-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Anexar Foto da Folha, Solo ou Sintoma"
              className={`p-2 sm:p-2.5 rounded-full transition cursor-pointer ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800'
                  : 'text-stone-500 hover:text-emerald-700 hover:bg-stone-100'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Native Capture camera fallback */}
            <input
              type="file"
              ref={cameraFallbackInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                  setIsCameraOpen(true);
                } else {
                  cameraFallbackInputRef.current?.click();
                }
              }}
              title="Tirar Foto do Sintoma ou Praga"
              className={`p-2 sm:p-2.5 rounded-full transition cursor-pointer ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800'
                  : 'text-stone-500 hover:text-emerald-700 hover:bg-stone-100'
              }`}
            >
              <Camera className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Ouvindo...' : 'Ditar mensagem por voz'}
              className={`p-2 sm:p-2.5 rounded-full transition cursor-pointer ${
                isListening
                  ? 'bg-red-100 text-red-600 animate-pulse'
                  : theme === 'dark'
                    ? 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800'
                    : 'text-stone-500 hover:text-emerald-700 hover:bg-stone-100'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 min-w-0 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Mensagem..."
              rows={1}
              className={`w-full rounded-2xl px-3.5 py-2.5 sm:py-3 text-sm focus:outline-none resize-none transition min-h-[44px] sm:min-h-[48px] max-h-[120px] shadow-xs ${
                theme === 'dark'
                  ? 'bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:bg-zinc-850'
                  : 'bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:border-emerald-600 focus:bg-white'
              }`}
            />
          </div>

          <button
            onClick={() => handleSend()}
            disabled={loading || (!input.trim() && !selectedImage)}
            className="mb-0.5 p-2 sm:p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full disabled:opacity-50 transition cursor-pointer shadow-sm flex items-center justify-center shrink-0 h-[40px] w-[40px] sm:h-[44px] sm:w-[44px]"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* In-App Camera Modal Dialog */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white py-2 z-10">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-400" />
              Capturar Sintoma ou Praga
            </h3>
            <button
              onClick={stopCamera}
              className="p-2 bg-stone-800 hover:bg-stone-700 rounded-full text-stone-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video / Live Stream Screen */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-stone-950 border border-stone-800">
            {cameraError ? (
              <div className="p-6 text-center text-stone-300 max-w-sm">
                <p className="text-sm mb-4 font-medium">{cameraError}</p>
                <button
                  onClick={() => {
                    cameraFallbackInputRef.current?.click();
                    stopCamera();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer animate-pulse"
                >
                  Abrir Câmera do Sistema
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover max-h-[70vh]"
                />
                
                {/* Focusing Guide lines */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-dashed border-emerald-400/55 rounded-3xl flex items-center justify-center relative">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>
                    
                    <span className="text-[10px] text-emerald-300 font-semibold px-2 py-1 bg-black/60 rounded-full">
                      Enquadre a folha ou praga
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-around py-4 sm:py-6 z-10">
            {/* System fallback option */}
            <button
              onClick={() => {
                cameraFallbackInputRef.current?.click();
                stopCamera();
              }}
              className="p-3 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer"
              title="Usar Câmera do Sistema"
            >
              <RefreshCw className="w-5 h-5 opacity-70" />
              <span>Usar Nativo</span>
            </button>

            {/* Main Shutter Capture Button */}
            {!cameraError && (
              <button
                onClick={capturePhoto}
                className="w-16 h-16 bg-white hover:bg-stone-100 border-4 border-emerald-500 rounded-full flex items-center justify-center transition transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                title="Tirar Foto"
              >
                <div className="w-11 h-11 bg-emerald-600 hover:bg-emerald-700 rounded-full" />
              </button>
            )}

            {/* Switch Camera Button (Front / Rear) */}
            {!cameraError && (
              <button
                onClick={switchCamera}
                className="p-3 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer"
                title="Alternar Câmera Frontal / Traseira"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Alternar</span>
              </button>
            )}
          </div>

          {/* Hidden Canvas for capture rendering */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};
