
import React from 'react';
import { Appointment } from '../types';
import { Star, Calendar, Users, TrendingUp, CheckCircle, Clock, ChevronRight, Wallet, MapPin } from 'lucide-react';

const mockAppointments: Appointment[] = [
  { id: '1', petName: 'Bruno', ownerName: 'Juan Pérez', petImageUrl: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?auto=format&fit=crop&q=80&w=200', reason: 'Vacuna Rabia', time: '09:00 AM', date: 'Hoy', status: 'Confirmed' },
  { id: '2', petName: 'Luna', ownerName: 'Ana García', petImageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200', reason: 'Control Anual', time: '10:30 AM', date: 'Hoy', status: 'Confirmed' },
  { id: '3', petName: 'Max', ownerName: 'Carlos Ruiz', petImageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200', reason: 'Chequeo de Alergia', time: '12:00 PM', date: 'Hoy', status: 'Pending' }
];

export const VetDashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Saludo y Perfil de Doctor */}
      <section className="bg-secondary dark:bg-slate-900 p-8 rounded-5xl text-white shadow-2xl relative overflow-hidden transition-colors">
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-2xl font-black">¡Hola, Dr. Alejandro!</h2>
            <p className="text-white/60 text-sm font-medium">Clínica San Roque • {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
            
            <div className="flex gap-2 mt-4">
               <div className="bg-white/10 px-4 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md">
                 <Star className="w-4 h-4 text-accent fill-accent" />
                 <span className="text-xs font-black">4.9 Score</span>
               </div>
               <div className="bg-emerald-500/20 px-4 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md">
                 <CheckCircle className="w-4 h-4 text-emerald-400" />
                 <span className="text-xs font-black text-emerald-400">Verificado</span>
               </div>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=200" className="w-20 h-20 rounded-4xl border-4 border-white/20 object-cover shadow-2xl" alt="Dr Profile" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </section>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Citas Hoy" value="8" sub="2 Pendientes" icon={<Calendar className="text-primary" />} />
        <StatCard title="Pacientes" value="124" sub="+12 este mes" icon={<Users className="text-blue-500" />} />
        <StatCard title="Completadas" value="92%" sub="Tasa de éxito" icon={<TrendingUp className="text-emerald-500" />} />
        <StatCard title="Balance" value="$4.2k" sub="Ingresos Mes" icon={<Wallet className="text-amber-500" />} />
      </div>

      {/* Próximas Citas - Información Detallada */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-black text-secondary dark:text-slate-100">Próximas Citas</h3>
          <button className="text-primary text-xs font-black uppercase tracking-widest">Ver Todo</button>
        </div>
        <div className="space-y-4">
          {mockAppointments.map(app => (
            <div key={app.id} className="bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group cursor-pointer">
              <div className="relative">
                <img src={app.petImageUrl} className="w-16 h-16 rounded-3xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={app.petName} />
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm">
                  <div className={`w-3 h-3 rounded-full ${app.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-secondary dark:text-slate-200 text-base leading-none">{app.petName}</h4>
                  <span className="text-primary text-xs font-black">{app.time}</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">{app.reason} • {app.ownerName}</p>
              </div>
              <div className="w-10 h-10 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center text-secondary dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon }: any) => (
  <div className="bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm flex flex-col gap-3 transition-colors">
    <div className="w-10 h-10 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-inner">
      {icon}
    </div>
    <div>
      <h4 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">{title}</h4>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-secondary dark:text-slate-100">{value}</span>
      </div>
      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1">{sub}</p>
    </div>
  </div>
);
