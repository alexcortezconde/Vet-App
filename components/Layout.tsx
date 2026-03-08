
import React, { useState } from 'react';
import { Home, Search, Heart, User, Bell, PlusCircle, Settings, Calendar, Users, Package, LogOut, X, MapPin, Bone, Activity, Stethoscope, ClipboardList } from 'lucide-react';
import { AppRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: AppRole;
  onLogout: () => void;
  showPlusMenu?: boolean;
  setShowPlusMenu?: (show: boolean) => void;
  toggleRole?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, onLogout, showPlusMenu: externalShowPlusMenu, setShowPlusMenu: externalSetShowPlusMenu, toggleRole }) => {
  const isVet = role === AppRole.VETERINARIAN;
  const [showNotifications, setShowNotifications] = useState(false);
  const [internalShowPlusMenu, setInternalShowPlusMenu] = useState(false);
  
  const showPlusMenu = externalShowPlusMenu !== undefined ? externalShowPlusMenu : internalShowPlusMenu;
  const setShowPlusMenu = externalSetShowPlusMenu || setInternalShowPlusMenu;

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-crema dark:bg-darkBg transition-colors">
      {/* Header PetCare */}
      <header className="sticky top-0 z-[60] bg-secondary dark:bg-slate-900 px-6 py-4 flex items-center justify-between rounded-b-5xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10 rotate-3">
            <Bone className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tighter leading-none">Pawell</h1>
            <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">
              {isVet ? 'Vet Pro Portal' : 'Care Hub'}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {toggleRole && (
            <button 
              onClick={toggleRole}
              className="text-[10px] font-bold bg-white/10 text-white px-2 py-1 rounded-lg mr-2"
            >
              Dev: {isVet ? 'Vet' : 'Owner'}
            </button>
          )}
          <button 
            onClick={() => setShowNotifications(true)}
            className="p-2.5 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-secondary dark:border-slate-900"></span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2.5 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Drawer lateral de Notificaciones */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${showNotifications ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-secondary/30 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-56 bg-white dark:bg-darkCard shadow-2xl transition-transform duration-500 ease-out transform ${showNotifications ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="p-8 space-y-8">
             <div className="flex justify-between items-center">
               <h4 className="font-black text-secondary dark:text-slate-100 text-lg uppercase tracking-widest">Notificaciones</h4>
               <button onClick={() => setShowNotifications(false)} className="p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400"><X className="w-5 h-5" /></button>
             </div>
             <div className="space-y-4">
               <NotificationItem icon={<Calendar className="text-primary" />} text="Cita con Dr. Soto mañana 9:00" time="Hace 1h" />
               <NotificationItem icon={<Activity className="text-blue-500" />} text="¡Bruno ha alcanzado su meta de peso!" time="Hace 3h" />
               <NotificationItem icon={<Bell className="text-amber-500" />} text="Recordatorio: Vacuna Rabia en 12 días" time="Ayer" />
             </div>
           </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-2xl mx-auto px-5 pt-6">
        {children}
      </main>

      {/* Nav PetCare */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-white/20 dark:border-slate-700 px-6 py-4 rounded-5xl z-50 shadow-xl shadow-secondary/5">
        <div className="max-w-2xl mx-auto flex items-center justify-between relative">
          {isVet ? (
            <>
              <NavItem icon={<Home />} label="Panel" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
              <NavItem icon={<Calendar />} label="Citas" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
              <PlusButton onClick={() => setShowPlusMenu(!showPlusMenu)} />
              <NavItem icon={<Users />} label="Pacientes" active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} />
              <NavItem icon={<Package />} label="Stock" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
            </>
          ) : (
            <>
              <NavItem icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
              <NavItem icon={<Search />} label="Busca Vet" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
              <PlusButton onClick={() => setShowPlusMenu(!showPlusMenu)} />
              <NavItem icon={<User />} label="Perfil" active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
              <NavItem icon={<Heart />} label="Social" active={activeTab === 'social'} onClick={() => setActiveTab('social')} />
            </>
          )}
        </div>
      </nav>

      {/* Menú Plus Acciones Rápidas */}
      {showPlusMenu && (
        <div className="fixed inset-0 z-[100] bg-secondary/20 backdrop-blur-sm animate-in fade-in duration-300 flex items-center justify-center p-6" onClick={() => setShowPlusMenu(false)}>
           <div className="bg-white dark:bg-darkCard rounded-5xl p-8 w-full max-w-xs grid grid-cols-3 gap-4 shadow-2xl" onClick={e => e.stopPropagation()}>
             <PlusAction 
               icon={<ClipboardList />} 
               label="Misión" 
               color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" 
               onClick={() => { setShowPlusMenu(false); }} 
             />
             <PlusAction 
               icon={<Calendar />} 
               label="Cita" 
               color="bg-blue-50 dark:bg-blue-900/20 text-blue-500" 
               onClick={() => { setActiveTab('search'); setShowPlusMenu(false); }} 
             />
             <PlusAction 
               icon={<User />} 
               label="Perfil" 
               color="bg-rose-50 dark:bg-rose-900/20 text-rose-500" 
               onClick={() => { setActiveTab('health'); setShowPlusMenu(false); }} 
             />
             <button onClick={() => setShowPlusMenu(false)} className="col-span-3 mt-2 py-4 bg-crema dark:bg-slate-700 rounded-3xl font-black text-secondary dark:text-slate-200 uppercase tracking-widest text-[10px]">Cancelar</button>
           </div>
        </div>
      )}
    </div>
  );
};

const NotificationItem = ({ icon, text, time }: any) => (
  <div className="flex gap-4 p-4 hover:bg-crema dark:hover:bg-slate-700/50 rounded-3xl transition-all cursor-pointer border border-transparent hover:border-white/50">
    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
    </div>
    <div className="flex-1">
      <p className="text-xs font-bold text-secondary dark:text-slate-200 leading-tight">{text}</p>
      <span className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase mt-1 block">{time}</span>
    </div>
  </div>
);

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-primary scale-110' : 'text-secondary/30 dark:text-slate-500 hover:text-secondary/50 dark:hover:text-slate-300'}`}>
    {React.cloneElement(icon, { className: `w-6 h-6 ${active ? 'fill-primary/20' : ''}` })}
    <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
  </button>
);

const PlusButton = ({ onClick }: any) => (
  <div className="relative -mt-16 group">
    <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-300"></div>
    <button onClick={onClick} className="relative bg-primary text-white p-5 rounded-full shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
      <PlusCircle className="w-7 h-7" />
    </button>
  </div>
);

const PlusAction = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 group">
    <div className={`w-16 h-16 ${color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
      {React.cloneElement(icon, { className: 'w-7 h-7' })}
    </div>
    <span className="text-[10px] font-black text-secondary dark:text-slate-400 uppercase tracking-widest">{label}</span>
  </button>
);
