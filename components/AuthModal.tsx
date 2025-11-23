
import React from 'react';
import { X, User, ShieldCheck, BookOpen, Building2, Globe } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row h-[500px]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side - Image & Info */}
        <div className="hidden md:flex w-1/3 bg-slate-900 text-white p-8 flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 to-violet-900 opacity-50"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                 <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Akademi İstanbul</h2>
              <p className="text-indigo-200 text-sm">Tek hesapla tüm şehre bağlanın.</p>
           </div>
           <div className="relative z-10 text-xs text-slate-400">
              © 2024 İstanbul Büyükşehir Belediyesi
           </div>
           {/* Decorative Circles */}
           <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
        </div>

        {/* Right Side - Interaction */}
        <div className="flex-1 p-8 overflow-y-auto bg-white relative flex flex-col justify-center">
           
           <div className="max-w-sm mx-auto w-full">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Giriş Yap</h3>
                <p className="text-gray-500 mt-2 text-sm">Platforma erişmek için rolünüzü seçin (Demo).</p>
              </div>

              <div className="space-y-3">
                <RoleButton 
                  icon={<User className="w-5 h-5" />}
                  title="Öğrenci Girişi"
                  onClick={() => onLogin(UserRole.STUDENT)}
                />
                <RoleButton 
                  icon={<BookOpen className="w-5 h-5" />}
                  title="Eğitmen Girişi"
                  onClick={() => onLogin(UserRole.INSTRUCTOR)}
                />
                <RoleButton 
                  icon={<ShieldCheck className="w-5 h-5" />}
                  title="Akademi Yöneticisi (Tenant)"
                  onClick={() => onLogin(UserRole.TENANT_ADMIN)}
                />
                 <RoleButton 
                  icon={<Globe className="w-5 h-5 text-indigo-600" />}
                  title="Süper Admin (Platform)"
                  onClick={() => onLogin(UserRole.ADMIN)}
                  highlight
                />
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-700 font-semibold py-3 rounded-xl hover:bg-red-100 transition-colors border border-red-100 text-sm">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Turkiye.gov.tr_icon.svg/1200px-Turkiye.gov.tr_icon.svg.png" alt="e-Devlet" className="w-5 h-5" />
                  e-Devlet ile Giriş Yap
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const RoleButton = ({ icon, title, onClick, highlight }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left group ${
      highlight 
        ? 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300' 
        : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
    }`}
  >
    <div className={`p-2 rounded-md transition-colors text-gray-600 ${highlight ? 'bg-white' : 'bg-gray-100 group-hover:bg-white group-hover:text-indigo-600'}`}>
      {icon}
    </div>
    <span className={`font-bold text-sm ${highlight ? 'text-indigo-800' : 'text-slate-700 group-hover:text-indigo-700'}`}>{title}</span>
  </button>
);

export default AuthModal;
