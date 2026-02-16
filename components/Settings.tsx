
import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  Bell, 
  Shield, 
  Moon, 
  HelpCircle, 
  ChevronRight,
  LogOut,
  Camera
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [language, setLanguage] = useState('Español');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="px-2">
        <h2 className="text-2xl font-black text-secondary">Ajustes</h2>
        <p className="text-xs text-slate-400 font-medium">Configuración de tu cuenta y App</p>
      </div>

      {/* Perfil Rápido */}
      <div className="bg-white p-8 rounded-5xl border border-white shadow-sm flex items-center gap-6">
        <div className="relative group">
          <img 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=200" 
            className="w-20 h-20 rounded-4xl object-cover shadow-xl border-4 border-crema" 
            alt="Profile" 
          />
          <button className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-black text-secondary leading-none">Dr. Alejandro</h3>
          <p className="text-xs text-slate-400 font-bold mt-1">ID: 4920-X82</p>
          <button className="text-primary text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">Editar Perfil</button>
        </div>
      </div>

      {/* Secciones de Ajustes */}
      <div className="space-y-4">
        <SettingGroup title="Preferencias">
          <SettingItem 
            icon={<Globe className="text-blue-500" />} 
            label="Idioma" 
            value={language}
            onClick={() => setLanguage(language === 'Español' ? 'English' : 'Español')}
          />
          <SettingItem 
            icon={<Moon className="text-purple-500" />} 
            label="Modo Oscuro" 
            toggle={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
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
            label="Cerrar Sesión" 
            noChevron 
            color="text-rose-500"
          />
        </SettingGroup>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">VetLink v1.0.4 - 2024</p>
      </div>
    </div>
  );
};

const SettingGroup = ({ title, children }: any) => (
  <div className="space-y-2">
    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4">{title}</h4>
    <div className="bg-white rounded-5xl border border-white shadow-sm overflow-hidden">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon, label, value, toggle, onToggle, onClick, noChevron, color = 'text-secondary' }: any) => (
  <button 
    onClick={onClick || (onToggle ? onToggle : undefined)}
    className="w-full px-6 py-5 flex items-center justify-between hover:bg-crema/50 transition-all border-b border-slate-50 last:border-none group"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className={`text-sm font-black ${color}`}>{label}</span>
    </div>
    <div className="flex items-center gap-3">
      {value && <span className="text-xs font-bold text-slate-400">{value}</span>}
      {onToggle !== undefined && (
        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${toggle ? 'bg-primary' : 'bg-slate-200'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${toggle ? 'translate-x-4' : ''}`}></div>
        </div>
      )}
      {!noChevron && onToggle === undefined && <ChevronRight className="w-4 h-4 text-slate-200" />}
    </div>
  </button>
);
