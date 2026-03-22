
import React from 'react';
import { Appointment, PatientRecord, FinancialTransaction } from '../types';
import { Star, Calendar, Users, TrendingUp, CheckCircle, ChevronRight, Wallet } from 'lucide-react';

interface Props {
  appointments: Appointment[];
  patients: PatientRecord[];
  transactions: FinancialTransaction[];
  onNavigate: (tab: string) => void;
}

const todayDate = new Date();
const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth()+1).padStart(2,'0')}-${String(todayDate.getDate()).padStart(2,'0')}`;

export const VetDashboard: React.FC<Props> = ({ appointments, patients, transactions, onNavigate }) => {
  const todayAppts    = appointments.filter(a => a.date === todayStr);
  const pendingAppts  = todayAppts.filter(a => a.status === 'Pending' || a.status === 'InProgress');
  const completedAll  = appointments.filter(a => a.status === 'Completed').length;
  const successRate   = appointments.length > 0 ? Math.round((completedAll / appointments.length) * 100) : 92;
  const monthIncome   = transactions.filter(t => {
    const d = new Date(t.date + 'T00:00:00');
    return d.getMonth() === todayDate.getMonth() && d.getFullYear() === todayDate.getFullYear() && t.type === 'income';
  }).reduce((s, t) => s + t.amount, 0);

  const upcomingAppts = appointments
    .filter(a => a.status !== 'Completed' && a.status !== 'Cancelled')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 3);

  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Doctor Hero */}
      <section className="bg-secondary dark:bg-slate-900 p-8 rounded-5xl text-white shadow-2xl relative overflow-hidden transition-colors">
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-2xl font-black">¡Hola, Dr. Alejandro!</h2>
            <p className="text-white/60 text-sm font-medium">
              Clínica San Roque · {todayDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            </p>
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
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=200"
            className="w-20 h-20 rounded-4xl border-4 border-white/20 object-cover shadow-2xl"
            alt="Dr Profile"
          />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Citas Hoy"
          value={String(todayAppts.length || 0)}
          sub={`${pendingAppts.length} Pendientes`}
          icon={<Calendar className="text-primary" />}
          onClick={() => onNavigate('appointments')}
        />
        <StatCard
          title="Pacientes"
          value={String(patients.length || 0)}
          sub={`${patients.filter(p=>p.status==='Active').length} Activos`}
          icon={<Users className="text-blue-500" />}
          onClick={() => onNavigate('patients')}
        />
        <StatCard
          title="Completadas"
          value={`${successRate}%`}
          sub="Tasa de éxito"
          icon={<TrendingUp className="text-emerald-500" />}
        />
        <StatCard
          title="Balance"
          value={fmt(monthIncome)}
          sub="Ingresos Mes"
          icon={<Wallet className="text-amber-500" />}
          onClick={() => onNavigate('financials')}
        />
      </div>

      {/* Upcoming appointments */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-black text-secondary dark:text-slate-100">Próximas Citas</h3>
          <button onClick={() => onNavigate('appointments')} className="text-primary text-xs font-black uppercase tracking-widest">
            Ver Todo
          </button>
        </div>
        {upcomingAppts.length === 0 ? (
          <div className="bg-white dark:bg-darkCard p-8 rounded-5xl text-center shadow-sm">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-black text-slate-400">Sin citas próximas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppts.map(app => (
              <div
                key={app.id}
                onClick={() => onNavigate('appointments')}
                className="bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group cursor-pointer"
              >
                <div className="relative shrink-0">
                  <img src={app.petImageUrl} className="w-16 h-16 rounded-3xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={app.petName} />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${app.status === 'Confirmed' ? 'bg-emerald-500' : app.status === 'InProgress' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-secondary dark:text-slate-200 text-base leading-none">{app.petName}</h4>
                    <span className="text-primary text-xs font-black shrink-0 ml-2">{app.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">{app.reason} · {app.ownerName}</p>
                  {app.date !== todayStr && (
                    <p className="text-[9px] text-slate-300 font-bold mt-1">{new Date(app.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  )}
                </div>
                <div className="w-10 h-10 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center text-secondary dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon, onClick }: any) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm flex flex-col gap-3 transition-all ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}`}
  >
    <div className="w-10 h-10 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-inner">
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
    </div>
    <div>
      <h4 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">{title}</h4>
      <span className="text-2xl font-black text-secondary dark:text-slate-100">{value}</span>
      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1">{sub}</p>
    </div>
  </div>
);
