
import React, { useState, useRef } from 'react';
import { Pet, Appointment } from '../types';
import { CalendarPicker } from './CalendarPicker';
import {
  FileText,
  Plus,
  Syringe,
  ShieldCheck,
  Pill,
  AlertCircle,
  Clock,
  ChevronRight,
  Upload,
  User,
  Activity,
  Award,
  Calendar,
  Layers,
  FileSearch,
  X,
  FileCheck,
  Trash2,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  Pencil,
  ChevronDown,
  Check
} from 'lucide-react';

interface PetProfileProps {
  pet: Pet;
  activeTab?: 'info' | 'medical' | 'docs' | 'appointments';
  setActiveTab?: (tab: 'info' | 'medical' | 'docs' | 'appointments') => void;
  appointments?: Appointment[];
  pets?: Pet[];
  onSwitchPet?: (id: string) => void;
  onAddAppointment?: () => void;
  onEditPet?: (pet: Pet) => void;
  onUpdatePet?: (pet: Pet) => void;
  onOpenDiet?: () => void;
  onUpdateAppointment?: (app: Appointment) => void;
  onDeleteAppointment?: (id: string) => void;
}

export const PetProfile: React.FC<PetProfileProps> = ({
  pet,
  activeTab = 'info',
  setActiveTab,
  appointments = [],
  pets = [],
  onSwitchPet,
  onAddAppointment,
  onEditPet,
  onUpdatePet,
  onOpenDiet,
  onUpdateAppointment,
  onDeleteAppointment,
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpdatePet?.({ ...pet, imageUrl: url });
    setShowUpload(false);
  };
  const [showRecetaDetail, setShowRecetaDetail] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState('');
  const [newVaccineDate, setNewVaccineDate] = useState(() => {
    const d = new Date();
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  });
  const [newVaccineNextDue, setNewVaccineNextDue] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  });
  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const [showNextDueCalendar, setShowNextDueCalendar] = useState(false);
  const [showPetSwitcher, setShowPetSwitcher] = useState(false);
  const [editingAllergies, setEditingAllergies] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');
  const [editingConditions, setEditingConditions] = useState(false);
  const [conditionInput, setConditionInput] = useState('');
  const [editingVaccine, setEditingVaccine] = useState<{ index: number; name: string; date: string; nextDue: string } | null>(null);
  const [showVaxEditDate, setShowVaxEditDate] = useState(false);
  const [showVaxEditNextDue, setShowVaxEditNextDue] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showApptCal, setShowApptCal] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState({
    name: pet.name,
    breed: pet.breed,
    age: pet.age,
    sex: pet.sex as 'Male' | 'Female' | 'Other',
    weight: pet.weight,
  });

  React.useEffect(() => {
    setEditForm({ name: pet.name, breed: pet.breed, age: pet.age, sex: pet.sex, weight: pet.weight });
    setEditingInfo(false);
  }, [pet.id]);

  const handleSaveInfo = () => {
    onUpdatePet?.({ ...pet, ...editForm });
    setEditingInfo(false);
  };

  const handleDeleteVaccine = (index: number) => {
    const updated = pet.vaccines.filter((_, i) => i !== index);
    onUpdatePet?.({ ...pet, vaccines: updated });
  };

  const handleAddVaccine = () => {
    if (newVaccineName.trim() === '') return;
    const newVaccine = {
      name: newVaccineName,
      date: newVaccineDate,
      nextDue: newVaccineNextDue
    };
    onUpdatePet?.({
      ...pet,
      vaccines: [...pet.vaccines, newVaccine]
    });
    setShowAddVaccine(false);
    setNewVaccineName('');
  };

  const handleSaveVaccineEdit = () => {
    if (!editingVaccine) return;
    const updated = pet.vaccines.map((v, i) =>
      i === editingVaccine.index ? { name: editingVaccine.name, date: editingVaccine.date, nextDue: editingVaccine.nextDue } : v
    );
    onUpdatePet?.({ ...pet, vaccines: updated });
    setEditingVaccine(null);
  };

  const handleSaveAppointmentEdit = () => {
    if (!editingAppointment) return;
    onUpdateAppointment?.(editingAppointment);
    setEditingAppointment(null);
  };

  const currentTab = activeTab;

  return (
    <div className="relative -mt-10 pb-10 space-y-4 animate-in fade-in duration-700">
      <div className="relative w-full h-[380px] overflow-hidden rounded-b-5xl">
        <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover blur-md opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-crema dark:from-darkBg via-crema/20 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-2 bg-white dark:bg-slate-800 rounded-full shadow-2xl border-4 border-white dark:border-slate-800 transform hover:scale-105 transition-transform duration-500">
              <img src={pet.imageUrl} alt={pet.name} className="w-56 h-56 rounded-full object-cover border-8 border-crema dark:border-slate-900" />
              <button 
                onClick={() => setShowUpload(true)}
                className="absolute bottom-4 right-4 bg-primary text-white p-3.5 rounded-full shadow-xl border-4 border-white dark:border-slate-800 hover:scale-110 transition-all"
              >
                <Upload className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="mt-5 text-center">
            <h2 className="text-4xl font-black text-secondary dark:text-slate-100 tracking-tighter">¡Hola, {pet.name}!</h2>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="bg-secondary dark:bg-slate-700 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{pet.breed}</span>
              <span className="bg-primary/10 text-primary border border-primary/20 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{pet.age} años</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 space-y-6 -mt-4 relative z-10">
        {/* Pet Switcher — botón compacto */}
        {pets.length > 1 && (
          <div className="flex justify-end px-2">
            <button
              onClick={() => setShowPetSwitcher(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-darkCard rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-all"
            >
              <img src={pet.imageUrl} className="w-5 h-5 rounded-full object-cover" alt={pet.name} />
              <span className="text-[10px] font-black uppercase tracking-widest">Cambiar perfil</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-2 rounded-4xl border border-white/50 dark:border-slate-700 shadow-xl transition-colors">
          <TabButton active={currentTab === 'info'} onClick={() => setActiveTab?.('info')} label="DATOS" />
          <TabButton active={currentTab === 'medical'} onClick={() => setActiveTab?.('medical')} label="MÉDICO" />
          <TabButton active={currentTab === 'appointments'} onClick={() => setActiveTab?.('appointments')} label="CITAS" />
          <TabButton active={currentTab === 'docs'} onClick={() => setActiveTab?.('docs')} label="RECETAS" />
        </div>

        {currentTab === 'info' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="text-primary"><User className="w-5 h-5" /></div>
                <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100">Información General</h3>
              </div>
              {!editingInfo ? (
                <button
                  onClick={() => setEditingInfo(true)}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-crema dark:bg-slate-800 text-slate-400 hover:text-primary rounded-xl transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
              ) : (
                <button
                  onClick={handleSaveInfo}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-primary text-white rounded-xl shadow-lg transition-all"
                >
                  <Check className="w-3.5 h-3.5" /> Guardar
                </button>
              )}
            </div>

            {editingInfo ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Nombre</span>
                  <input value={editForm.name} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} className="w-full p-4 bg-white dark:bg-darkCard rounded-3xl border border-slate-100 dark:border-slate-800 font-bold text-secondary dark:text-slate-200 text-sm focus:outline-none focus:border-primary/30" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Raza</span>
                  <input value={editForm.breed} onChange={e => setEditForm(f => ({...f, breed: e.target.value}))} className="w-full p-4 bg-white dark:bg-darkCard rounded-3xl border border-slate-100 dark:border-slate-800 font-bold text-secondary dark:text-slate-200 text-sm focus:outline-none focus:border-primary/30" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Edad</span>
                  <input type="number" value={editForm.age} onChange={e => setEditForm(f => ({...f, age: parseInt(e.target.value) || 0}))} className="w-full p-4 bg-white dark:bg-darkCard rounded-3xl border border-slate-100 dark:border-slate-800 font-bold text-secondary dark:text-slate-200 text-sm focus:outline-none focus:border-primary/30" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Sexo</span>
                  <select value={editForm.sex} onChange={e => setEditForm(f => ({...f, sex: e.target.value as any}))} className="w-full p-4 bg-white dark:bg-darkCard rounded-3xl border border-slate-100 dark:border-slate-800 font-bold text-secondary dark:text-slate-200 text-sm focus:outline-none focus:border-primary/30">
                    <option value="Male">Macho</option>
                    <option value="Female">Hembra</option>
                    <option value="Other">Otro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Peso (kg)</span>
                  <input type="number" step="0.1" value={editForm.weight} onChange={e => setEditForm(f => ({...f, weight: parseFloat(e.target.value) || 0}))} className="w-full p-4 bg-white dark:bg-darkCard rounded-3xl border border-slate-100 dark:border-slate-800 font-bold text-secondary dark:text-slate-200 text-sm focus:outline-none focus:border-primary/30" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <InfoCard label="Sexo" value={pet.sex === 'Male' ? 'Macho' : pet.sex === 'Female' ? 'Hembra' : 'Otro'} />
                <InfoCard label="Peso Actual" value={`${pet.weight} kg`} />
                <InfoCard label="Raza" value={pet.breed} />
                <InfoCard label="Edad" value={`${pet.age} años`} />
              </div>
            )}

            <SectionTitle title="Alergias y Condiciones" icon={<AlertCircle className="w-5 h-5" />} color="text-rose-500" />
            <div className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-6 rounded-4xl space-y-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Alergias Detectadas</span>
                  <button
                    onClick={() => setEditingAllergies(e => !e)}
                    className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all ${editingAllergies ? 'bg-rose-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500'}`}
                  >
                    {editingAllergies ? 'Listo' : 'Editar'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pet.allergies.map(a => (
                    <span key={a} className="flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 shadow-sm">
                      {a}
                      {editingAllergies && (
                        <button onClick={() => onUpdatePet?.({ ...pet, allergies: pet.allergies.filter(x => x !== a) })} className="ml-1 text-rose-400 hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {pet.allergies.length === 0 && !editingAllergies && <span className="text-xs text-slate-400">Ninguna</span>}
                </div>
                {editingAllergies && (
                  <div className="flex gap-2 mt-1">
                    <input
                      value={allergyInput}
                      onChange={e => setAllergyInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && allergyInput.trim()) { onUpdatePet?.({ ...pet, allergies: [...pet.allergies, allergyInput.trim()] }); setAllergyInput(''); } }}
                      placeholder="Nueva alergia..."
                      className="flex-1 p-2.5 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold text-secondary dark:text-white border border-rose-100 dark:border-rose-900/30 focus:outline-none focus:border-rose-400"
                    />
                    <button
                      onClick={() => { if (allergyInput.trim()) { onUpdatePet?.({ ...pet, allergies: [...pet.allergies, allergyInput.trim()] }); setAllergyInput(''); } }}
                      className="p-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-secondary/60 dark:text-slate-500 uppercase tracking-widest">Condiciones Crónicas</span>
                  <button
                    onClick={() => setEditingConditions(e => !e)}
                    className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all ${editingConditions ? 'bg-secondary text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-secondary'}`}
                  >
                    {editingConditions ? 'Listo' : 'Editar'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pet.chronicConditions.map(c => (
                    <span key={c} className="flex items-center gap-1 bg-secondary/5 dark:bg-slate-700 px-3 py-1 rounded-xl text-xs font-bold text-secondary dark:text-slate-300">
                      {c}
                      {editingConditions && (
                        <button onClick={() => onUpdatePet?.({ ...pet, chronicConditions: pet.chronicConditions.filter(x => x !== c) })} className="ml-1 text-slate-400 hover:text-rose-500">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {pet.chronicConditions.length === 0 && !editingConditions && <span className="text-xs text-slate-400">Ninguna</span>}
                </div>
                {editingConditions && (
                  <div className="flex gap-2 mt-1">
                    <input
                      value={conditionInput}
                      onChange={e => setConditionInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && conditionInput.trim()) { onUpdatePet?.({ ...pet, chronicConditions: [...pet.chronicConditions, conditionInput.trim()] }); setConditionInput(''); } }}
                      placeholder="Nueva condición..."
                      className="flex-1 p-2.5 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold text-secondary dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-secondary/40"
                    />
                    <button
                      onClick={() => { if (conditionInput.trim()) { onUpdatePet?.({ ...pet, chronicConditions: [...pet.chronicConditions, conditionInput.trim()] }); setConditionInput(''); } }}
                      className="p-2.5 bg-secondary text-white rounded-xl hover:bg-secondary/80 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'medical' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
             <SectionTitle title="Seguimiento de Vacunas" icon={<ShieldCheck className="w-5 h-5" />} color="text-emerald-500" />
             <div className="space-y-3">
               {pet.vaccines.length > 0 ? pet.vaccines.map((v, i) => (
                 <MedicalItem key={i} title={v.name} last={v.date} next={v.nextDue} icon={<Syringe />} onEdit={() => setEditingVaccine({ index: i, name: v.name, date: v.date, nextDue: v.nextDue })} onDelete={() => handleDeleteVaccine(i)} />
               )) : <div className="text-center py-10 text-slate-400 text-xs font-bold">No hay vacunas registradas</div>}
               <button 
                 onClick={() => setShowAddVaccine(true)}
                 className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-4xl text-slate-400 dark:text-slate-600 font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
               >
                 <Plus className="w-4 h-4" /> Añadir Vacuna
               </button>
             </div>

             <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
               <SectionTitle title="Plan de Dieta" icon={<Layers className="w-5 h-5" />} color="text-amber-500" />
               <div className="mt-4">
                 <button 
                   onClick={onOpenDiet}
                   className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-6 rounded-4xl flex items-center justify-between group hover:shadow-md transition-all"
                 >
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-500">
                       <Layers className="w-6 h-6" />
                     </div>
                     <div className="text-left">
                       <h4 className="font-black text-secondary dark:text-slate-200">Ver Plan Nutricional</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Recomendaciones y porciones</p>
                     </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
             </div>
          </div>
        )}

        {currentTab === 'appointments' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <SectionTitle title="Mis Citas" icon={<Calendar className="w-5 h-5" />} color="text-indigo-500" />
            <div className="space-y-4">
              {appointments.filter(a => a.petName === pet.name).length > 0 ? (
                appointments.filter(a => a.petName === pet.name).map(app => (
                  <button
                    key={app.id}
                    onClick={() => { setEditingAppointment(app); setIsRescheduling(false); }}
                    className="w-full bg-white dark:bg-darkCard p-5 rounded-4xl border border-white dark:border-slate-800 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-secondary dark:text-slate-200 text-sm truncate">{app.reason}</h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.date} • {app.time}</span>
                      {app.vetName && <p className="text-[10px] text-primary font-bold mt-0.5">{app.vetName}</p>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="text-center py-10 bg-white dark:bg-darkCard rounded-4xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 text-xs font-bold">No tienes citas agendadas para {pet.name}</p>
                </div>
              )}
              <button 
                onClick={onAddAppointment}
                className="w-full py-4 bg-indigo-500 text-white rounded-4xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Agendar Nueva Cita
              </button>
            </div>
          </div>
        )}

        {currentTab === 'docs' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <SectionTitle title="Historial de Documentos" icon={<FileSearch className="w-5 h-5" />} />
            <div className="space-y-3">
              {pet.documents.length > 0 ? pet.documents.map(doc => (
                <div 
                  key={doc.id} 
                  className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => setShowRecetaDetail(true)}>
                    <div className="w-12 h-12 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-secondary dark:text-slate-200 text-sm">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.type} • {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowRecetaDetail(true)} className="bg-secondary dark:bg-slate-700 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary shadow-sm transition-colors">Ver</button>
                    <button title="Eliminar" className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )) : <div className="text-center py-10 text-slate-400 text-xs font-bold">No hay documentos registrados</div>}
            </div>
          </div>
        )}
      </div>

      {/* Modal Añadir Vacuna */}
      {showAddVaccine && (
        <div className="fixed inset-0 z-[200] bg-secondary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-10">
            <div className="p-8 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-secondary dark:text-slate-100">Nueva Vacuna</h3>
                <button onClick={() => { setShowAddVaccine(false); setShowDateCalendar(false); setShowNextDueCalendar(false); }} className="p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400"><X /></button>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de Vacuna</span>
                <input
                  type="text"
                  placeholder="Ej. Moquillo"
                  value={newVaccineName}
                  onChange={(e) => setNewVaccineName(e.target.value)}
                  className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl border-none font-bold text-secondary dark:text-slate-200 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Aplicación</span>
                <button
                  onClick={() => { setShowDateCalendar(v => !v); setShowNextDueCalendar(false); }}
                  className="w-full flex items-center gap-3 p-4 bg-crema dark:bg-slate-800 rounded-3xl font-bold text-secondary dark:text-slate-200 text-sm"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  {newVaccineDate}
                </button>
                {showDateCalendar && (
                  <CalendarPicker
                    value={newVaccineDate}
                    onChange={(date) => { setNewVaccineDate(date); setShowDateCalendar(false); }}
                  />
                )}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próxima Dosis</span>
                <button
                  onClick={() => { setShowNextDueCalendar(v => !v); setShowDateCalendar(false); }}
                  className="w-full flex items-center gap-3 p-4 bg-crema dark:bg-slate-800 rounded-3xl font-bold text-secondary dark:text-slate-200 text-sm"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  {newVaccineNextDue}
                </button>
                {showNextDueCalendar && (
                  <CalendarPicker
                    value={newVaccineNextDue}
                    onChange={(date) => { setNewVaccineNextDue(date); setShowNextDueCalendar(false); }}
                    minDate={new Date()}
                  />
                )}
              </div>
              <button onClick={handleAddVaccine} className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl">Guardar Registro</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Vacuna */}
      {editingVaccine && (
        <div className="fixed inset-0 z-[200] bg-secondary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-10">
            <div className="p-8 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-secondary dark:text-slate-100">Editar Vacuna</h3>
                <button onClick={() => { setEditingVaccine(null); setShowVaxEditDate(false); setShowVaxEditNextDue(false); }} className="p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400"><X /></button>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de Vacuna</span>
                <input
                  value={editingVaccine.name}
                  onChange={e => setEditingVaccine(v => v ? { ...v, name: e.target.value } : v)}
                  className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl border-none font-bold text-secondary dark:text-slate-200 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Aplicación</span>
                <button
                  onClick={() => { setShowVaxEditDate(v => !v); setShowVaxEditNextDue(false); }}
                  className="w-full flex items-center gap-3 p-4 bg-crema dark:bg-slate-800 rounded-3xl font-bold text-secondary dark:text-slate-200 text-sm"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  {editingVaccine.date}
                </button>
                {showVaxEditDate && (
                  <CalendarPicker
                    value={editingVaccine.date}
                    onChange={(date) => { setEditingVaccine(v => v ? { ...v, date } : v); setShowVaxEditDate(false); }}
                  />
                )}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próxima Dosis</span>
                <button
                  onClick={() => { setShowVaxEditNextDue(v => !v); setShowVaxEditDate(false); }}
                  className="w-full flex items-center gap-3 p-4 bg-crema dark:bg-slate-800 rounded-3xl font-bold text-secondary dark:text-slate-200 text-sm"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  {editingVaccine.nextDue}
                </button>
                {showVaxEditNextDue && (
                  <CalendarPicker
                    value={editingVaccine.nextDue}
                    onChange={(date) => { setEditingVaccine(v => v ? { ...v, nextDue: date } : v); setShowVaxEditNextDue(false); }}
                  />
                )}
              </div>
              <button onClick={handleSaveVaccineEdit} className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl">Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle / Reagendar Cita */}
      {editingAppointment && (
        <div className="fixed inset-0 z-[200] bg-secondary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-10">
            <div className="p-8 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-secondary dark:text-slate-100">
                  {isRescheduling ? 'Reagendar Cita' : 'Detalle de Cita'}
                </h3>
                <button
                  onClick={() => { setEditingAppointment(null); setShowApptCal(false); setIsRescheduling(false); }}
                  className="p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400"
                >
                  <X />
                </button>
              </div>

              {!isRescheduling ? (
                /* Vista de detalle */
                <div className="space-y-3">
                  <div className="bg-crema dark:bg-slate-800 rounded-3xl p-5 space-y-4">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motivo</span>
                      <p className="font-black text-secondary dark:text-slate-100 mt-1">{editingAppointment.reason}</p>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</span>
                        <p className="font-bold text-secondary dark:text-slate-200 text-sm mt-1">{editingAppointment.date}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horario</span>
                        <p className="font-bold text-secondary dark:text-slate-200 text-sm mt-1">{editingAppointment.time}</p>
                      </div>
                    </div>
                    {editingAppointment.vetName && (
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</span>
                        <p className="font-bold text-primary text-sm mt-1">{editingAppointment.vetName}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { onDeleteAppointment?.(editingAppointment.id); setEditingAppointment(null); }}
                      className="flex-1 py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Cancelar Cita
                    </button>
                    <button
                      onClick={() => setIsRescheduling(true)}
                      className="flex-1 py-4 bg-indigo-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-all"
                    >
                      Reagendar
                    </button>
                  </div>
                </div>
              ) : (
                /* Vista de reagendar */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nueva Fecha</span>
                    <button
                      onClick={() => setShowApptCal(v => !v)}
                      className="w-full flex items-center gap-3 p-4 bg-crema dark:bg-slate-800 rounded-3xl font-bold text-secondary dark:text-slate-200 text-sm"
                    >
                      <Calendar className="w-4 h-4 text-primary" />
                      {editingAppointment.date}
                    </button>
                    {showApptCal && (
                      <CalendarPicker
                        value={editingAppointment.date}
                        onChange={(date) => { setEditingAppointment(a => a ? { ...a, date } : a); setShowApptCal(false); }}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nuevo Horario</span>
                    <input
                      type="time"
                      value={editingAppointment.time}
                      onChange={e => setEditingAppointment(a => a ? { ...a, time: e.target.value } : a)}
                      className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl border-none font-bold text-secondary dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setIsRescheduling(false); setShowApptCal(false); }}
                      className="flex-1 py-4 bg-crema dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-3xl font-black text-xs uppercase tracking-widest"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => { handleSaveAppointmentEdit(); setIsRescheduling(false); }}
                      className="flex-1 py-4 bg-indigo-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-all"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Cambiar Perfil */}
      {showPetSwitcher && (
        <div className="fixed inset-0 z-[200] bg-secondary/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-xs p-8 rounded-5xl shadow-2xl border border-white dark:border-slate-800 relative">
            <button onClick={() => setShowPetSwitcher(false)} className="absolute top-5 right-5 p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-black text-secondary dark:text-slate-100 mb-6">Seleccionar Perfil</h3>
            <div className="flex flex-col gap-3">
              {pets.map(p => (
                <button
                  key={p.id}
                  onClick={() => { onSwitchPet?.(p.id); setShowPetSwitcher(false); }}
                  className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${p.id === pet.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-primary/30'}`}
                >
                  <img src={p.imageUrl} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md" alt={p.name} />
                  <div className="text-left flex-1">
                    <h4 className="font-black text-secondary dark:text-slate-200 text-sm">{p.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{p.breed} · {p.age} años</p>
                  </div>
                  {p.id === pet.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Cambio de Foto */}
      {showUpload && (
        <div className="fixed inset-0 z-[200] bg-secondary/30 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-darkCard rounded-5xl p-10 w-full max-w-sm text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 bg-crema dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-inner transition-colors"><Upload className="w-10 h-10 text-primary opacity-40" /></div>
              <div>
                <h3 className="text-xl font-black text-secondary dark:text-slate-100 transition-colors">Cambiar Foto</h3>
                <p className="text-sm text-slate-400 font-medium mt-2">Sube una imagen clara de {pet.name}</p>
              </div>
              <div className="space-y-3">
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full py-4 bg-primary text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
                >
                  Elegir Archivo
                </button>
                <button onClick={() => setShowUpload(false)} className="w-full py-4 bg-crema dark:bg-slate-700 text-secondary dark:text-slate-200 rounded-3xl font-black uppercase text-[10px] tracking-widest">Cancelar</button>
              </div>
           </div>
        </div>
      )}

      {/* Modal Detalle Receta */}
      {showRecetaDetail && (
        <div className="fixed inset-0 z-[200] bg-secondary/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
           <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
              <div className="p-8 space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-4 rounded-3xl shadow-sm"><FileCheck className="w-10 h-10" /></div>
                    <button onClick={() => setShowRecetaDetail(false)} className="p-3 bg-crema dark:bg-slate-700 rounded-2xl text-slate-300"><X /></button>
                 </div>
                 <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Diagnóstico</span>
                    <h3 className="text-2xl font-black text-secondary dark:text-slate-100">Otitis Externa Leve</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed">Bruno presenta inflamación en el canal auditivo derecho. Requiere limpieza diaria y gotas medicadas.</p>
                 </div>
                 <div className="space-y-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Tratamiento</span>
                    <div className="bg-crema dark:bg-slate-800 p-6 rounded-4xl border border-white dark:border-slate-700 shadow-inner space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-black text-secondary dark:text-slate-200">Otomax Gotas</span>
                          <span className="text-[10px] font-black bg-white dark:bg-darkCard px-3 py-1 rounded-xl text-primary shadow-sm">C/12h</span>
                       </div>
                       <p className="text-[11px] text-slate-400 font-bold uppercase">Aplicar 4 gotas por 7 días</p>
                    </div>
                 </div>
                 <button onClick={() => setShowRecetaDetail(false)} className="w-full py-5 bg-secondary dark:bg-slate-700 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-secondary/10 hover:bg-primary transition-all">Entendido</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex-1 py-3 text-[11px] font-black rounded-3xl transition-all tracking-[0.15em] ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-secondary/40 dark:text-slate-500'}`}>
    {label}
  </button>
);

const SectionTitle = ({ title, icon, color = 'text-primary' }: any) => (
  <div className="flex items-center gap-3 px-2">
    <div className={`${color}`}>{icon}</div>
    <h3 className="text-xl font-extrabold text-secondary dark:text-slate-100">{title}</h3>
  </div>
);

const InfoCard = ({ label, value }: any) => (
  <div className="bg-white dark:bg-darkCard p-5 rounded-4xl border border-white dark:border-slate-800 shadow-sm shadow-secondary/5 transition-colors">
    <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest block mb-1">{label}</span>
    <span className="text-sm font-black text-secondary dark:text-slate-200">{value}</span>
  </div>
);

const MedicalItem = ({ title, last, next, icon, onDelete, onEdit }: any) => (
  <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
    <div className="w-11 h-11 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner shrink-0">
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-black text-secondary dark:text-slate-200 text-sm leading-none">{title}</h4>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Última: {last}</span>
        <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
        <span className="text-[10px] text-primary font-black uppercase tracking-tight">Próx: {next}</span>
      </div>
    </div>
    <div className="flex gap-2 shrink-0">
      {onEdit && (
        <button onClick={onEdit} className="p-2 rounded-2xl text-slate-300 hover:bg-indigo-50 hover:text-indigo-500 dark:hover:bg-indigo-900/20 transition-all">
          <Pencil className="w-4 h-4" />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} className="p-2 rounded-2xl text-slate-300 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20 transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);
