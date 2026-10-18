import React, { useState, useEffect } from 'react';
import { CROPS_DATABASE, AUTO_DETECT_CROP, getCropsByCategory } from '../data/crops';
import { 
  Sprout, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  Search,
  X,
  Cpu,
  Download,
  Share2,
  Smartphone,
  PlusSquare,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCrop,
  setSelectedCrop,
  theme,
  toggleTheme,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // PWA Installer Prompt States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [activeInstructionTab, setActiveInstructionTab] = useState<'android' | 'ios' | 'desktop'>('android');

  useEffect(() => {
    // Check if device is iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(ios);
    if (ios) {
      setActiveInstructionTab('ios');
    } else if (/Android/.test(navigator.userAgent)) {
      setActiveInstructionTab('android');
    } else {
      setActiveInstructionTab('desktop');
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent standard Chrome mini-infobar from showing
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA installer response: ${outcome}`);
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Open our rich instructions modal if the automatic prompt is not available
      setShowInstallModal(true);
    }
  };

  const cropsByCategory = getCropsByCategory();

  const filteredCrops = CROPS_DATABASE.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50 border-b border-emerald-800">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Persona Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-amber-200">
                  Nema IA
                </span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-emerald-800 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-700">
                  GeaAgro
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-emerald-300 flex items-center gap-1 font-medium hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Agronomia Digital & IA Multi-Cultura (200+ Culturas)
              </p>
            </div>
          </div>

          {/* Context Crop Selector & Quick Status */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-950 text-amber-300 hover:text-amber-200 border border-emerald-700 shadow-sm cursor-pointer transition shrink-0"
              title={theme === 'dark' ? "Ativar Modo Claro (Melhor para Sol Forte no Campo)" : "Ativar Modo Escuro"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-300" />}
            </button>

            {/* PWA Install Button */}
            <button
              onClick={handleInstallClick}
              className="flex items-center bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold rounded-xl px-2.5 py-1.5 sm:px-3 text-[11px] sm:text-xs transition shadow-sm cursor-pointer shrink-0"
              title="Instalar Nema IA no seu Celular ou Computador"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-950 mr-1 shrink-0 animate-bounce" />
              <span>Instalar</span>
            </button>

            {/* Automatic Crop Context Selector Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-emerald-950/80 hover:bg-emerald-950 rounded-xl px-2 py-1.5 sm:px-3 border border-amber-400/50 text-[11px] sm:text-xs text-white transition shadow-sm cursor-pointer group max-w-[110px] sm:max-w-none"
              title="Clique para alternar entre Detecção Automática ou escolher entre 200+ culturas base"
            >
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 mr-1 sm:mr-1.5 animate-pulse shrink-0" />
              <div className="text-left flex flex-col justify-center overflow-hidden">
                <span className="text-[9px] text-emerald-300 block leading-tight font-medium truncate">Contexto:</span>
                <span className="font-bold text-amber-300 group-hover:text-amber-200 flex items-center gap-0.5 sm:gap-1 truncate text-[10px] sm:text-xs">
                  <span className="truncate">{selectedCrop === AUTO_DETECT_CROP ? 'Auto' : selectedCrop}</span>
                  <ChevronDown className="w-3 h-3 text-emerald-300 shrink-0" />
                </span>
              </div>
            </button>

            <div className="hidden lg:flex items-center text-xs bg-emerald-800/80 px-2.5 py-1 rounded-md text-emerald-200 border border-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <span>Base 200+ Culturas (Embrapa/IAC)</span>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL FOR 200+ CROPS SELECTOR & AUTO-DETECT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Seleção de Cultura (200+ Culturas Base)</h3>
                  <p className="text-xs text-emerald-300">
                    Por padrão a Nema IA detecta a cultura automaticamente nas perguntas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auto-Detect Button Option */}
            <div className="p-3 bg-emerald-50 border-b border-emerald-200">
              <button
                onClick={() => {
                  setSelectedCrop(AUTO_DETECT_CROP);
                  setIsModalOpen(false);
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                  selectedCrop === AUTO_DETECT_CROP
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm font-bold'
                    : 'bg-white text-emerald-950 hover:bg-emerald-100 border-emerald-300'
                }`}
              >
                <div className="flex items-center space-x-2 text-left">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold block">
                      ✨ Detecção Automática pela Nema IA (Recomendado)
                    </span>
                    <span className="text-[11px] opacity-80 block">
                      A IA identifica a cultura no seu texto, foto ou laudo sem necessidade de escolher manualmente.
                    </span>
                  </div>
                </div>
                {selectedCrop === AUTO_DETECT_CROP && (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                )}
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-stone-200 bg-stone-50 relative">
              <input
                type="text"
                placeholder="Buscar entre as 200+ culturas (ex: Soja, Manga, Pimenta, Eucalipto, Alho)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-300 focus:border-emerald-600 rounded-xl px-3.5 py-2 pl-9 text-xs sm:text-sm outline-none font-medium"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-6 top-5 pointer-events-none" />
            </div>

            {/* Crops Grid / Categorized List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {searchQuery ? (
                <div>
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                    Resultados da Busca ({filteredCrops.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredCrops.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCrop(c.name);
                          setIsModalOpen(false);
                        }}
                        className={`p-2.5 rounded-xl text-left text-xs transition border flex items-center justify-between cursor-pointer ${
                          selectedCrop === c.name
                            ? 'bg-emerald-800 text-white font-bold border-emerald-900'
                            : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        <span className="text-[10px] opacity-70 ml-1 font-mono shrink-0">V:{c.defaultV}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                Object.entries(cropsByCategory).map(([category, list]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-extrabold text-emerald-900 border-b border-emerald-100 pb-1 flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                        {list.length} culturas
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {list.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCrop(c.name);
                            setIsModalOpen(false);
                          }}
                          className={`p-2 rounded-xl text-left text-xs transition border flex items-center justify-between cursor-pointer ${
                            selectedCrop === c.name
                              ? 'bg-emerald-800 text-white font-bold border-emerald-900'
                              : 'bg-stone-50 hover:bg-emerald-50 text-stone-800 border-stone-200'
                          }`}
                        >
                          <span className="truncate">{c.name}</span>
                          <span className="text-[10px] opacity-70 font-mono shrink-0">V:{c.defaultV}%</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-stone-100 border-t border-stone-200 text-right text-xs text-stone-500">
              Base oficial de recomendação agronômica (Embrapa / IAC / FERTBIO)
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR PWA INSTALLATION STEPS */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-amber-400 animate-bounce" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Instalar Nema IA</h3>
                  <p className="text-[11px] text-emerald-300">
                    Tenha acesso rápido diretamente da sua tela de início
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selection Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50 p-2 gap-1 text-xs">
              <button
                onClick={() => setActiveInstructionTab('android')}
                className={`flex-1 py-2 px-1 rounded-lg flex items-center justify-center gap-1 font-bold transition cursor-pointer ${
                  activeInstructionTab === 'android'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-150'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Android
              </button>
              <button
                onClick={() => setActiveInstructionTab('ios')}
                className={`flex-1 py-2 px-1 rounded-lg flex items-center justify-center gap-1 font-bold transition cursor-pointer ${
                  activeInstructionTab === 'ios'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-150'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                iPhone / iPad
              </button>
              <button
                onClick={() => setActiveInstructionTab('desktop')}
                className={`flex-1 py-2 px-1 rounded-lg flex items-center justify-center gap-1 font-bold transition cursor-pointer ${
                  activeInstructionTab === 'desktop'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-150'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Computador
              </button>
            </div>

            {/* Instructions Content */}
            <div className="p-5 flex-1 text-sm text-stone-700 space-y-4">
              {activeInstructionTab === 'android' && (
                <div className="space-y-3">
                  <p className="font-semibold text-emerald-950">Como instalar no seu Android:</p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs leading-relaxed">
                    <li>
                      Abra este site no navegador <strong className="text-stone-900">Google Chrome</strong>.
                    </li>
                    <li>
                      Toque no ícone de <strong className="text-stone-900">três pontos (⋮)</strong> no canto superior direito.
                    </li>
                    <li>
                      Selecione <strong className="text-stone-900">"Adicionar à tela inicial"</strong> ou <strong className="text-stone-900">"Instalar aplicativo"</strong>.
                    </li>
                    <li>
                      Confirme a instalação e o ícone da Nema IA aparecerá no seu menu de aplicativos.
                    </li>
                  </ol>
                </div>
              )}

              {activeInstructionTab === 'ios' && (
                <div className="space-y-3">
                  <p className="font-semibold text-emerald-950">Como instalar no seu iOS (iPhone/iPad):</p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs leading-relaxed">
                    <li>
                      Abra este site no navegador <strong className="text-stone-900">Safari</strong>.
                    </li>
                    <li>
                      Toque no botão de <strong className="text-stone-900">Compartilhar</strong> (ícone de quadrado com uma seta para cima <Share2 className="inline w-3.5 h-3.5 text-emerald-700" />).
                    </li>
                    <li>
                      Role a lista de opções para baixo e toque em <strong className="text-stone-900">"Adicionar à Tela de Início"</strong> (ícone de <PlusSquare className="inline w-3.5 h-3.5 text-emerald-700" />).
                    </li>
                    <li>
                      Toque em <strong className="text-emerald-800 font-bold">Adicionar</strong> no canto superior direito para finalizar.
                    </li>
                  </ol>
                </div>
              )}

              {activeInstructionTab === 'desktop' && (
                <div className="space-y-3">
                  <p className="font-semibold text-emerald-950">Como instalar no Computador:</p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs leading-relaxed">
                    <li>
                      Use o navegador <strong className="text-stone-900">Google Chrome</strong> ou <strong className="text-stone-900">Microsoft Edge</strong>.
                    </li>
                    <li>
                      Clique no ícone de <strong className="text-stone-900">instalação (computador com uma seta para baixo)</strong> na barra de endereços do topo.
                    </li>
                    <li>
                      Ou clique nos <strong className="text-stone-900">três pontos (⋮)</strong> no canto superior e selecione <strong className="text-stone-900">"Salvar e compartilhar" &gt; "Instalar o aplicativo..."</strong>.
                    </li>
                  </ol>
                </div>
              )}

              {deferredPrompt && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      deferredPrompt.prompt();
                      setShowInstallModal(false);
                    }}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    Instalar Agora Automaticamente
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
              O aplicativo funcionará em tela cheia e offline com melhor desempenho.
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
