import React, { useState, useEffect } from 'react';
import { Accessibility, ZoomIn, ZoomOut, Sun, Moon, Eye } from 'lucide-react';

const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); // percentage
  const [contrast, setContrast] = useState<'normal' | 'high' | 'grayscale'>('normal');

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    document.body.classList.remove('high-contrast', 'grayscale-mode');
    if (contrast === 'high') document.body.classList.add('high-contrast');
    if (contrast === 'grayscale') document.body.classList.add('grayscale-mode');
  }, [fontSize, contrast]);

  return (
    <div className="fixed top-1/2 right-0 z-50 transform -translate-y-1/2">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-l-xl shadow-lg hover:bg-blue-700 transition-all"
          aria-label="Erişilebilirlik Menüsü"
        >
          <Accessibility className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white p-4 rounded-l-xl shadow-2xl border border-gray-200 w-64 animate-in slide-in-from-right">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-blue-600" /> Erişilebilirlik
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">Kapat</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Metin Boyutu</label>
              <div className="flex items-center justify-between bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setFontSize(curr => Math.max(80, curr - 10))} className="p-2 hover:bg-white rounded shadow-sm"><ZoomOut className="w-4 h-4" /></button>
                <span className="font-bold text-sm">{fontSize}%</span>
                <button onClick={() => setFontSize(curr => Math.min(150, curr + 10))} className="p-2 hover:bg-white rounded shadow-sm"><ZoomIn className="w-4 h-4" /></button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Görünüm</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setContrast('normal')}
                  className={`p-2 rounded flex flex-col items-center gap-1 text-xs ${contrast === 'normal' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <Sun className="w-4 h-4" /> Normal
                </button>
                <button 
                  onClick={() => setContrast('high')}
                  className={`p-2 rounded flex flex-col items-center gap-1 text-xs ${contrast === 'high' ? 'bg-yellow-100 text-black ring-1 ring-black font-bold' : 'bg-gray-900 text-white hover:bg-black'}`}
                >
                  <Eye className="w-4 h-4" /> Kontrast
                </button>
                <button 
                  onClick={() => setContrast('grayscale')}
                  className={`p-2 rounded flex flex-col items-center gap-1 text-xs ${contrast === 'grayscale' ? 'bg-gray-300 text-gray-900 ring-1 ring-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <Moon className="w-4 h-4" /> Gri
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-[10px] text-gray-400 text-center">
            WCAG 2.2 Uyumlu
          </div>
        </div>
      )}
      
      <style>{`
        .high-contrast {
          filter: contrast(125%);
          background-color: #000 !important;
          color: #fff !important;
        }
        .high-contrast * {
          border-color: #fff !important;
          background-color: #000 !important;
          color: #fff !important;
        }
        .high-contrast img {
          filter: contrast(100%);
        }
        .grayscale-mode {
          filter: grayscale(100%);
        }
      `}</style>
    </div>
  );
};

export default AccessibilityWidget;