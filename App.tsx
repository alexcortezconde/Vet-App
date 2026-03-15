
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Layout } from './components/Layout';
import { VetSearch } from './components/VetSearch';
import { SocialFeed } from './components/SocialFeed';
import { PetProfile } from './components/PetProfile';
import { RoleSelection } from './components/RoleSelection';
import { VetDashboard } from './components/VetDashboard';
import { VetInventory } from './components/VetInventory';
import { VetPatients } from './components/VetPatients';
import { VetAppointments } from './components/VetAppointments';
import { VetFinancials } from './components/VetFinancials';
import { Settings } from './components/Settings';
import { Auth } from './components/Auth';
import { Pet, AppRole, User, Appointment } from './types';
import {
  Shield, ChevronRight, CheckCircle2, Scan, PhoneCall, ClipboardList,
  Utensils, Pill, History, MapPin, Phone, Plus, Calendar, AlertCircle,
  X, Camera, MessageSquare, Image as ImageIcon, Settings2, Trash2, ArrowUp, ArrowDown,
  User as UserIcon, Heart, Syringe
} from 'lucide-react';

const initialPets: Pet[] = [
  {
    id: 'dog-1',
    name: 'Odi',
    breed: 'Cocker Spaniel',
    age: 9,
    sex: 'Male',
    weight: 12.8,
    imageUrl: 'https://images.unsplash.com/photo-1641221510945-e6bc5dc7f5d0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    imageUrl: 'https://plus.unsplash.com/premium_photo-1724311824020-d5aa35632c81?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [selectedPetId, setSelectedPetId] = useState(initialPets[0].id);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showEditPetModal, setShowEditPetModal] = useState(false);
  const [showManagePetsModal, setShowManagePetsModal] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lastMainTab, setLastMainTab] = useState('home');
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);

  const currentPet = pets.find(p => p.id === selectedPetId) || pets[0];

  const derivedMissions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const missions: Array<{ id: string; type: 'vaccine' | 'appointment'; title: string; description: string; date: string; typeLabel: string; petName: string; daysUntil: number }> = [];

    // Handles both YYYY-MM-DD (initial data) and DD/MM/YYYY (CalendarPicker output)
    const parseDate = (s: string) => {
      if (s.includes('/')) {
        const [d, m, y] = s.split('/').map(Number);
        const dt = new Date(y, m - 1, d);
        dt.setHours(0, 0, 0, 0);
        return dt;
      }
      const dt = new Date(s);
      dt.setHours(0, 0, 0, 0);
      return dt;
    };

    currentPet.vaccines.forEach(v => {
      const dueDate = parseDate(v.nextDue);
      const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      missions.push({
        id: `vaccine-${currentPet.id}-${v.name}`,
        type: 'vaccine',
        title: v.name,
        description: `La próxima dosis de ${v.name} ${daysUntil < 0 ? `venció hace ${Math.abs(daysUntil)} días` : daysUntil === 0 ? 'vence hoy' : `vence en ${daysUntil} días`}. Agenda una cita con tu veterinario.`,
        date: daysUntil < 0 ? 'VENCIDA' : daysUntil === 0 ? 'Hoy' : `en ${daysUntil} días`,
        typeLabel: daysUntil < 0 ? 'Urgente' : 'Salud',
        petName: currentPet.name,
        daysUntil,
      });
    });

    appointments
      .filter(app => app.petName === currentPet.name)
      .forEach(app => {
        const appDate = parseDate(app.date);
        const daysUntil = Math.ceil((appDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0) {
          missions.push({
            id: `appointment-${app.id}`,
            type: 'appointment',
            title: app.reason,
            description: `${app.petName} tiene una cita ${daysUntil === 0 ? 'hoy' : `en ${daysUntil} días`}.`,
            date: daysUntil === 0 ? 'Hoy' : `en ${daysUntil} días`,
            typeLabel: 'Cita',
            petName: app.petName,
            daysUntil,
          });
        }
      });

    return missions.filter(m => !completedMissions.includes(m.id));
  }, [currentPet, appointments, completedMissions]);

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

  const handleUpdateAppointment = (updated: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
    setNotification('Cita actualizada correctamente');
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    setNotification('Cita cancelada');
  };

  const navigateTo = (tab: string) => {
    setLastMainTab(activeTab);
    setActiveTab(tab);
  };

  const navigateBack = () => setActiveTab(lastMainTab);

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
        onBack={() => setActiveTab('home')}
      />
    );
    if (activeTab === 'historial') return <MedicalHistoryView onBack={navigateBack} />;
    if (activeTab === 'dieta') return <DietPlanView onBack={navigateBack} />;
    if (activeTab === 'urgencia') return <EmergencyView onBack={navigateBack} />;

    const isVet = role === AppRole.VETERINARIAN;

    if (isVet) {
      switch (activeTab) {
        case 'home': return <VetDashboard />;
        case 'appointments': return <VetAppointments />;
        case 'patients': return <VetPatients />;
        case 'inventory': return <VetInventory />;
        case 'financials': return <VetFinancials />;
        default: return <VetDashboard />;
      }
    }

    switch (activeTab) {
      case 'home':
        const hasExpired = derivedMissions.some(m => m.daysUntil < 0);
        const hasImminent = !hasExpired && derivedMissions.some(m => m.daysUntil >= 0 && m.daysUntil <= 10);
        const statusColor = hasExpired ? 'bg-rose-500' : hasImminent ? 'bg-amber-500' : 'bg-emerald-500';
        const statusText = hasExpired ? `${currentPet.name} necesita atención 🔴` : hasImminent ? `${currentPet.name} está bien 🟡` : `${currentPet.name} está genial 🟢`;
        const statusSubtext = hasExpired ? 'Tiene registros vencidos que requieren atención.' : hasImminent ? 'Hay recordatorios próximos a vencer.' : 'Todo bajo control por aquí.';
        const statusBadge = hasExpired ? 'Atención Requerida' : hasImminent ? 'Recordatorio' : 'Saludable';

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
              <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar px-2 -mx-2">
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
                    {hasExpired ? <AlertCircle className="w-4 h-4 text-white" /> : <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black">{statusText}</h2>
                  <p className="text-white/80 text-xs font-medium mt-1">{statusSubtext}</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <div className="bg-white/20 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      {statusBadge}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              {hasExpired && (
                <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                  Alerta Médica
                </div>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100">Próximas Misiones</h3>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {derivedMissions.length} Pendientes
                </span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                {derivedMissions.length > 0 ? (
                  derivedMissions.map(mission => (
                    <PendingTaskCard
                      key={mission.id}
                      icon={mission.type === 'vaccine'
                        ? <Syringe className={mission.typeLabel === 'Urgente' ? 'text-rose-500' : 'text-primary'} />
                        : <Calendar className="text-indigo-500" />}
                      title={mission.title}
                      date={mission.date}
                      type={mission.typeLabel}
                      onClick={() => setSelectedMission(mission)}
                    />
                  ))
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-10 bg-white/50 dark:bg-darkCard/50 rounded-4xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-400 text-xs font-bold">Todo al día, sin misiones pendientes</p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="px-2">
                <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100">Atajos</h3>
              </div>
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
                <AtajoIcon
                  icon={<PhoneCall />}
                  label="Urgencia"
                  color="bg-amber-50 dark:bg-amber-900/20 text-amber-500"
                  onClick={() => navigateTo('urgencia')}
                />
                <AtajoIcon
                  icon={<Utensils />}
                  label="Dieta"
                  color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
                  onClick={() => navigateTo('dieta')}
                />
              </div>
            </section>

          </div>
        );
      case 'search': return <VetSearch onAddAppointment={addAppointment} onOpenEmergency={() => navigateTo('urgencia')} pets={pets} selectedPetId={selectedPetId} />;
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
            onUpdatePet={(updatedPet) => {
              const updatedPets = pets.map(p => p.id === updatedPet.id ? updatedPet : p);
              setPets(updatedPets);
            }}
            onOpenDiet={() => navigateTo('dieta')}
            pets={pets}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        );
      default: return null;
    }
  };

  const handleToggleRole = () => {
    setRole(role === AppRole.OWNER ? AppRole.VETERINARIAN : AppRole.OWNER);
  };

  return (
    <Layout 
      role={role} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      showPlusMenu={showPlusMenu}
      setShowPlusMenu={setShowPlusMenu}
      toggleRole={handleToggleRole}
    >
      {renderContent()}

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
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ${selectedMission.typeLabel === 'Urgente' ? 'bg-rose-100 text-rose-500' : selectedMission.type === 'appointment' ? 'bg-indigo-100 text-indigo-500' : 'bg-primary/10 text-primary'}`}>
              {selectedMission.type === 'vaccine' ? <Syringe className="w-8 h-8" /> : <Calendar className="w-8 h-8" />}
            </div>
            <h3 className="text-2xl font-black text-secondary dark:text-white mb-2">{selectedMission.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">{selectedMission.description}</p>
            <button
              onClick={() => { setSelectedMission(null); setActiveTab('search'); }}
              className="w-full bg-primary text-white font-black py-3 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mb-4"
            >
              Agendar Cita
            </button>
            <CompletionSlider onComplete={() => {
              setCompletedMissions(prev => [...prev, selectedMission.id]);
              setSelectedMission(null);
            }} />
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

interface DietItem { id: string; time: string; type: string; portion: string; }

const DietPlanView = ({ onBack }: any) => {
  const [items, setItems] = useState<DietItem[]>([
    { id: '1', time: 'Mañana (08:00)', portion: '120g', type: 'Pienso Senior Articulaciones' },
    { id: '2', time: 'Tarde (14:00)', portion: 'Snack', type: 'Manzana o Zanahoria' },
    { id: '3', time: 'Noche (20:00)', portion: '120g', type: 'Pienso Senior Articulaciones' },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ time: '', type: '', portion: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ time: '', type: '', portion: '' });

  const startEdit = (item: DietItem) => {
    setEditingId(item.id);
    setEditForm({ time: item.time, type: item.type, portion: item.portion });
  };

  const saveEdit = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, ...editForm } : i));
    setEditingId(null);
  };

  const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const addItem = () => {
    if (!addForm.time || !addForm.type) return;
    setItems([...items, { id: Date.now().toString(), ...addForm }]);
    setAddForm({ time: '', type: '', portion: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-4">
        <ChevronRight className="w-4 h-4 rotate-180" /> Volver
      </button>
      <div className="bg-emerald-500 p-8 rounded-5xl text-white shadow-lg relative">
        <h2 className="text-3xl font-black">Plan de Dieta</h2>
        <p className="text-white/60 text-xs font-medium mt-1">Recomendado para Cocker Spaniel Senior</p>
        <button
          onClick={() => setShowAdd(true)}
          className="absolute top-8 right-8 bg-white text-emerald-500 p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        {items.map(item => (
          editingId === item.id ? (
            <div key={item.id} className="bg-white dark:bg-darkCard p-5 rounded-4xl border border-emerald-200 dark:border-emerald-800 shadow-sm space-y-3">
              <input value={editForm.time} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
                className="w-full p-3 bg-crema dark:bg-slate-800 rounded-2xl text-sm font-bold text-secondary dark:text-white border-none" placeholder="Horario" />
              <input value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                className="w-full p-3 bg-crema dark:bg-slate-800 rounded-2xl text-sm font-bold text-secondary dark:text-white border-none" placeholder="Alimento" />
              <input value={editForm.portion} onChange={e => setEditForm(f => ({ ...f, portion: e.target.value }))}
                className="w-full p-3 bg-crema dark:bg-slate-800 rounded-2xl text-sm font-bold text-secondary dark:text-white border-none" placeholder="Porción" />
              <div className="flex gap-2">
                <button onClick={() => saveEdit(item.id)} className="flex-1 bg-emerald-500 text-white font-black py-2.5 rounded-2xl text-sm hover:bg-emerald-600 transition-colors">Guardar</button>
                <button onClick={() => setEditingId(null)} className="flex-1 bg-crema dark:bg-slate-800 text-slate-500 font-black py-2.5 rounded-2xl text-sm">Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={item.id} className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm flex gap-5 items-center group">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-3xl flex items-center justify-center shadow-inner shrink-0">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.time}</span>
                <h4 className="font-black text-secondary dark:text-slate-200 text-base truncate">{item.type}</h4>
                <p className="text-xs text-slate-400 font-medium">{item.portion}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(item)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-500 transition-all">
                  <Settings2 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteItem(item.id)} className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-sm p-8 rounded-5xl shadow-2xl border border-white dark:border-slate-800 relative">
            <button onClick={() => setShowAdd(false)} className="absolute top-6 right-6 text-slate-300 hover:text-secondary transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-secondary dark:text-white mb-6">Nueva Comida</h3>
            <div className="space-y-4">
              <input value={addForm.time} onChange={e => setAddForm(f => ({ ...f, time: e.target.value }))}
                className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl font-bold text-secondary dark:text-white border-none" placeholder="Horario (ej. Mañana 08:00)" />
              <input value={addForm.type} onChange={e => setAddForm(f => ({ ...f, type: e.target.value }))}
                className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl font-bold text-secondary dark:text-white border-none" placeholder="Alimento" />
              <input value={addForm.portion} onChange={e => setAddForm(f => ({ ...f, portion: e.target.value }))}
                className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl font-bold text-secondary dark:text-white border-none" placeholder="Porción (ej. 120g)" />
              <button onClick={addItem} className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-2">
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmergencyView = ({ onBack }: any) => {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Hospital Vet Sur", address: "Calle Falsa 123", phone: "+54 11 4930-XXXX" },
    { id: 2, name: "Clínica San Roque", address: "Av. Libertador 4500", phone: "+54 11 2284-XXXX" }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleSave = () => {
    if (!newName || !newPhone) return;
    if (isEditing && editId) {
      setContacts(contacts.map(c => c.id === editId ? { ...c, name: newName, phone: newPhone, address: newAddress || 'Sin dirección' } : c));
    } else {
      setContacts([...contacts, { id: Date.now(), name: newName, phone: newPhone, address: newAddress || 'Sin dirección' }]);
    }
    setShowAdd(false);
    setIsEditing(false);
    setEditId(null);
    setNewName('');
    setNewPhone('');
    setNewAddress('');
  };

  const handleEdit = (c: any) => {
    setNewName(c.name);
    setNewPhone(c.phone);
    setNewAddress(c.address);
    setEditId(c.id);
    setIsEditing(true);
    setShowAdd(true);
  };

  const handleDelete = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-4">
        <ChevronRight className="w-4 h-4 rotate-180" /> Volver
      </button>
      <div className="bg-rose-500 p-8 rounded-5xl text-white shadow-lg relative">
         <h2 className="text-3xl font-black">Emergencias 24h</h2>
         <p className="text-white/60 text-xs font-medium mt-1">Contacto inmediato con clínicas cercanas</p>
         <button 
           onClick={() => { setShowAdd(true); setIsEditing(false); setNewName(''); setNewPhone(''); setNewAddress(''); }}
           className="absolute top-8 right-8 bg-white text-rose-500 p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
         >
           <Plus className="w-5 h-5" />
         </button>
      </div>
      <div className="space-y-4">
        {contacts.map(c => (
          <EmergencyItem 
            key={c.id} 
            name={c.name} 
            address={c.address} 
            phone={c.phone} 
            onEdit={() => handleEdit(c)}
            onDelete={() => handleDelete(c.id)}
          />
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-sm p-8 rounded-5xl shadow-2xl border border-white dark:border-slate-800 relative">
            <button onClick={() => setShowAdd(false)} className="absolute top-6 right-6 text-slate-300 hover:text-secondary transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-secondary dark:text-white mb-6">{isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre Clínica</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl border-none font-bold text-secondary dark:text-white" placeholder="Ej. Hospital Vet" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teléfono</label>
                <input value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl border-none font-bold text-secondary dark:text-white" placeholder="Ej. +54 11..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dirección</label>
                <input value={newAddress} onChange={e => setNewAddress(e.target.value)} className="w-full p-4 bg-crema dark:bg-slate-800 rounded-2xl border-none font-bold text-secondary dark:text-white" placeholder="Ej. Calle 123" />
              </div>
              <button onClick={handleSave} className="w-full bg-rose-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmergencyItem = ({ name, address, phone, onEdit, onDelete }: any) => (
  <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm flex justify-between items-center group">
    <div className="flex-1">
      <h4 className="font-black text-secondary dark:text-slate-200 text-base">{name}</h4>
      <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
        <MapPin className="w-3 h-3" /> {address}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onEdit} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
        <Settings2 className="w-5 h-5" />
      </button>
      <button onClick={onDelete} className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
        <Trash2 className="w-5 h-5" />
      </button>
      <a href={`tel:${phone}`} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
        <Phone className="w-5 h-5" />
      </a>
    </div>
  </div>
);

const PendingTaskCard = ({ icon, title, date, type, onClick }: any) => {
  const tagStyle =
    type === 'Urgente' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
    type === 'Cita'    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                         'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
  return (
  <div
    onClick={onClick}
    className="bg-white dark:bg-darkCard min-w-[190px] p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group shrink-0"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-11 h-11 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${tagStyle}`}>{type}</span>
    </div>
    <h4 className="font-extrabold text-secondary dark:text-slate-200 text-sm mb-1">{title}</h4>
    <p className="text-primary text-[11px] font-black">{date}</p>
  </div>
  );
};

