
import React, { useState, useEffect } from 'react';
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
import { Shield, ChevronRight, CheckCircle2, Scan, PhoneCall, ClipboardList, Utensils, Pill, History, MapPin, Phone } from 'lucide-react';

const currentPet: Pet = {
  id: 'dog-1',
  name: 'Bruno',
  breed: 'Cocker Spaniel',
  age: 9,
  sex: 'Male',
  weight: 12.8,
  // Nueva imagen de Cocker Spaniel
  imageUrl: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?auto=format&fit=crop&q=80&w=800',
  medicalHistorySummary: 'Bruno is a healthy adult Cocker Spaniel with occasional joint sensitivity.',
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
    { id: 'rec-1', name: 'Tratamiento Otitis', type: 'prescription', date: '12/05/2024', url: '#' },
    { id: '1', name: 'Analítica Anual', type: 'study', date: '15/02/2024', url: '#' }
  ]
};

const App: React.FC = () => {
  const [role, setRole] = useState<AppRole | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [profileSubTab, setProfileSubTab] = useState<'info' | 'medical' | 'docs'>('info');
  const [darkMode, setDarkMode] = useState(false);
  const [showAI, setShowAI] = useState(true);

  // Scroll reset y Dark Mode toggle
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!role) {
    return <RoleSelection onSelect={setRole} />;
  }

  const handleLogout = () => {
    setRole(null);
    setActiveTab('home');
  };

  const renderContent = () => {
    if (activeTab === 'settings') return (
      <Settings 
        onLogout={handleLogout} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        showAI={showAI} 
        setShowAI={setShowAI}
      />
    );
    if (activeTab === 'historial') return <MedicalHistoryView onBack={() => setActiveTab('home')} />;
    if (activeTab === 'dieta') return <DietPlanView onBack={() => setActiveTab('home')} />;
    if (activeTab === 'urgencia') return <EmergencyView onBack={() => setActiveTab('home')} />;

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

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="relative bg-secondary p-10 rounded-5xl text-white overflow-hidden shadow-xl">
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
                <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100">Próximas Misiones</h3>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-black uppercase">2 Pendientes</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                <PendingTaskCard icon={<Shield className="text-primary" />} title="Vacuna Rabia" date="en 12 días" type="Salud" />
                <PendingTaskCard icon={<Pill className="text-amber-500" />} title="Desparasitación" date="mañana" type="Control" />
                <PendingTaskCard icon={<ClipboardList className="text-blue-500" />} title="Chequeo Anual" date="en 1 mes" type="Médico" />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100 px-2">Atajos</h3>
              <div className="grid grid-cols-4 gap-3">
                <AtajoIcon 
                  icon={<Scan />} 
                  label="Receta" 
                  color="bg-rose-50 dark:bg-rose-900/20 text-rose-500" 
                  onClick={() => { setActiveTab('health'); setProfileSubTab('docs'); }} 
                />
                <AtajoIcon icon={<ClipboardList />} label="Historial" color="bg-blue-50 dark:bg-blue-900/20 text-blue-500" onClick={() => setActiveTab('historial')} />
                <AtajoIcon icon={<Utensils />} label="Dieta" color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" onClick={() => setActiveTab('dieta')} />
                <AtajoIcon icon={<PhoneCall />} label="Urgencia" color="bg-amber-50 dark:bg-amber-900/20 text-amber-500" onClick={() => setActiveTab('urgencia')} />
              </div>
            </section>

            {showAI && (
              <section className="space-y-6 pb-10">
                 <div className="px-2 flex justify-between items-end">
                   <div>
                     <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100">IA Recommendations</h3>
                     <p className="text-slate-400 text-xs font-medium">Basado en Cocker Spaniel de 9 años</p>
                   </div>
                   <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                     Ver más <ChevronRight className="w-3 h-3" />
                   </button>
                 </div>
                 <HealthDashboard pet={currentPet} limit={2} />
              </section>
            )}
          </div>
        );
      case 'search': return <VetSearch />;
      case 'social': return <SocialFeed />;
      case 'health': return <PetProfile pet={currentPet} activeTab={profileSubTab} setActiveTab={setProfileSubTab} />;
      default: return <HealthDashboard pet={currentPet} />;
    }
  };

  return (
    <Layout role={role} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

const MedicalHistoryView = ({ onBack }: any) => (
  <div className="space-y-6 pb-10 animate-in fade-in duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-4">
      <ChevronRight className="w-4 h-4 rotate-180" /> Volver
    </button>
    <h2 className="text-2xl font-black text-secondary dark:text-slate-100 px-2">Historial de Consultas</h2>
    <div className="space-y-4">
      <HistoryItem date="15 Abr 2024" doctor="Dr. Soto" reason="Control Anual" status="Completada" />
      <HistoryItem date="02 Feb 2024" doctor="Dra. Lucía" reason="Alergia Cutánea" status="Completada" />
      <HistoryItem date="12 Dic 2023" doctor="Dr. Méndez" reason="Vacuna Rabia" status="Completada" />
    </div>
  </div>
);

const HistoryItem = ({ date, doctor, reason, status }: any) => (
  <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm flex justify-between items-center group cursor-pointer hover:shadow-md transition-all">
    <div className="flex gap-4 items-center">
      <div className="w-12 h-12 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary"><History className="w-6 h-6" /></div>
      <div>
        <h4 className="font-black text-secondary dark:text-slate-200 text-sm">{reason}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doctor} • {date}</p>
      </div>
    </div>
    <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-xl">{status}</span>
  </div>
);

