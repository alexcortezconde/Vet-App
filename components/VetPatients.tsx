
import React from 'react';
import { PatientRecord } from '../types';
import { Users, Search, Filter, History, ChevronRight } from 'lucide-react';

const mockPatients: PatientRecord[] = [
  { id: '1', petName: 'Bruno', ownerName: 'Juan Pérez', lastVisit: '15/04/2024', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=200' },
  { id: '2', petName: 'Luna', ownerName: 'Ana García', lastVisit: '10/04/2024', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200' },
  { id: '3', petName: 'Kira', ownerName: 'Luis Toro', lastVisit: '01/02/2024', status: 'Inactive', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200' }
];

export const VetPatients: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="px-2">
        <h2 className="text-2xl font-black text-secondary">Mis Pacientes</h2>
        <p className="text-xs text-slate-400 font-medium">Base de datos de historias clínicas</p>
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        <input 
          type="text" 
          placeholder="Buscar por nombre o dueño..." 
          className="w-full pl-14 pr-16 py-5 bg-white rounded-5xl border border-white shadow-sm focus:outline-none focus:shadow-xl transition-all text-sm font-bold text-secondary"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-crema text-secondary rounded-2xl hover:bg-slate-100">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {mockPatients.map(patient => (
          <div key={patient.id} className="bg-white p-6 rounded-5xl border border-white shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group cursor-pointer">
            <div className="relative">
              <img src={patient.imageUrl} className="w-16 h-16 rounded-3xl object-cover shadow-sm" alt={patient.petName} />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${patient.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            </div>
            <div className="flex-1">
              <h4 className="font-black text-secondary text-base">{patient.petName}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{patient.ownerName}</p>
              <div className="flex items-center gap-2 mt-2">
                <History className="w-3 h-3 text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Última visita: {patient.lastVisit}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};
