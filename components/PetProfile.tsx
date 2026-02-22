
import React, { useState } from 'react';
import { Pet, Appointment } from '../types';
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
  CheckCircle2
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
}

export const PetProfile: React.FC<PetProfileProps> = ({ 
  pet, 
  activeTab = 'info', 
  setActiveTab, 
  appointments = [],
  pets = [],
  onSwitchPet,
  onAddAppointment,
  onEditPet
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [showRecetaDetail, setShowRecetaDetail] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);

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
          <div className="mt-5 text-center relative">
            <h2 className="text-4xl font-black text-secondary dark:text-slate-100 tracking-tighter">¡Hola, {pet.name}!</h2>
            <button 
              onClick={() => onEditPet?.(pet)}
              className="absolute -right-8 top-1 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-crema dark:border-slate-700 text-primary hover:scale-110 transition-all"
            >
              <FileText className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="bg-secondary dark:bg-slate-700 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{pet.breed}</span>
              <span className="bg-primary/10 text-primary border border-primary/20 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{pet.age} años</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 space-y-6 -mt-4 relative z-10">
        {/* Pet Switcher in Profile */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-2">
          {pets.map(p => (
            <button 
              key={p.id}
              onClick={() => onSwitchPet?.(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all shrink-0 ${p.id === pet.id ? 'border-primary bg-primary/5 text-primary' : 'border-white dark:border-slate-800 bg-white dark:bg-darkCard text-slate-400'}`}
            >
              <img src={p.imageUrl} className="w-6 h-6 rounded-lg object-cover" alt={p.name} />
              <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="flex bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-2 rounded-4xl border border-white/50 dark:border-slate-700 shadow-xl transition-colors">
          <TabButton active={currentTab === 'info'} onClick={() => setActiveTab?.('info')} label="DATOS" />
          <TabButton active={currentTab === 'medical'} onClick={() => setActiveTab?.('medical')} label="MÉDICO" />
          <TabButton active={currentTab === 'appointments'} onClick={() => setActiveTab?.('appointments')} label="CITAS" />
          <TabButton active={currentTab === 'docs'} onClick={() => setActiveTab?.('docs')} label="RECETAS" />
        </div>

        {currentTab === 'info' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <SectionTitle title="Información General" icon={<User className="w-5 h-5" />} />
            <div className="grid grid-cols-2 gap-4">
               <InfoCard label="Sexo" value={pet.sex === 'Male' ? 'Macho' : 'Hembra'} />
               <InfoCard label="Peso Actual" value={`${pet.weight} kg`} />
               <InfoCard label="Microchip" value="Nº 9283-X1" />
               <InfoCard label="Seguro" value="VetCare Gold" />
            </div>
            <SectionTitle title="Alergias y Condiciones" icon={<AlertCircle className="w-5 h-5" />} color="text-rose-500" />
            <div className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-6 rounded-4xl space-y-4 shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Alergias Detectadas</span>
                <div className="flex flex-wrap gap-2">
                  {pet.allergies.length > 0 ? pet.allergies.map(a => <span key={a} className="bg-white dark:bg-slate-800 px-3 py-1 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 shadow-sm">{a}</span>) : <span className="text-xs text-slate-400">Ninguna</span>}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-secondary/60 dark:text-slate-500 uppercase tracking-widest">Condiciones Crónicas</span>
                <div className="flex flex-wrap gap-2">
                  {pet.chronicConditions.length > 0 ? pet.chronicConditions.map(c => <span key={c} className="bg-secondary/5 dark:bg-slate-700 px-3 py-1 rounded-xl text-xs font-bold text-secondary dark:text-slate-300">{c}</span>) : <span className="text-xs text-slate-400">Ninguna</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'medical' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
             <SectionTitle title="Seguimiento de Vacunas" icon={<ShieldCheck className="w-5 h-5" />} color="text-emerald-500" />
             <div className="space-y-3">
               {pet.vaccines.length > 0 ? pet.vaccines.map((v, i) => <MedicalItem key={i} title={v.name} last={v.date} next={v.nextDue} icon={<Syringe />} />) : <div className="text-center py-10 text-slate-400 text-xs font-bold">No hay vacunas registradas</div>}
               <button 
                 onClick={() => setShowAddVaccine(true)}
                 className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-4xl text-slate-400 dark:text-slate-600 font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
               >
                 <Plus className="w-4 h-4" /> Añadir Vacuna
               </button>
             </div>
          </div>
        )}

        {currentTab === 'appointments' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <SectionTitle title="Mis Citas" icon={<Calendar className="w-5 h-5" />} color="text-indigo-500" />
            <div className="space-y-4">
              {appointments.filter(a => a.petName === pet.name).length > 0 ? (
                appointments.filter(a => a.petName === pet.name).map(app => (
                  <div key={app.id} className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-2xl flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-secondary dark:text-slate-200 text-sm">{app.reason}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.date} • {app.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-xl">Confirmada</span>
                  </div>
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
           <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
              <div className="p-8 space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-secondary dark:text-slate-100">Nueva Vacuna</h3>
                    <button onClick={() => setShowAddVaccine(false)} className="p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400"><X /></button>
                 </div>
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de Vacuna</span>
                     <input type="text" placeholder="Ej. Moquillo" className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl border-none font-bold text-secondary dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Aplicación</span>
                       <input type="date" className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl border-none font-bold text-secondary dark:text-slate-200" />
                     </div>
                     <div className="space-y-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próxima Dosis</span>
                       <input type="date" className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl border-none font-bold text-secondary dark:text-slate-200" />
                     </div>
                   </div>
                 </div>
                 <button onClick={() => setShowAddVaccine(false)} className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">Guardar Registro</button>
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
                <button className="w-full py-4 bg-primary text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">Elegir Archivo</button>
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

const MedicalItem = ({ title, last, next, icon }: any) => (
  <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <div>
        <h4 className="font-black text-secondary dark:text-slate-200 text-sm leading-none">{title}</h4>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Última: {last}</span>
          <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
          <span className="text-[10px] text-primary font-black uppercase tracking-tight">Próx: {next}</span>
        </div>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-200 dark:text-slate-700" />
  </div>
);
