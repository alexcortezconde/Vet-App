
import React from 'react';
import { PatientRecord } from '../types';
import { Users, Search, Filter, History, ChevronRight, Phone, FileText } from 'lucide-react';

const mockPatients: PatientRecord[] = [
  { id: '1', petName: 'Bruno', ownerName: 'Juan Pérez', lastVisit: '15/04/2024', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?auto=format&fit=crop&q=80&w=200' },
  { id: '2', petName: 'Luna', ownerName: 'Ana García', lastVisit: '10/04/2024', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200' },
  { id: '3', petName: 'Kira', ownerName: 'Luis Toro', lastVisit: '01/02/2024', status: 'Inactive', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200' }
];

export const VetPatients: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="px-2">
        <h2 className="text-2xl font-black text-secondary dark:text-slate-100">Mis Pacientes</h2>
        <p className="text-xs text-slate-400 font-medium">Base de datos de historias clínicas</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Buscar por nombre o dueño..." 
          className="w-full pl-14 pr-16 py-5 bg-white dark:bg-darkCard rounded-5xl border border-white dark:border-slate-800 shadow-sm focus:outline-none focus:shadow-xl transition-all text-sm font-bold text-secondary dark:text-slate-200"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-crema dark:bg-slate-700 text-secondary dark:text-slate-200 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {mockPatients.map(patient => (
          <div key={patient.id} className="bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group cursor-pointer">
            <div className="relative">
              <img src={patient.imageUrl} className="w-20 h-20 rounded-4xl object-cover shadow-md group-hover:scale-105 transition-transform" alt={patient.petName} />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 ${patient.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
            </div>
            <div className="flex-1 py-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-secondary dark:text-slate-100 text-lg leading-none">{patient.petName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{patient.ownerName}</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-2.5 bg-crema dark:bg-slate-700 text-secondary dark:text-slate-300 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                     <Phone className="w-4 h-4" />
                   </button>
                   <button className="p-2.5 bg-crema dark:bg-slate-700 text-secondary dark:text-slate-300 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                     <FileText className="w-4 h-4" />
                   </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <History className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Última visita: {patient.lastVisit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
