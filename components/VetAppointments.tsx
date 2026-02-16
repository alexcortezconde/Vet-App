
import React, { useState } from 'react';
import { Appointment } from '../types';
import { 
  Calendar as CalendarIcon, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  FileText, 
  Pill, 
  Upload, 
  CheckCircle, 
  X,
  User,
  Info
} from 'lucide-react';

const mockAppointments: Appointment[] = [
  { id: '1', petName: 'Bruno', ownerName: 'Juan Pérez', petImageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400', reason: 'Vacuna Rabia', time: '09:00 AM', date: '2024-05-15', status: 'Confirmed' },
  { id: '2', petName: 'Luna', ownerName: 'Ana García', petImageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400', reason: 'Control Anual', time: '10:30 AM', date: '2024-05-15', status: 'Confirmed' },
  { id: '3', petName: 'Max', ownerName: 'Carlos Ruiz', petImageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400', reason: 'Alergia Cutánea', time: '12:00 PM', date: '2024-05-15', status: 'Pending' },
  { id: '4', petName: 'Bella', ownerName: 'Laura M.', petImageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400', reason: 'Desparasitación', time: '02:00 PM', date: '2024-05-15', status: 'Confirmed' }
];

export const VetAppointments: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);

  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-secondary">Agenda</h2>
          <p className="text-xs text-slate-400 font-medium">Gestión de citas diarias</p>
        </div>
        <div className="bg-white p-1 rounded-2xl border border-white shadow-sm flex">
          <button 
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-300'}`}
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-300'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="bg-white p-8 rounded-5xl border border-white shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-secondary">Mayo 2024</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-crema rounded-xl text-secondary"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-2 bg-crema rounded-xl text-secondary"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase">{d}</div>)}
            {calendarDays.map(d => (
              <div key={d} className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xs font-bold relative cursor-pointer hover:bg-crema transition-colors ${d === 15 ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-secondary'}`}>
                {d}
                {d % 7 === 0 && <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></div>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4 px-2">
            <div className="h-[2px] flex-1 bg-slate-100"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hoy, 15 de Mayo</span>
            <div className="h-[2px] flex-1 bg-slate-100"></div>
          </div>
          {mockAppointments.map(app => (
            <AppointmentCard 
              key={app.id} 
              app={app} 
              onClick={() => setSelectedApp(app)} 
            />
          ))}
        </div>
      )}

      {/* Modal de Detalle de Cita */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-crema w-full max-w-lg rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 flex justify-between items-start border-b border-slate-100 bg-white">
              <div className="flex items-center gap-4">
                <img src={selectedApp.petImageUrl} className="w-16 h-16 rounded-3xl object-cover shadow-lg border-2 border-white" />
                <div>
                  <h3 className="text-xl font-black text-secondary">{selectedApp.petName}</h3>
                  <p className="text-xs text-slate-400 font-bold">Dueño: {selectedApp.ownerName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto flex-1 no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-4xl border border-white shadow-sm">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Motivo</span>
                  <span className="text-sm font-black text-secondary">{selectedApp.reason}</span>
                </div>
                <div className="bg-white p-5 rounded-4xl border border-white shadow-sm">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Horario</span>
                  <span className="text-sm font-black text-primary">{selectedApp.time}</span>
                </div>
              </div>

              <div className="space-y-4">
                <SectionTitle title="Notas Médicas" icon={<FileText />} />
                <textarea 
                  placeholder="Escribe aquí las observaciones clínicas..."
                  className="w-full h-32 p-6 bg-white rounded-4xl border-2 border-transparent focus:border-primary/20 focus:outline-none text-sm font-medium text-secondary resize-none shadow-sm"
                />
              </div>

              <div className="space-y-4">
                <SectionTitle title="Medicamento Recetado" icon={<Pill />} />
                <input 
                  type="text"
                  placeholder="Nombre del fármaco y dosis..."
                  className="w-full p-5 bg-white rounded-4xl border-2 border-transparent focus:border-primary/20 focus:outline-none text-sm font-bold text-secondary shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white p-6 rounded-4xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group hover:border-primary/20 transition-all">
                  <Upload className="w-6 h-6 text-slate-300 group-hover:text-primary" />
                  <span className="text-[10px] font-black text-slate-400 uppercase">Subir Estudio</span>
                </button>
                <button className="bg-secondary text-white p-6 rounded-4xl flex flex-col items-center justify-center gap-2 hover:bg-primary transition-all shadow-xl shadow-secondary/10">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Finalizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AppointmentCard = ({ app, onClick }: { app: Appointment; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-5xl border border-white shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group cursor-pointer"
  >
    <div className="relative">
      <img src={app.petImageUrl} className="w-16 h-16 rounded-3xl object-cover shadow-md group-hover:scale-105 transition-transform" alt={app.petName} />
      <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
        <div className={`w-3 h-3 rounded-full ${app.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
      </div>
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-black text-secondary text-base">{app.petName}</h4>
        <span className="text-primary text-xs font-black">{app.time}</span>
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.reason} • {app.ownerName}</p>
    </div>
    <div className="w-10 h-10 bg-crema rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all">
      <Info className="w-5 h-5" />
    </div>
  </div>
);

const SectionTitle = ({ title, icon }: any) => (
  <div className="flex items-center gap-3 px-1">
    <div className="text-primary">{React.cloneElement(icon, { className: 'w-4 h-4' })}</div>
    <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{title}</h4>
  </div>
);