const AtajoIcon = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group w-full">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-active:scale-95 transition-all`}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
    </div>
    <span className="text-[10px] font-black text-secondary dark:text-slate-400 uppercase tracking-tight">{label}</span>
  </button>
);

const CompletionSlider = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current || completed) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setProgress(pct);
    if (pct >= 85) {
      setCompleted(true);
      setProgress(100);
      isDragging.current = false;
      setTimeout(onComplete, 900);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (!completed) setProgress(0);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-center text-slate-400 font-bold">Desliza si esta misión ya fue completada</p>
      <div
        ref={containerRef}
        className="relative h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden select-none cursor-pointer"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="absolute inset-y-0 left-0 bg-emerald-400/30 rounded-2xl transition-all duration-75" style={{ width: `${progress}%` }} />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-12 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-75 ${completed ? 'bg-emerald-500' : 'bg-secondary dark:bg-slate-600'}`}
          style={{ left: `max(4px, calc(${progress}% - 48px))` }}
          onPointerDown={(e) => { isDragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); }}
        >
          {completed
            ? <Heart className="w-5 h-5 text-white fill-white animate-bounce" />
            : <ChevronRight className="w-5 h-5 text-white" />}
        </div>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest pointer-events-none">
          {completed ? '¡Listo!' : 'Desliza →'}
        </span>
      </div>
      {completed && (
        <div className="flex justify-center gap-1 animate-in fade-in duration-300">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} className="w-5 h-5 text-rose-400 fill-rose-400 animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
