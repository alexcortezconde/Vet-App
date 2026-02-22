
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
import { Auth } from './components/Auth';
import { Pet, AppRole, User, Appointment } from './types';
import { 
  Shield, ChevronRight, CheckCircle2, Scan, PhoneCall, ClipboardList, 
  Utensils, Pill, History, MapPin, Phone, Plus, Calendar, AlertCircle, 
  X, Camera, MessageSquare, Image as ImageIcon, Settings2, Trash2, ArrowUp, ArrowDown,
  User as UserIcon
} from 'lucide-react';

const initialPets: Pet[] = [
  {
    id: 'dog-1',
    name: 'Odi',
    breed: 'Cocker Spaniel',
    age: 9,
    sex: 'Male',
    weight: 12.8,
    imageUrl: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?auto=format&fit=crop&q=80&w=800',
    medicalHistorySummary: 'Odi is a healthy adult Cocker Spaniel with occasional joint sensitivity.',
    vaccines: [
      { name: 'Rabia', date: '2025-12-01', nextDue: '2026-12-01' },
      { name: 'Sextuple', date: '2026-02-15', nextDue: '2027-02-15' }
    ],
    deworming: {
      internal: { last: '2026-01-01', next: '2026-04-01' },
      external: { last: '2026-01-10', next: '2026-04-10' }
    },
    currentMedications: ['Suplemento Omega-3', 'Joint Care Plus'],
    allergies: ['Ácaros del polvo', 'Ciertos cereales'],
    chronicConditions: ['Displasia de cadera (Grado 1)'],
    documents: [
      { id: 'rec-1', name: 'Tratamiento Otitis', type: 'prescription', date: '12/05/2024', url: '#' },
      { id: '1', name: 'Analítica Anual', type: 'study', date: '15/02/2024', url: '#' }
    ]
  },
  {
    id: 'cat-1',
    name: 'Michi',
    breed: 'Gato Doméstico',
    age: 3,
    sex: 'Female',
    weight: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    medicalHistorySummary: 'Michi necesita atención inmediata para sus vacunas.',
    vaccines: [
      { name: 'Rabia', date: '2022-10-01', nextDue: '2023-10-01' }, // VENCIDA
      { name: 'Triple Felina', date: '2024-01-10', nextDue: '2025-01-10' }
    ],
    deworming: {
      internal: { last: '2024-01-01', next: '2024-04-01' },
      external: { last: '2024-02-10', next: '2024-03-10' }
    },
    currentMedications: [],
    allergies: [],
    chronicConditions: [],
    documents: []
  },
  {
    id: 'turtle-1',
    name: 'Tortu',
    breed: 'Tortuga de Tierra',
    age: 15,
    sex: 'Other',
    weight: 2.5,
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800',
    medicalHistorySummary: 'Tortu está en estado preventivo, requiere chequeo de caparazón.',
    vaccines: [],
    deworming: {
      internal: { last: '2023-11-01', next: '2024-05-01' },
      external: { last: '2023-11-01', next: '2024-05-01' }
    },
    currentMedications: [],
    allergies: [],
    chronicConditions: [],
    documents: []
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [profileSubTab, setProfileSubTab] = useState<'info' | 'medical' | 'docs' | 'appointments'>('info');
  const [darkMode, setDarkMode] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [selectedPetId, setSelectedPetId] = useState(initialPets[0].id);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showEditPetModal, setShowEditPetModal] = useState(false);
  const [showManagePetsModal, setShowManagePetsModal] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const currentPet = pets.find(p => p.id === selectedPetId) || pets[0];

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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = (email: string, selectedRole: AppRole) => {
    setUser({
      id: 'user-1',
      name: email.split('@')[0],
      email: email,
      role: selectedRole
    });
    setRole(selectedRole);
  };

  const handleDeletePet = (id: string) => {
    if (pets.length <= 1) {
      setNotification("Debes tener al menos una mascota");
      return;
    }
    const newPets = pets.filter(p => p.id !== id);
    setPets(newPets);
    if (selectedPetId === id) {
      setSelectedPetId(newPets[0].id);
    }
    setNotification("Mascota eliminada correctamente");
  };

  const handleMovePet = (index: number, direction: 'up' | 'down') => {
    const newPets = [...pets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pets.length) return;
    
    const temp = newPets[index];
    newPets[index] = newPets[targetIndex];
    newPets[targetIndex] = temp;
    setPets(newPets);
  };

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const breed = (form.elements.namedItem('breed') as HTMLInputElement).value;
    const age = parseInt((form.elements.namedItem('age') as HTMLInputElement).value);
    
    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name,
      breed,
      age,
      weight: 5,
      sex: 'Male',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
      medicalHistorySummary: 'Nuevo perfil creado.',
      deworming: {
        internal: { last: 'N/A', next: 'Pendiente' },
        external: { last: 'N/A', next: 'Pendiente' }
      },
      currentMedications: [],
      allergies: [],
      chronicConditions: [],
      vaccines: [],
      documents: []
    };
    
    setPets([...pets, newPet]);
    setShowAddPetModal(false);
    setNotification(`${name} se ha unido a la familia! 🐾`);
  };

  const handleEditPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petToEdit) return;
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const breed = (form.elements.namedItem('breed') as HTMLInputElement).value;
    const age = parseInt((form.elements.namedItem('age') as HTMLInputElement).value);

    const updatedPets = pets.map(p => p.id === petToEdit.id ? { ...p, name, breed, age } : p);
    setPets(updatedPets);
    setShowEditPetModal(false);
    setPetToEdit(null);
    setNotification("Perfil actualizado correctamente");
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    setActiveTab('home');
  };

  const addAppointment = (newApp: Appointment) => {
    setAppointments([...appointments, newApp]);
    setNotification('Se ha creado la cita correctamente');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (!role) {
    return <RoleSelection onSelect={setRole} />;
  }

  const renderContent = () => {
    if (activeTab === 'settings') return (
      <Settings 
        user={user}
        setUser={setUser}
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
        const isVaccineOverdue = currentPet.vaccines.some(v => new Date(v.nextDue) < new Date());
        const statusColor = isVaccineOverdue ? 'bg-rose-500' : currentPet.id === 'turtle-1' ? 'bg-amber-500' : 'bg-emerald-500';
        const statusText = isVaccineOverdue ? `${currentPet.name} necesita atención 🔴` : `${currentPet.name} está genial 🟢`;

        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Pet Selector */}
            <section className="px-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-secondary dark:text-white">Mis Mascotas</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowManagePetsModal(true)}
                    className="p-2 bg-secondary/5 text-secondary dark:text-slate-400 rounded-xl hover:bg-secondary hover:text-white transition-all"
                    title="Administrar Perfiles"
                  >
                    <Settings2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowAddPetModal(true)}
                    className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                    title="Agregar Mascota"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2 -mx-2">
                {pets.map(pet => (
                  <button 
                    key={pet.id}
                    onClick={() => setSelectedPetId(pet.id)}
                    className={`flex flex-col items-center gap-2 shrink-0 transition-all ${selectedPetId === pet.id ? 'scale-110' : 'opacity-50 grayscale'}`}
                  >
                    <div className={`w-16 h-16 rounded-full border-2 p-1 ${selectedPetId === pet.id ? 'border-primary' : 'border-transparent'}`}>
                      <img src={pet.imageUrl} className="w-full h-full object-cover rounded-full" alt={pet.name} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary dark:text-slate-400">{pet.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className={`relative ${statusColor} p-7 rounded-5xl text-white overflow-hidden shadow-xl transition-colors duration-500`}>
              <div className="relative z-10 flex flex-col items-center text-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-110"></div>
                  <img src={currentPet.imageUrl} className="w-28 h-28 rounded-full border-4 border-white relative z-10 object-cover shadow-2xl" alt={currentPet.name} />
                  <div className={`absolute -bottom-2 -right-2 ${statusColor} w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-20 shadow-lg`}>
                    {isVaccineOverdue ? <AlertCircle className="w-4 h-4 text-white" /> : <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black">{statusText}</h2>
                  <p className="text-white/80 text-xs font-medium mt-1">
                    {isVaccineOverdue ? 'Tiene vacunas pendientes de aplicación.' : 'Todo bajo control por aquí.'}
                  </p>
                  <div className="flex justify-center gap-3 mt-4">
                    <div className="bg-white/20 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      {isVaccineOverdue ? 'Atención Requerida' : 'Saludable'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              {isVaccineOverdue && (
                <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                  Alerta Médica
                </div>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100">Próximas Misiones</h3>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {currentPet.vaccines.length > 0 ? (isVaccineOverdue ? '3 Pendientes' : '2 Pendientes') : '0 Pendientes'}
                </span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                {currentPet.vaccines.length > 0 ? (
                  <>
                    {isVaccineOverdue && (
                      <PendingTaskCard 
                        icon={<AlertCircle className="text-rose-500" />} 
                        title="Vacuna Rabia" 
                        date="VENCIDA" 
                        type="Urgente" 
                        onClick={() => setSelectedMission({ title: 'Vacuna Rabia', message: `${currentPet.name} necesita su vacuna de Rabia lo antes posible. Estaba programada para el año pasado.` })}
                      />
                    )}
                    <PendingTaskCard 
                      icon={<Shield className="text-primary" />} 
                      title="Vacuna Sextuple" 
                      date="en 12 días" 
                      type="Salud" 
                      onClick={() => setSelectedMission({ title: 'Vacuna Sextuple', message: `${currentPet.name} necesita agendar una cita para el 4 de marzo.` })}
                    />
                    <PendingTaskCard 
                      icon={<Pill className="text-amber-500" />} 
                      title="Desparasitación" 
                      date="en 30 días" 
                      type="Control" 
                      onClick={() => setSelectedMission({ title: 'Desparasitación', message: `Toca desparasitación interna para ${currentPet.name} el próximo mes.` })}
                    />
                    <PendingTaskCard 
                      icon={<Utensils className="text-emerald-500" />} 
                      title="Baño y Peluquería" 
                      date="en 5 días" 
                      type="Higiene" 
                      onClick={() => setSelectedMission({ title: 'Baño y Peluquería', message: `¡Hora de ponerse guapo! Cita en la peluquería el viernes.` })}
                    />
                  </>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-10 bg-white/50 dark:bg-darkCard/50 rounded-4xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-400 text-xs font-bold mb-4">No hay misiones para {currentPet.name}</p>
                    <button 
                      onClick={() => setShowFABMenu(true)}
                      className="bg-primary text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                      Agregar Misión
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100 px-2">Atajos</h3>
              <div className="grid grid-cols-4 gap-3">
                <AtajoIcon 
                  icon={<Calendar />} 
                  label="Citas" 
                  color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500" 
                  onClick={() => { setActiveTab('health'); setProfileSubTab('appointments'); }} 
                />
                <AtajoIcon 
                  icon={<Scan />} 
                  label="Vacunas" 
                  color="bg-rose-50 dark:bg-rose-900/20 text-rose-500" 
                  onClick={() => { setActiveTab('health'); setProfileSubTab('medical'); }} 
                />
                <AtajoIcon icon={<Utensils />} label="Dieta" color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" onClick={() => setActiveTab('dieta')} />
                <AtajoIcon icon={<PhoneCall />} label="Urgencia" color="bg-amber-50 dark:bg-amber-900/20 text-amber-500" onClick={() => setActiveTab('urgencia')} />
                <AtajoIcon 
                  icon={<Plus />} 
                  label="Nuevo" 
                  color="bg-slate-100 dark:bg-slate-800 text-slate-400" 
                  onClick={() => setShowFABMenu(true)} 
                />
              </div>
            </section>

            {showAI && (
              <section className="space-y-6 pb-20">
                 <div className="px-2 flex justify-between items-end">
                   <div>
                     <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100">IA Recommendations</h3>
                     <p className="text-slate-400 text-xs font-medium">Basado en {currentPet.breed} de {currentPet.age} años</p>
                   </div>
                   <button 
                    onClick={() => setActiveTab('health')}
                    className="text-primary font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-1"
                   >
                     Ver más <ChevronRight className="w-3 h-3" />
                   </button>
                 </div>
                 <HealthDashboard pet={currentPet} limit={2} />
              </section>
            )}
          </div>
        );
      case 'search': return <VetSearch onAddAppointment={addAppointment} />;
      case 'social': return <SocialFeed />;
      case 'health':
        const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0];
        return (
          <PetProfile 
            pet={selectedPet} 
            activeTab={profileSubTab} 
            setActiveTab={setProfileSubTab} 
            appointments={appointments}
            onSwitchPet={(id) => setSelectedPetId(id)}
            onAddAppointment={() => setActiveTab('search')}
            onEditPet={(p) => { setPetToEdit(p); setShowEditPetModal(true); }}
            pets={pets}
          />
        );
      default: return <HealthDashboard pet={currentPet} />;
    }
  };

  return (
    <Layout role={role} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {renderContent()}

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-50">
        {showFABMenu && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <FABMenuItem icon={<Calendar />} label="Cita" onClick={() => { setActiveTab('search'); setShowFABMenu(false); }} />
            <FABMenuItem icon={<ClipboardList />} label="Mision" onClick={() => setShowFABMenu(false)} />
            <FABMenuItem icon={<UserIcon />} label="Perfil" onClick={() => { setActiveTab('health'); setShowFABMenu(false); }} />
          </div>
        )}
        <button 
          onClick={() => setShowFABMenu(!showFABMenu)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${showFABMenu ? 'bg-secondary rotate-45' : 'bg-primary shadow-primary/40'}`}
        >
          <Plus className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-sm animate-in slide-in-from-top-4 duration-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          {notification}
        </div>
      )}

      {/* Mission Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-sm p-8 rounded-5xl shadow-2xl border border-white dark:border-slate-800 relative">
            <button onClick={() => setSelectedMission(null)} className="absolute top-6 right-6 text-slate-300 hover:text-secondary transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-secondary dark:text-white mb-2">{selectedMission.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">{selectedMission.message}</p>
            <button 
              onClick={() => setSelectedMission(null)}
              className="w-full bg-secondary dark:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Add Pet Modal */}
      {showAddPetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-sm p-8 rounded-5xl shadow-2xl border border-white dark:border-slate-800 relative">
            <button onClick={() => setShowAddPetModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-secondary transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-secondary dark:text-white mb-6">Nueva Mascota</h3>
            <form onSubmit={handleAddPet} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre</label>
                <input name="name" required className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl border-none font-bold text-secondary dark:text-white" placeholder="Ej. Max" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Raza</label>
                <input name="breed" required className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl border-none font-bold text-secondary dark:text-white" placeholder="Ej. Golden Retriever" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Edad</label>
                <input name="age" type="number" required className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl border-none font-bold text-secondary dark:text-white" placeholder="Ej. 2" />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                Agregar Mascota
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Manage Pets Modal */}
      {showManagePetsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-md p-8 rounded-5xl shadow-2xl border border-white dark:border-slate-800 relative">
            <button onClick={() => setShowManagePetsModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-secondary transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-secondary dark:text-white mb-6">Administrar Perfiles</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
              {pets.map((pet, index) => (
                <div key={pet.id} className="flex items-center justify-between bg-crema dark:bg-slate-800 p-4 rounded-3xl group">
                  <div className="flex items-center gap-4">
                    <img src={pet.imageUrl} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700" alt={pet.name} />
                    <div>
                      <h4 className="font-black text-secondary dark:text-white text-sm">{pet.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{pet.breed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setPetToEdit(pet); setShowEditPetModal(true); }}
                      className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col gap-1">
                      <button 
                        disabled={index === 0}
                        onClick={() => handleMovePet(index, 'up')}
                        className="p-1.5 bg-white dark:bg-darkCard rounded-lg text-slate-400 hover:text-primary disabled:opacity-20 transition-colors"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button 
                        disabled={index === pets.length - 1}
                        onClick={() => handleMovePet(index, 'down')}
                        className="p-1.5 bg-white dark:bg-darkCard rounded-lg text-slate-400 hover:text-primary disabled:opacity-20 transition-colors"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleDeletePet(pet.id)}
                      className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => { setShowManagePetsModal(false); setShowAddPetModal(true); }}
              className="w-full bg-primary/10 text-primary font-black py-4 rounded-2xl mt-6 hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Agregar Otra Mascota
            </button>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {showEditPetModal && petToEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-sm p-8 rounded-5xl shadow-2xl border border-white dark:border-slate-800 relative">
            <button onClick={() => { setShowEditPetModal(false); setPetToEdit(null); }} className="absolute top-6 right-6 text-slate-300 hover:text-secondary transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-secondary dark:text-white mb-6">Editar Perfil</h3>
            <form onSubmit={handleEditPet} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre</label>
                <input name="name" defaultValue={petToEdit.name} required className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl border-none font-bold text-secondary dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Raza</label>
                <input name="breed" defaultValue={petToEdit.breed} required className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl border-none font-bold text-secondary dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Edad</label>
                <input name="age" type="number" defaultValue={petToEdit.age} required className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl border-none font-bold text-secondary dark:text-white" />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

const FABMenuItem = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 bg-white dark:bg-darkCard px-4 py-3 rounded-2xl shadow-xl border border-crema dark:border-slate-800 hover:scale-105 transition-all group"
  >
    <span className="text-[10px] font-black uppercase tracking-widest text-secondary dark:text-slate-400 group-hover:text-primary">{label}</span>
    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
    </div>
  </button>
);

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

const PendingTaskCard = ({ icon, title, date, type, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-darkCard min-w-[190px] p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group shrink-0"
  >
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