const DietPlanView = ({ onBack }: any) => (
  <div className="space-y-6 pb-10 animate-in fade-in duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-4">
      <ChevronRight className="w-4 h-4 rotate-180" /> Volver
    </button>
    <div className="bg-emerald-500 p-8 rounded-5xl text-white shadow-lg">
       <h2 className="text-3xl font-black">Plan de Dieta</h2>
       <p className="text-white/60 text-xs font-medium mt-1">Recomendado para Cocker Spaniel Senior</p>
    </div>
    <div className="space-y-4">
      <DietCard time="Mañana (08:00)" portion="120g" type="Pienso Senior Articulaciones" />
      <DietCard time="Tarde (14:00)" portion="Snack" type="Manzana o Zanahoria" />
      <DietCard time="Noche (20:00)" portion="120g" type="Pienso Senior Articulaciones" />
    </div>
  </div>
);

const DietCard = ({ time, portion, type }: any) => (
  <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm flex gap-5 items-center">
    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-3xl flex items-center justify-center shadow-inner"><Utensils className="w-6 h-6" /></div>
    <div>
      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{time}</span>
      <h4 className="font-black text-secondary dark:text-slate-200 text-base">{type}</h4>
      <p className="text-xs text-slate-400 font-medium">{portion}</p>
    </div>
  </div>
);

const EmergencyView = ({ onBack }: any) => (
  <div className="space-y-6 pb-10 animate-in fade-in duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-4">
      <ChevronRight className="w-4 h-4 rotate-180" /> Volver
    </button>
    <div className="bg-rose-500 p-8 rounded-5xl text-white shadow-lg">
       <h2 className="text-3xl font-black">Emergencias 24h</h2>
       <p className="text-white/60 text-xs font-medium mt-1">Contacto inmediato con clínicas cercanas</p>
    </div>
    <div className="space-y-4">
      <EmergencyItem name="Hospital Vet Sur" address="Calle Falsa 123" phone="+54 11 4930-XXXX" />
      <EmergencyItem name="Clínica San Roque" address="Av. Libertador 4500" phone="+54 11 2284-XXXX" />
    </div>
  </div>
);

const EmergencyItem = ({ name, address, phone }: any) => (
  <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm flex justify-between items-center group">
    <div className="flex-1">
      <h4 className="font-black text-secondary dark:text-slate-200 text-base">{name}</h4>
      <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
        <MapPin className="w-3 h-3" /> {address}
      </div>
    </div>
    <a href={`tel:${phone}`} className="p-4 bg-rose-50 dark:bg-rose-900/40 text-rose-500 rounded-3xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
      <Phone className="w-6 h-6" />
    </a>
  </div>
);

const PendingTaskCard = ({ icon, title, date, type }: any) => (
  <div className="bg-white dark:bg-darkCard min-w-[190px] p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group shrink-0">
    <div className="flex justify-between items-start mb-4">
      <div className="w-11 h-11 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <span className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">{type}</span>
    </div>
    <h4 className="font-extrabold text-secondary dark:text-slate-200 text-sm mb-1">{title}</h4>
    <p className="text-primary text-[11px] font-black">{date}</p>
  </div>
);

const AtajoIcon = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-active:scale-95 transition-all`}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
    </div>
    <span className="text-[10px] font-black text-secondary dark:text-slate-400 uppercase tracking-tight">{label}</span>
  </button>
);

export default App;
