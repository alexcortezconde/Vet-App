
import React, { useState } from 'react';
import { Appointment, PatientRecord, FinancialTransaction } from '../types';
import { Star, Calendar, Users, TrendingUp, CheckCircle, ChevronRight, Wallet, X, FileText, Pill, Clock } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../services/i18n';

interface Props {
  appointments: Appointment[];
  patients: PatientRecord[];
  transactions: FinancialTransaction[];
  onNavigate: (tab: string) => void;
}

const STATUS_CONFIG: Record<string, { label_es: string; label_en: string; dot: string; bg: string; textColor: string }> = {
  Confirmed:  { label_es: 'Confirmada',   label_en: 'Confirmed',       dot: 'bg-emerald-500', bg: 'bg-emerald-50',  textColor: 'text-emerald-700' },
  Pending:    { label_es: 'En Espera',    label_en: 'Waiting',         dot: 'bg-amber-400',   bg: 'bg-amber-50',    textColor: 'text-amber-700'   },
  InProgress: { label_es: 'En Consulta', label_en: 'In Consultation',  dot: 'bg-blue-500',    bg: 'bg-blue-50',     textColor: 'text-blue-700'    },
  Completed:  { label_es: 'Completada',  label_en: 'Completed',        dot: 'bg-slate-400',   bg: 'bg-slate-100',   textColor: 'text-slate-600'   },
  Cancelled:  { label_es: 'Cancelada',   label_en: 'Cancelled',        dot: 'bg-rose-500',    bg: 'bg-rose-50',     textColor: 'text-rose-700'    },
  NoShow:     { label_es: 'No Asistió',  label_en: 'No Show',          dot: 'bg-orange-400',  bg: 'bg-orange-50',   textColor: 'text-orange-700'  },
};

