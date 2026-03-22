
import React, { useState, useRef } from 'react';
import { Appointment, FinancialTransaction } from '../types';
import {
  Calendar as CalendarIcon,
  List,
  ChevronLeft,
  ChevronRight,
  FileText,
  Pill,
  Upload,
  CheckCircle,
  X,
  Info,
  CalendarDays,
  DollarSign,
  Paperclip,
} from 'lucide-react';

interface Props {
  appointments: Appointment[];
  onUpdateAppointment: (a: Appointment) => void;
  onAddTransaction: (t: FinancialTransaction) => void;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string; textColor: string }> = {
  Confirmed:  { label: 'Confirmada',   dot: 'bg-emerald-500', bg: 'bg-emerald-50',  textColor: 'text-emerald-700' },
  Pending:    { label: 'En Espera',    dot: 'bg-amber-400',   bg: 'bg-amber-50',    textColor: 'text-amber-700'   },
  InProgress: { label: 'En Consulta', dot: 'bg-blue-500',    bg: 'bg-blue-50',     textColor: 'text-blue-700'    },
  Completed:  { label: 'Completada',  dot: 'bg-slate-400',   bg: 'bg-slate-100',   textColor: 'text-slate-600'   },
  Cancelled:  { label: 'Cancelada',   dot: 'bg-rose-500',    bg: 'bg-rose-50',     textColor: 'text-rose-700'    },
  NoShow:     { label: 'No Asistió',  dot: 'bg-orange-400',  bg: 'bg-orange-50',   textColor: 'text-orange-700'  },
};

const MONTH_NAMES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES = ['D','L','M','X','J','V','S'];

