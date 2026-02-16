
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HealthDashboard } from './components/HealthDashboard';
import { VetSearch } from './components/VetSearch';
import { SocialFeed } from './components/SocialFeed';
import { PetProfile } from './components/PetProfile';
import { RoleSelection } from './components/RoleSelection';
import { VetDashboard } from './components/VetDashboard';
import { VetInventory } from './components/VetInventory';
import { VetPatients } from './components/VetPatients';
import { VetAppointments } from './components/VetAppointments';
import { Settings } from './components/Settings';
import { Pet, AppRole } from './types';
import { Shield, ChevronRight, CheckCircle2, Scan, PhoneCall, ClipboardList, Utensils, Pill } from 'lucide-react';

const currentPet: Pet = {
  id: 'dog-1',
  name: 'Bruno',
  breed: 'Cocker Spaniel',
  age: 9,
  sex: 'Male',
  weight: 12.8,
  imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600',
  medicalHistorySummary: 'Bruno is a healthy adult Cocker Spaniel with occasional joint sensitivity. He is up to date with his checkups but is approaching his senior years.',
  vaccines: [
    { name: 'Rabia', date: '2023-12-01', nextDue: '2024-12-01' },
    { name: 'Sextuple', date: '2024-02-15', nextDue: '2025-02-15' }
  ],
  deworming: {
    internal: { last: '2024-03-01', next: '2024-06-01' },
    external: { last: '2024-04-10', next: '2024-05-10' }
  },
  currentMedications: ['Suplemento Omega-3', 'Joint Care Plus'],
  allergies: ['Ácaros del polvo', 'Ciertos cereales'],
  chronicConditions: ['Displasia de cadera (Grado 1)'],
  documents: [
    { id: '1', name: 'Analítica Anual', type: 'study', date: '2024-02-15', url: '#' }
  ]
};

const App: React.FC = () => {
  const [role, setRole] = useState<AppRole | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  if (!role) {
    return <RoleSelection onSelect={setRole} />;
  }

  const handleLogout = () => {
    setRole(null);
    setActiveTab('home');
  };

  const renderContent = () => {
    if (activeTab === 'settings') return <Settings />;

    const isVet = role === AppRole.VETERINARIAN;

    if (isVet) {
      switch (activeTab) {
        case 'home': return <VetDashboard />;
        case 'appointments': return <VetAppointments />;
        case 'patients': return <VetPatients />;
        case 'inventory': return <VetInventory />;
        default: return <VetDashboard />;
      }
    }

    // Contenido para Dueño (Owner)
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Perfil del Perro destacado */}
            <section className="relative bg-secondary p-10 rounded-5xl text-white overflow-hidden shadow-2xl">
              <div className="relative z-10 flex flex-col items-center text-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full scale-110"></div>
                  <img src={currentPet.imageUrl} className="w-32 h-32 rounded-full border-4 border-white relative z-10 object-cover shadow-2xl" alt={currentPet.name} />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-secondary flex items-center justify-center z-20 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black">{currentPet.name} está genial</h2>
                  <p className="text-white/60 text-sm font-medium mt-1">Todo bajo control por aquí.</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <div className="bg-white/10 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">Saludable</div>
                    <div className="bg-primary text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">9 Años</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-extrabold text-secondary">Próximas Misiones</h3>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-black uppercase">2 Pendientes</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                <PendingTaskCard icon={<Shield className="text-primary" />} title="Vacuna Rabia" date="en 12 días" type="Salud" />
                <PendingTaskCard icon={<Pill className="text-amber-500" />} title="Desparasitación" date="mañana" type="Control" />
                <PendingTaskCard icon={<ClipboardList className="text-blue-500" />} title="Chequeo Anual" date="en 1 mes" type="Médico" />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-extrabold text-secondary px-2">Atajos</h3>
              <div className="grid grid-cols-4 gap-3">
                <AtajoIcon icon={<Scan />} label="Receta" color="bg-rose-50 text-rose-500" />
                <AtajoIcon icon={<ClipboardList />} label="Historial" color="bg-blue-50 text-blue-500" />
                <AtajoIcon icon={<Utensils />} label="Dieta" color="bg-emerald-50 text-emerald-500" />
                <AtajoIcon icon={<PhoneCall />} label="Urgencia" color="bg-amber-50 text-amber-500" />
              </div>
            </section>

            <section className="space-y-6 pb-10">
               <div className="px-2 flex justify-between items-end">
                 <div>
                   <h3 className="text-xl font-extrabold text-secondary">Recomendaciones</h3>
                   <p className="text-slate-400 text-xs font-medium">Basado en Cocker Spaniel de 9 años</p>
                 </div>
                 <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                   Ver más <ChevronRight className="w-3 h-3" />
                 </button>
               </div>
               <HealthDashboard pet={currentPet} limit={2} />
            </section>
          </div>
        );
      case 'search': return <VetSearch />;
      case 'social': return <SocialFeed />;
      case 'health': return <PetProfile pet={currentPet} />;
      default: return <HealthDashboard pet={currentPet} />;
    }
  };

  return (
    <Layout 
      role={role} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

const PendingTaskCard = ({ icon, title, date, type }: any) => (
  <div className="bg-white min-w-[190px] p-6 rounded-4xl border border-white shadow-sm hover:shadow-xl transition-all cursor-pointer group shrink-0">
    <div className="flex justify-between items-start mb-4">
      <div className="w-11 h-11 bg-crema rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{type}</span>
    </div>
    <h4 className="font-extrabold text-secondary text-sm mb-1">{title}</h4>
    <p className="text-primary text-[11px] font-black">{date}</p>
  </div>
);

// Fixed type issue with React.cloneElement by specifying React.ReactElement<any>
const AtajoIcon = ({ icon, label, color }: any) => (
  <button className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-active:scale-95 transition-all`}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
    </div>
    <span className="text-[10px] font-black text-secondary uppercase tracking-tight">{label}</span>
  </button>
);

export default App;