const todayDate = new Date();
const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth()+1).padStart(2,'0')}-${String(todayDate.getDate()).padStart(2,'0')}`;

export const VetDashboard: React.FC<Props> = ({ appointments, patients, transactions, onNavigate }) => {
  const { lang } = useLang();
  const T = translations[lang];
  const [detailAppt, setDetailAppt] = useState<Appointment | null>(null);

  const todayAppts   = appointments.filter(a => a.date === todayStr);
  const pendingAppts = todayAppts.filter(a => a.status === 'Pending' || a.status === 'InProgress');
  const completedAll = appointments.filter(a => a.status === 'Completed').length;
  const successRate  = appointments.length > 0 ? Math.round((completedAll / appointments.length) * 100) : 92;
  const monthIncome  = transactions.filter(t => {
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
            <h2 className="text-2xl font-black">{lang === 'en' ? 'Hello, Dr. Alejandro!' : '¡Hola, Dr. Alejandro!'}</h2>
            <p className="text-white/60 text-sm font-medium">
              {T.dashClinic} · {todayDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long' })}
            </p>
            <div className="flex gap-2 mt-4">
              <div className="bg-white/10 px-4 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-xs font-black">4.9 Score</span>
              </div>
              <div className="bg-emerald-500/20 px-4 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black text-emerald-400">{T.dashVerified}</span>
              </div>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="w-20 h-20 rounded-4xl border-4 border-white/20 object-cover shadow-2xl"
            alt="Dr Profile"
          />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title={T.dashApptToday}
          value={String(todayAppts.length)}
          sub={`${pendingAppts.length} ${T.dashPending}`}
          icon={<Calendar className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          onClick={() => onNavigate('appointments')}
        />
        <StatCard
          title={T.dashPatients}
          value={String(patients.length)}
          sub={`${patients.filter(p => p.status === 'Active').length} ${T.dashActive}`}
          icon={<Users className="w-5 h-5 text-blue-500" />}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          onClick={() => onNavigate('patients')}
        />
        <StatCard
          title={T.dashCompleted}
          value={`${successRate}%`}
          sub={T.dashSuccessRate}
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title={T.dashBalance}
          value={fmt(monthIncome)}
          sub={T.dashMonthIncome}
          icon={<Wallet className="w-5 h-5 text-amber-500" />}
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          onClick={() => onNavigate('financials')}
        />
      </div>

      {/* Upcoming appointments */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-black text-secondary dark:text-slate-100">{T.dashUpcomingTitle}</h3>
          <button onClick={() => onNavigate('appointments')} className="text-primary text-xs font-black uppercase tracking-widest">
            {T.seeAll}
          </button>
        </div>
        {upcomingAppts.length === 0 ? (
          <div className="bg-white dark:bg-darkCard p-8 rounded-5xl text-center shadow-sm">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-black text-slate-400">{T.dashNoUpcoming}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppts.map(app => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
              const statusLabel = lang === 'en' ? cfg.label_en : cfg.label_es;
              return (
                <div
                  key={app.id}
                  onClick={() => setDetailAppt(app)}
                  className="bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <img src={app.petImageUrl} className="w-16 h-16 rounded-3xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={app.petName} />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-0.5 rounded-full shadow-sm">
                      <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-secondary dark:text-slate-200 text-base leading-none">{app.petName}</h4>
                      <span className="text-primary text-xs font-black shrink-0 ml-2">{app.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">{app.reason} · {app.ownerName}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${cfg.bg} ${cfg.textColor}`}>
                        <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                        {statusLabel}
                      </span>
                      {app.date !== todayStr && (
                        <span className="text-[9px] text-slate-300 font-bold capitalize">
                          {new Date(app.date + 'T00:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center text-secondary dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Appointment Detail Mini-Modal */}
      {detailAppt && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-sm rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={detailAppt.petImageUrl} className="w-14 h-14 rounded-3xl object-cover shadow-md border-2 border-crema" />
                <div>
                  <h3 className="text-lg font-black text-secondary dark:text-slate-100">{detailAppt.petName}</h3>
                  <p className="text-xs text-slate-400 font-bold">{lang === 'en' ? 'Owner' : 'Dueño'}: {detailAppt.ownerName}</p>
                  {(() => {
                    const cfg = STATUS_CONFIG[detailAppt.status] || STATUS_CONFIG.Pending;
                    return (
                      <span className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${cfg.bg} ${cfg.textColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {lang === 'en' ? cfg.label_en : cfg.label_es}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <button onClick={() => setDetailAppt(null)} className="p-2 bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InfoTile label={lang === 'en' ? 'Reason' : 'Motivo'} value={detailAppt.reason} icon={<FileText className="w-4 h-4 text-primary" />} />
                <InfoTile label={lang === 'en' ? 'Time' : 'Horario'} value={detailAppt.time} icon={<Clock className="w-4 h-4 text-primary" />} />
              </div>
              <InfoTile
                label={lang === 'en' ? 'Date' : 'Fecha'}
                value={new Date(detailAppt.date + 'T00:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                icon={<Calendar className="w-4 h-4 text-primary" />}
                capitalize
              />
              {detailAppt.notes && (
                <InfoTile label={lang === 'en' ? 'Notes' : 'Notas'} value={detailAppt.notes} icon={<FileText className="w-4 h-4 text-primary" />} />
              )}
              {detailAppt.prescription && (
                <InfoTile label={lang === 'en' ? 'Prescription' : 'Receta'} value={detailAppt.prescription} icon={<Pill className="w-4 h-4 text-primary" />} />
              )}
              <button onClick={() => { setDetailAppt(null); onNavigate('appointments'); }} className="w-full py-4 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20">
                {lang === 'en' ? 'Open in Schedule' : 'Abrir en Agenda'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, sub, icon, iconBg, onClick }: any) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm flex flex-col gap-3 transition-all ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}`}
  >
    <div className={`w-10 h-10 ${iconBg || 'bg-crema dark:bg-slate-700'} rounded-2xl flex items-center justify-center shadow-inner`}>
      {icon}
    </div>
    <div>
      <h4 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">{title}</h4>
      <span className="text-2xl font-black text-secondary dark:text-slate-100">{value}</span>
      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1">{sub}</p>
    </div>
  </div>
);

const InfoTile = ({ label, value, icon, capitalize = false }: any) => (
  <div className="bg-crema dark:bg-slate-800 p-4 rounded-3xl">
    <div className="flex items-center gap-2 mb-1">{icon}<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span></div>
    <p className={`text-sm font-black text-secondary dark:text-slate-200 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
  </div>
);
