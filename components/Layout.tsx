
import React from 'react';
import { Home, Search, Heart, User, Bell, PlusCircle, Settings, Calendar, Users, Package, LogOut } from 'lucide-react';
import { AppRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: AppRole;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, onLogout }) => {
  const isVet = role === AppRole.VETERINARIAN;

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Header Optimizado */}
      <header className="sticky top-0 z-50 bg-secondary px-6 py-4 flex items-center justify-between rounded-b-5xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tighter leading-none">vetlink</h1>
            <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">
              {isVet ? 'Vet Pro Portal' : 'Care Hub'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-secondary"></span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2.5 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={onLogout} className="p-2.5 bg-white/5 rounded-2xl text-rose-400 hover:bg-white/10 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-5 pt-6">
        {children}
      </main>

      {/* Nav Dinámica por Rol */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/95 backdrop-blur-2xl border border-white/20 px-6 py-4 rounded-5xl z-50 shadow-2xl shadow-secondary/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between relative">
          {isVet ? (
            <>
              <NavItem icon={<Home />} label="Panel" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
              <NavItem icon={<Calendar />} label="Citas" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
              <div className="relative -mt-16 group">
                <div className="absolute -inset-2 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition-all duration-300"></div>
                <button title="Añadir Cita" className="relative bg-primary text-white p-5 rounded-full shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all">
                  <PlusCircle className="w-7 h-7" />
                </button>
              </div>
              <NavItem icon={<Users />} label="Pacientes" active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} />
              <NavItem icon={<Package />} label="Stock" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
            </>
          ) : (
            <>
              <NavItem icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
              <NavItem icon={<Search />} label="Busca Vet" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
              <div className="relative -mt-16 group">
                <div className="absolute -inset-2 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition-all duration-300"></div>
                <button title="Acción Rápida" className="relative bg-primary text-white p-5 rounded-full shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all">
                  <PlusCircle className="w-7 h-7" />
                </button>
              </div>
              <NavItem icon={<User />} label="Perfil" active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
              <NavItem icon={<Heart />} label="Social" active={activeTab === 'social'} onClick={() => setActiveTab('social')} />
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-primary scale-110' : 'text-secondary/30 hover:text-secondary/50'}`}>
    {React.cloneElement(icon, { className: `w-6 h-6 ${active ? 'fill-primary/20' : ''}` })}
    <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
  </button>
);
