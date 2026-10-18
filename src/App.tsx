import React, { useState, useEffect } from 'react';
import { AUTO_DETECT_CROP } from './data/crops';
import { Header } from './components/Header';
import { ChatNemaIA } from './components/ChatNemaIA';
import { Sprout, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [selectedCrop, setSelectedCrop] = useState<string>(AUTO_DETECT_CROP);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('nema_ia_theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nema_ia_theme', theme);
    } catch (e) {
      console.warn('LocalStorage is not available:', e);
    }
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 flex flex-col selection:bg-emerald-200 selection:text-emerald-900 ${
      theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-150 text-stone-900'
    }`}>
      {/* Header */}
      <Header
        selectedCrop={selectedCrop}
        setSelectedCrop={setSelectedCrop}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-10">
        <ChatNemaIA selectedCrop={selectedCrop} theme={theme} />
      </main>

      {/* Footer */}
      <footer className={`py-6 border-t text-xs transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-zinc-900 text-zinc-400 border-zinc-800' 
          : 'bg-emerald-950 text-emerald-300 border-emerald-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-center">
            <Sprout className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-400'}`} />
            <span className="font-extrabold text-white text-sm">GeaAgro Nema IA</span>
            <span className={`text-[10px] px-2 py-0.5 rounded border hidden sm:inline-block ${
              theme === 'dark' 
                ? 'bg-zinc-800 text-zinc-300 border-zinc-700' 
                : 'bg-emerald-900 text-emerald-300 border-emerald-800'
            }`}>
              Agronomia Digital
            </span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 font-medium ${
            theme === 'dark' ? 'text-zinc-400' : 'text-emerald-300/80'
          }`}>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Base Científica Embrapa / IAC
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Padrões MAPA / CREA
            </span>
          </div>

          <div className={`text-[10px] sm:text-[11px] text-center md:text-right ${
            theme === 'dark' ? 'text-zinc-500' : 'text-emerald-400/70'
          }`}>
            © {new Date().getFullYear()} GeaAgro Nema IA - Desenvolvido por Fatima Leão & Lucas Mendes
          </div>
        </div>
      </footer>
    </div>
  );
}
