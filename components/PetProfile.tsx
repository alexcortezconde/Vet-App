
import React, { useState } from 'react';
import { Pet } from '../types';
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
  FileSearch
} from 'lucide-react';

interface PetProfileProps {
  pet: Pet;
}

export const PetProfile: React.FC<PetProfileProps> = ({ pet }) => {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'medical' | 'docs'>('info');

  return (
    <div className="relative -mt-10 pb-10 space-y-6 animate-in fade-in duration-700">
      {/* Profile Header - Imagen Circular Gigante */}
      <div className="relative w-full h-[450px] overflow-hidden rounded-b-5xl">
        <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover blur-sm opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-crema via-crema/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-2 bg-white rounded-full shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500">
              <img 
                src={pet.imageUrl} 
                alt={pet.name} 
                className="w-48 h-48 rounded-full object-cover border-8 border-crema"
              />
              <button className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-full shadow-xl border-4 border-white">
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-4xl font-black text-secondary tracking-tighter">¡Hola, {pet.name}!</h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="bg-secondary text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{pet.breed}</span>
              <span className="bg-primary/10 text-primary border border-primary/20 px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{pet.age} años</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Navegación del Perfil */}
      <div className="px-1 space-y-8">
        <div className="flex bg-white/60 backdrop-blur-xl p-2 rounded-4xl border border-white/50 shadow-xl">
          <TabButton active={activeSubTab === 'info'} onClick={() => setActiveSubTab('info')} label="DATOS" />
          <TabButton active={activeSubTab === 'medical'} onClick={() => setActiveSubTab('medical')} label="MÉDICO" />
          <TabButton active={activeSubTab === 'docs'} onClick={() => setActiveSubTab('docs')} label="RECETAS" />
        </div>

        {activeSubTab === 'info' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            {/* Datos Básicos */}
            <SectionTitle title="Información General" icon={<User className="w-5 h-5" />} />
            <div className="grid grid-cols-2 gap-4">
               <InfoCard label="Sexo" value={pet.sex === 'Male' ? 'Macho' : 'Hembra'} />
               <InfoCard label="Peso Actual" value={`${pet.weight} kg`} />
               <InfoCard label="Microchip" value="Nº 9283-X1" />
               <InfoCard label="Seguro" value="VetCare Gold" />
            </div>

            {/* Alergias y Crónicas */}
            <SectionTitle title="Alergias y Condiciones" icon={<AlertCircle className="w-5 h-5" />} color="text-rose-500" />
            <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-4xl space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Alergias Detectadas</span>
                <div className="flex flex-wrap gap-2">
                  {pet.allergies.map(a => (
                    <span key={a} className="bg-white px-3 py-1 rounded-xl text-xs font-bold text-rose-600 border border-rose-100">{a}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-secondary/60 uppercase tracking-widest">Condiciones Crónicas</span>
                <div className="flex flex-wrap gap-2">
                  {pet.chronicConditions.map(c => (
                    <span key={c} className="bg-secondary/5 px-3 py-1 rounded-xl text-xs font-bold text-secondary">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'medical' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
             {/* Vacunas */}
             <SectionTitle title="Seguimiento de Vacunas" icon={<ShieldCheck className="w-5 h-5" />} color="text-emerald-500" />
             <div className="space-y-3">
               {pet.vaccines.map((v, i) => (
                 <MedicalItem key={i} title={v.name} last={v.date} next={v.nextDue} icon={<Syringe />} />
               ))}
               <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-4xl text-slate-400 font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                 <Plus className="w-4 h-4" /> Añadir Vacuna
               </button>
             </div>

             {/* Desparasitación */}
             <SectionTitle title="Desparasitación" icon={<Layers className="w-5 h-5" />} color="text-blue-500" />
             <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-6 rounded-4xl border border-white shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><Pill className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-black text-secondary text-sm">Interna</h4>
                      <p className="text-[10px] text-slate-400 font-bold">Próxima: {pet.deworming.internal.next}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-200" />
                </div>
                <div className="bg-white p-6 rounded-4xl border border-white shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><Layers className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-black text-secondary text-sm">Externa</h4>
                      <p className="text-[10px] text-slate-400 font-bold">Próxima: {pet.deworming.external.next}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-200" />
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'docs' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <SectionTitle title="Historial de Documentos" icon={<FileSearch className="w-5 h-5" />} />
            <div className="space-y-3">
              {pet.documents.map(doc => (
                <div key={doc.id} className="bg-white p-6 rounded-4xl border border-white shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-crema rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-secondary text-sm">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.type} • {doc.date}</p>
                    </div>
                  </div>
                  <button className="bg-secondary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Ver</button>
                </div>
              ))}
              <div className="p-10 border-4 border-dashed border-crema rounded-5xl flex flex-col items-center text-center gap-4 group hover:border-primary/20 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-crema rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-primary opacity-40" />
                </div>
                <div>
                  <h4 className="font-black text-secondary">Sube una nueva receta</h4>
                  <p className="text-xs text-slate-400 font-medium px-10">Puedes subir fotos de recetas físicas o archivos PDF de estudios.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 text-[11px] font-black rounded-3xl transition-all tracking-[0.15em] ${active ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-secondary/40'}`}
  >
    {label}
  </button>
);

const SectionTitle = ({ title, icon, color = 'text-primary' }: any) => (
  <div className="flex items-center gap-3 px-2">
    <div className={`${color}`}>{icon}</div>
    <h3 className="text-xl font-extrabold text-secondary">{title}</h3>
  </div>
);

const InfoCard = ({ label, value }: any) => (
  <div className="bg-white p-5 rounded-4xl border border-white shadow-sm">
    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">{label}</span>
    <span className="text-sm font-black text-secondary">{value}</span>
  </div>
);

const MedicalItem = ({ title, last, next, icon }: any) => (
  <div className="bg-white p-6 rounded-4xl border border-white shadow-sm flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 bg-crema rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <div>
        <h4 className="font-black text-secondary text-sm leading-none">{title}</h4>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-slate-400 font-bold">Última: {last}</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <span className="text-[10px] text-primary font-black uppercase tracking-tight">Próx: {next}</span>
        </div>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-200" />
  </div>
);
