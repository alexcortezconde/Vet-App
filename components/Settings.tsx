
import React, { useState } from 'react';
import { User as UserType } from '../types';
import { 
  User as UserIcon, 
  Globe, 
  Bell, 
  Shield, 
  Moon, 
  HelpCircle, 
  ChevronRight,
  LogOut,
  Camera,
  Sparkles,
  X,
  ChevronLeft
} from 'lucide-react';

interface SettingsProps {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  showAI: boolean;
  setShowAI: (val: boolean) => void;
  onBack?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, setUser, onLogout, darkMode, setDarkMode, showAI, setShowAI, onBack }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address
      });
    }
    setShowEditProfile(false);
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="px-2 flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 p-3 bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Regresar</span>
          </button>
        )}
        <div>
          <h2 className="text-2xl font-black text-secondary dark:text-slate-100">Ajustes</h2>
          <p className="text-xs text-slate-400 font-medium">Configuración de tu cuenta y App</p>
        </div>
      </div>

      {/* Perfil Rápido */}
      <div className="bg-white dark:bg-darkCard p-8 rounded-5xl border border-white dark:border-slate-800 shadow-sm flex items-center gap-6 transition-colors">
        <div className="relative group">
          <img 
            src={user?.photoUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=200"} 
            className="w-20 h-20 rounded-4xl object-cover shadow-xl border-4 border-crema dark:border-slate-700" 
            alt="Profile" 
          />
          <button className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-800">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-black text-secondary dark:text-slate-200 leading-none">{user?.name || 'Usuario'}</h3>
          <p className="text-xs text-slate-400 font-bold mt-1">{user?.email}</p>
          <button 
            onClick={() => setShowEditProfile(true)}
            className="text-primary text-[10px] font-black uppercase tracking-widest mt-2 hover:underline"
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Modal Editar Perfil */}
      {showEditProfile && (
        <div className="fixed inset-0 z-[200] bg-secondary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-secondary dark:text-slate-100">Editar Perfil</h3>
                <button onClick={() => setShowEditProfile(false)} className="p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</span>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl border-none font-bold text-secondary dark:text-slate-200" 
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl border-none font-bold text-secondary dark:text-slate-200" 
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</span>
                  <input 
                    type="tel" 
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl border-none font-bold text-secondary dark:text-slate-200" 
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secciones de Ajustes */}
      <div className="space-y-4">
        <SettingGroup title="Preferencias">
          <SettingItem 
            icon={<Moon className="text-purple-500" />} 
            label="Modo Oscuro" 
            toggle={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
          <SettingItem 
            icon={<Sparkles className="text-amber-500" />} 
            label="IA Recommendations" 
            toggle={showAI}
            onToggle={() => setShowAI(!showAI)}
          />
          <SettingItem 
            icon={<Globe className="text-blue-500" />} 
            label="Idioma" 
            value="Español"
          />
        </SettingGroup>

        <SettingGroup title="Seguridad & Privacidad">
          <SettingItem icon={<Shield className="text-emerald-500" />} label="Contraseña" />
          <SettingItem icon={<Bell className="text-amber-500" />} label="Notificaciones" />
        </SettingGroup>

        <SettingGroup title="Soporte">
          <SettingItem icon={<HelpCircle className="text-slate-400" />} label="Centro de Ayuda" />
          <SettingItem 
            icon={<LogOut className="text-rose-500" />} 
            label="Salir" 
            noChevron 
            color="text-rose-500"
            onClick={onLogout}
          />
        </SettingGroup>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-[0.3em]">Pawell v1.0.6 - 2024</p>
      </div>
    </div>
  );
};

const SettingGroup = ({ title, children }: any) => (
  <div className="space-y-2">
    <h4 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest px-4">{title}</h4>
    <div className="bg-white dark:bg-darkCard rounded-5xl border border-white dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon, label, value, toggle, onToggle, onClick, noChevron, color = 'text-secondary dark:text-slate-200' }: any) => (
  <button 
    onClick={onClick || (onToggle ? onToggle : undefined)}
    className="w-full px-6 py-5 flex items-center justify-between hover:bg-crema/50 dark:hover:bg-slate-700/50 transition-all border-b border-slate-50 dark:border-slate-800 last:border-none group"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className={`text-sm font-black ${color}`}>{label}</span>
    </div>
    <div className="flex items-center gap-3">
      {value && <span className="text-xs font-bold text-slate-400">{value}</span>}
      {onToggle !== undefined && (
        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${toggle ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${toggle ? 'translate-x-4' : ''}`}></div>
        </div>
      )}
      {!noChevron && onToggle === undefined && <ChevronRight className="w-4 h-4 text-slate-200" />}
    </div>
  </button>
);
