
import React, { useState } from 'react';
import { User, Mail, Bell, Shield, Globe, Smartphone, Moon, Save, Camera } from 'lucide-react';
import clsx from 'clsx';

interface SettingsProps {
  user: any;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || '',
    bio: 'Merhaba, ben öğrenmeye hevesli bir Akademi İstanbul üyesiyim.',
    phone: '+90 555 123 45 67',
    language: 'tr',
    timezone: 'Europe/Istanbul'
  });

  // Mock Toggles
  const [notifications, setNotifications] = useState({
    emailCourse: true,
    emailMarketing: false,
    smsSecurity: true,
    pushMentions: true
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ayarlar</h1>
          <p className="text-slate-500 mt-1">Hesap tercihlerinizi ve kişisel bilgilerinizi yönetin.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <button 
                onClick={() => setActiveTab('profile')}
                className={clsx(
                  "w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors text-left border-l-4",
                  activeTab === 'profile' ? "bg-indigo-50 text-indigo-700 border-indigo-600" : "text-slate-600 hover:bg-gray-50 border-transparent"
                )}
              >
                <User className="w-5 h-5" /> Profil Bilgileri
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={clsx(
                  "w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors text-left border-l-4",
                  activeTab === 'notifications' ? "bg-indigo-50 text-indigo-700 border-indigo-600" : "text-slate-600 hover:bg-gray-50 border-transparent"
                )}
              >
                <Bell className="w-5 h-5" /> Bildirimler
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={clsx(
                  "w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors text-left border-l-4",
                  activeTab === 'security' ? "bg-indigo-50 text-indigo-700 border-indigo-600" : "text-slate-600 hover:bg-gray-50 border-transparent"
                )}
              >
                <Shield className="w-5 h-5" /> Güvenlik & Giriş
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
           {activeTab === 'profile' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Avatar Section */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-6">
                   <div className="relative">
                      <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                      <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-md border-2 border-white">
                        <Camera className="w-4 h-4" />
                      </button>
                   </div>
                   <div>
                      <h3 className="font-bold text-lg text-slate-900">Profil Fotoğrafı</h3>
                      <p className="text-sm text-slate-500 mb-3">JPG, GIF veya PNG. Maksimum 2MB.</p>
                      <div className="flex gap-3">
                         <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">Yükle</button>
                         <button className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg transition-colors">Kaldır</button>
                      </div>
                   </div>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Ad Soyad</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Ünvan</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">E-posta</label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                           <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Telefon</label>
                        <div className="relative">
                           <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                           <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                        </div>
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Biyografi</label>
                      <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32 resize-none"></textarea>
                      <p className="text-xs text-gray-500 text-right">0/500 karakter</p>
                   </div>

                   <div className="pt-6 border-t border-gray-100 flex justify-end">
                      <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
                        <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                      </button>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'notifications' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 mb-6">E-posta Bildirimleri</h3>
                  <div className="space-y-4">
                     <ToggleItem 
                        title="Kurs Güncellemeleri" 
                        desc="Kayıtlı olduğunuz kurslara yeni içerik eklendiğinde haber ver." 
                        checked={notifications.emailCourse}
                        onChange={() => setNotifications({...notifications, emailCourse: !notifications.emailCourse})}
                     />
                     <ToggleItem 
                        title="Haber ve Kampanyalar" 
                        desc="Akademi İstanbul hakkındaki yeniliklerden ve fırsatlardan haberdar ol." 
                        checked={notifications.emailMarketing}
                        onChange={() => setNotifications({...notifications, emailMarketing: !notifications.emailMarketing})}
                     />
                  </div>
               </div>

               <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 mb-6">Sistem ve Güvenlik</h3>
                  <div className="space-y-4">
                     <ToggleItem 
                        title="Güvenlik Uyarıları (SMS)" 
                        desc="Şüpheli giriş denemelerinde telefonuma SMS gönder." 
                        checked={notifications.smsSecurity}
                        onChange={() => setNotifications({...notifications, smsSecurity: !notifications.smsSecurity})}
                     />
                     <ToggleItem 
                        title="Bahsedilmeler (Push)" 
                        desc="Forum tartışmalarında birisi sizden bahsettiğinde tarayıcı bildirimi gönder." 
                        checked={notifications.pushMentions}
                        onChange={() => setNotifications({...notifications, pushMentions: !notifications.pushMentions})}
                     />
                  </div>
               </div>
             </div>
           )}

           {activeTab === 'security' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-lg text-slate-900 mb-6">Şifre Değiştir</h3>
                   <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Mevcut Şifre</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Yeni Şifre</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Yeni Şifre (Tekrar)</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                      </div>
                      <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Şifreyi Güncelle</button>
                   </div>
                </div>

                 <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
                   <div>
                      <h3 className="font-bold text-lg text-slate-900">İki Aşamalı Doğrulama (2FA)</h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-lg">Hesabınızı daha güvenli hale getirmek için girişlerde telefonunuza gelen kodu girmenizi isteriz.</p>
                   </div>
                   <button className="bg-green-50 text-green-600 border border-green-200 px-6 py-2.5 rounded-xl font-bold hover:bg-green-100 transition-colors">Aktifleştir</button>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ title, desc, checked, onChange }: any) => (
  <div className="flex items-center justify-between">
     <div>
       <p className="font-bold text-slate-800 text-sm">{title}</p>
       <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
     </div>
     <button 
       onClick={onChange}
       className={clsx(
         "w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out",
         checked ? "bg-indigo-600" : "bg-gray-200"
       )}
     >
       <div className={clsx(
         "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300",
         checked ? "left-7" : "left-1"
       )}></div>
     </button>
  </div>
);

export default Settings;