const todayDate = new Date();
const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth()+1).padStart(2,'0')}-${String(todayDate.getDate()).padStart(2,'0')}`;

export const VetAppointments: React.FC<Props> = ({ appointments, onUpdateAppointment, onAddTransaction }) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [calYear, setCalYear] = useState(todayDate.getFullYear());
  const [calMonth, setCalMonth] = useState(todayDate.getMonth());
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [consultationFee, setConsultationFee] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  const daysWithAppts = new Set(
    appointments
      .filter(a => {
        const d = new Date(a.date + 'T00:00:00');
        return d.getFullYear() === calYear && d.getMonth() === calMonth && a.status !== 'Cancelled';
      })
      .map(a => new Date(a.date + 'T00:00:00').getDate())
  );

  const selectedDateAppts = appointments.filter(a => a.date === selectedDate);
  const todayAppts = appointments.filter(a => a.date === todayStr);
  const upcomingAppts = appointments
    .filter(a => a.date > todayStr && a.status !== 'Cancelled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const handlePrevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const handleDayClick = (day: number) => {
    const date = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    setSelectedDate(date);
  };

  const openDetail = (app: Appointment) => {
    setSelectedApp(app);
    setNotes(app.notes || '');
    setPrescription(app.prescription || '');
    setUploadedFile(null);
  };

  const doFinalize = (fee: number) => {
    if (!selectedApp) return;
    const updated: Appointment = { ...selectedApp, status: 'Completed', notes, prescription, consultationFee: fee };
    onUpdateAppointment(updated);
    if (fee > 0) {
      const now = new Date();
      onAddTransaction({
        id: `t-${Date.now()}`,
        date: selectedApp.date,
        time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
        description: `Consulta: ${selectedApp.petName} - ${selectedApp.reason}`,
        amount: fee,
        type: 'income',
        category: 'consultation',
        appointmentId: selectedApp.id,
        patientName: selectedApp.petName,
      });
    }
    setShowPaymentModal(false);
    setConsultationFee('');
    setSelectedApp(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-secondary">Agenda</h2>
          <p className="text-xs text-slate-400 font-medium">Gestión de citas diarias</p>
        </div>
        <div className="bg-white p-1 rounded-2xl border border-white shadow-sm flex">
          <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-300'}`}>
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-300'}`}>
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="space-y-4">
          {/* Calendar */}
          <div className="bg-white p-6 rounded-5xl border border-white shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-secondary capitalize">{MONTH_NAMES_ES[calMonth]} {calYear}</h3>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 bg-crema rounded-xl text-secondary"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={handleNextMonth} className="p-2 bg-crema rounded-xl text-secondary"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {DAY_NAMES.map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase py-1">{d}</div>)}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const hasAppts = daysWithAppts.has(day);
                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold relative cursor-pointer transition-all
                      ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : isToday ? 'bg-primary/10 text-primary' : 'hover:bg-crema text-secondary'}`}
                  >
                    {day}
                    {hasAppts && (
                      <div className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Appointments for selected day */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="h-[2px] flex-1 bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest capitalize">{formatDate(selectedDate)}</span>
              <div className="h-[2px] flex-1 bg-slate-100" />
            </div>
            {selectedDateAppts.length === 0 ? <EmptyState /> : selectedDateAppts.map(a => <AppCard key={a.id} app={a} onClick={() => openDetail(a)} />)}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-[2px] flex-1 bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hoy · {todayDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
            <div className="h-[2px] flex-1 bg-slate-100" />
          </div>
          {todayAppts.length === 0 ? <EmptyState /> : todayAppts.map(a => <AppCard key={a.id} app={a} onClick={() => openDetail(a)} />)}

          {upcomingAppts.length > 0 && (
            <>
              <div className="flex items-center gap-3 px-2 pt-2">
                <div className="h-[2px] flex-1 bg-slate-100" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Próximas</span>
                <div className="h-[2px] flex-1 bg-slate-100" />
              </div>
              {upcomingAppts.map(a => <AppCard key={a.id} app={a} onClick={() => openDetail(a)} />)}
            </>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && !showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-crema w-full max-w-lg rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 flex justify-between items-start border-b border-slate-100 bg-white">
              <div className="flex items-center gap-4">
                <img src={selectedApp.petImageUrl} className="w-16 h-16 rounded-3xl object-cover shadow-lg border-2 border-white" />
                <div>
                  <h3 className="text-xl font-black text-secondary">{selectedApp.petName}</h3>
                  <p className="text-xs text-slate-400 font-bold">Dueño: {selectedApp.ownerName}</p>
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto flex-1 no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-4xl shadow-sm">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Motivo</span>
                  <span className="text-sm font-black text-secondary">{selectedApp.reason}</span>
                </div>
                <div className="bg-white p-5 rounded-4xl shadow-sm">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Horario</span>
                  <span className="text-sm font-black text-primary">{selectedApp.time}</span>
                </div>
              </div>

              <div className="space-y-3">
                <SectionTitle title="Notas Médicas" icon={<FileText />} />
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Escribe aquí las observaciones clínicas..."
                  className="w-full h-28 p-5 bg-white rounded-4xl border-2 border-transparent focus:border-primary/20 focus:outline-none text-sm font-medium text-secondary resize-none shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <SectionTitle title="Medicamento Recetado" icon={<Pill />} />
                <input
                  type="text"
                  value={prescription}
                  onChange={e => setPrescription(e.target.value)}
                  placeholder="Nombre del fármaco y dosis..."
                  className="w-full p-5 bg-white rounded-4xl border-2 border-transparent focus:border-primary/20 focus:outline-none text-sm font-bold text-secondary shadow-sm"
                />
              </div>

              <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if (f) setUploadedFile(f.name); }} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 rounded-4xl border-2 flex flex-col items-center justify-center gap-2 group transition-all ${uploadedFile ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-dashed border-slate-200 hover:border-primary/30'}`}
                >
                  {uploadedFile ? (
                    <>
                      <Paperclip className="w-6 h-6 text-emerald-500" />
                      <span className="text-[9px] font-black text-emerald-600 uppercase text-center leading-tight">{uploadedFile.length > 14 ? uploadedFile.slice(0, 14) + '…' : uploadedFile}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">Subir Estudio</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={selectedApp.status === 'Completed' || selectedApp.status === 'Cancelled'}
                  className="bg-secondary text-white p-6 rounded-4xl flex flex-col items-center justify-center gap-2 hover:bg-primary transition-all shadow-xl shadow-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {selectedApp.status === 'Completed' ? 'Completada' : 'Finalizar'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedApp && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-t-5xl sm:rounded-5xl shadow-2xl">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-secondary">Cobro de Consulta</h3>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 bg-crema rounded-xl text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Ingresa el monto cobrado por la consulta de <span className="font-black text-secondary">{selectedApp.petName}</span>.
              </p>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monto (MXN)</span>
                <div className="flex items-center bg-crema rounded-3xl px-5 gap-2">
                  <DollarSign className="w-5 h-5 text-primary shrink-0" />
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={e => setConsultationFee(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 py-4 bg-transparent font-black text-2xl text-secondary outline-none"
                    autoFocus
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => doFinalize(0)} className="py-4 bg-slate-100 text-secondary rounded-3xl font-black text-sm hover:bg-slate-200 transition-all">
                  Sin cobro
                </button>
                <button onClick={() => doFinalize(parseFloat(consultationFee) || 0)} className="py-4 bg-primary text-white rounded-3xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-secondary transition-all">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AppCard: React.FC<{ app: Appointment; onClick: () => void }> = ({ app, onClick }) => {
  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
  return (
    <div onClick={onClick} className="bg-white p-6 rounded-5xl border border-white shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group cursor-pointer">
      <div className="relative shrink-0">
        <img src={app.petImageUrl} className="w-16 h-16 rounded-3xl object-cover shadow-md group-hover:scale-105 transition-transform" alt={app.petName} />
        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
          <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-black text-secondary text-base">{app.petName}</h4>
          <span className="text-primary text-xs font-black shrink-0 ml-2">{app.time}</span>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{app.reason} · {app.ownerName}</p>
        <span className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${cfg.bg} ${cfg.textColor}`}>
          <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>
      <div className="w-10 h-10 bg-crema rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
        <Info className="w-5 h-5" />
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-14 gap-4">
    <div className="w-20 h-20 bg-crema rounded-5xl flex items-center justify-center">
      <CalendarDays className="w-10 h-10 text-slate-300" />
    </div>
    <div className="text-center">
      <h4 className="font-black text-secondary text-base">Sin citas para este día</h4>
      <p className="text-sm text-slate-400 font-medium mt-1 max-w-xs">No tienes citas agendadas. Disfruta tu tiempo libre.</p>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${cfg.bg} ${cfg.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const SectionTitle = ({ title, icon }: any) => (
  <div className="flex items-center gap-3 px-1">
    <div className="text-primary">{React.cloneElement(icon, { className: 'w-4 h-4' })}</div>
    <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{title}</h4>
  </div>
);
