
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, ArrowDownRight, ArrowUpRight, Receipt, ShoppingBag, Stethoscope, MoreHorizontal, ChevronLeft } from 'lucide-react';
import { FinancialTransaction } from '../types';
import { useLang } from '../context/LanguageContext';
import { translations } from '../services/i18n';

interface Props {
  transactions: FinancialTransaction[];
}

const MONTH_NAMES_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const MONTH_NAMES_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  consultation: { label: 'Consulta',    icon: <Stethoscope className="w-4 h-4" />, color: 'text-primary',   bg: 'bg-primary/10'   },
  sale:         { label: 'Venta',       icon: <ShoppingBag className="w-4 h-4" />,  color: 'text-blue-500',  bg: 'bg-blue-50'      },
  supply:       { label: 'Insumo',      icon: <ArrowDownRight className="w-4 h-4" />, color: 'text-rose-500', bg: 'bg-rose-50'     },
  other:        { label: 'Otro',        icon: <MoreHorizontal className="w-4 h-4" />, color: 'text-slate-400', bg: 'bg-slate-100'  },
};

export const VetFinancials: React.FC<Props> = ({ transactions }) => {
  const { lang } = useLang();
  const T = translations[lang];
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance  = income - expenses;

  // Chart: last 6 months
  const today = new Date();
  const MONTH_NAMES = lang === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_ES;
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
    const y = d.getFullYear(); const m = d.getMonth();
    const monthIncome   = transactions.filter(t => { const td = new Date(t.date+'T00:00:00'); return td.getFullYear()===y && td.getMonth()===m && t.type==='income'; }).reduce((s,t)=>s+t.amount,0);
    const monthExpenses = transactions.filter(t => { const td = new Date(t.date+'T00:00:00'); return td.getFullYear()===y && td.getMonth()===m && t.type==='expense'; }).reduce((s,t)=>s+t.amount,0);
    return { name: MONTH_NAMES[m], ingresos: monthIncome, gastos: monthExpenses };
  });

  // Income sources
  const consultationTotal = transactions.filter(t => t.category==='consultation' && t.type==='income').reduce((s,t)=>s+t.amount,0);
  const saleTotal         = transactions.filter(t => t.category==='sale'         && t.type==='income').reduce((s,t)=>s+t.amount,0);
  const consultationPct   = income > 0 ? Math.round((consultationTotal/income)*100) : 0;
  const salePct           = income > 0 ? Math.round((saleTotal/income)*100) : 0;

  // Transactions (filtered by category if set)
  const filteredTx = categoryFilter
    ? transactions.filter(t => t.category === categoryFilter)
    : transactions;
  const sortedTx = [...filteredTx].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  const handleSourceClick = (cat: string) => {
    setCategoryFilter(cat);
    setActiveTab('history');
  };

  const fmt = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="px-2">
        <h2 className="text-2xl font-black text-secondary">{T.finTitle}</h2>
        <p className="text-xs text-slate-400 font-medium">{T.finSub}</p>
      </div>

      {/* Balance Hero */}
      <div className={`p-8 rounded-5xl text-white shadow-2xl ${balance >= 0 ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'}`}>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{T.finNetBalance}</span>
            <h3 className="text-4xl font-black mt-1">{fmt(balance)}</h3>
          </div>
          <div className="bg-white/20 p-3 rounded-3xl backdrop-blur-md">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase">Ingresos</span>
            </div>
            <span className="text-lg font-black">{fmt(income)}</span>
          </div>
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownRight className="w-3 h-3 text-white/70" />
              <span className="text-[9px] font-black uppercase">Gastos</span>
            </div>
            <span className="text-lg font-black">{fmt(expenses)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-2xl shadow-sm border border-white flex">
        <button onClick={() => { setActiveTab('overview'); setCategoryFilter(null); }} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='overview' ? 'bg-primary text-white shadow-md' : 'text-slate-400'}`}>{T.finOverview}</button>
        <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='history' ? 'bg-primary text-white shadow-md' : 'text-slate-400'}`}>{T.finHistory}</button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Chart */}
          <section className="bg-white p-8 rounded-5xl border border-white shadow-sm">
            <h4 className="text-sm font-black text-secondary mb-6 uppercase tracking-widest">{T.finCashFlow}</h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#cbd5e1' }} dy={10} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgb(0 0 0 / 0.1)', fontSize: 12, fontWeight: 700 }} formatter={(v: any) => [`$${v.toLocaleString()}`, '']} />
                  <Bar dataKey="ingresos" name="Ingresos" radius={[6,6,6,6]} barSize={10}>
                    {chartData.map((_, i) => <Cell key={i} fill="#1B3B36" />)}
                  </Bar>
                  <Bar dataKey="gastos" name="Gastos" radius={[6,6,6,6]} barSize={10}>
                    {chartData.map((_, i) => <Cell key={i} fill="#FF7A59" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2 justify-center">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-secondary" /><span className="text-[10px] font-black text-slate-400">Ingresos</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-accent" /><span className="text-[10px] font-black text-slate-400">Gastos</span></div>
            </div>
          </section>

          {/* Sources */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-secondary px-2 uppercase tracking-widest">{T.finIncomeSources}</h4>
            {income === 0 ? (
              <div className="bg-white p-8 rounded-5xl text-center text-slate-400 text-sm font-bold shadow-sm">{T.finNoIncome}</div>
            ) : (
              <>
                <SourceRow label={T.finConsultations} pct={consultationPct} amount={consultationTotal} icon={<Stethoscope />} color="text-primary" bg="bg-primary/10" totalLabel={T.finTotal} onClick={() => handleSourceClick('consultation')} />
                <SourceRow label={T.finSales}          pct={salePct}         amount={saleTotal}         icon={<ShoppingBag />}  color="text-blue-500" bg="bg-blue-50"    totalLabel={T.finTotal} onClick={() => handleSourceClick('sale')} />
              </>
            )}
          </div>
        </>
      ) : (
        /* History */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-black text-secondary uppercase tracking-widest">{T.finRecentMovements}</h4>
            {categoryFilter && (
              <button onClick={() => setCategoryFilter(null)} className="flex items-center gap-1 text-[10px] font-black text-primary uppercase">
                <ChevronLeft className="w-3 h-3" /> {T.seeAll}
              </button>
            )}
          </div>
          {sortedTx.length === 0 ? (
            <div className="bg-white p-10 rounded-5xl text-center shadow-sm">
              <Receipt className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-black text-slate-400">{T.finNoMovements}</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">{T.finNoMovementsSub}</p>
            </div>
          ) : (
            sortedTx.map(t => (
              <div key={t.id} className="bg-white p-5 rounded-4xl shadow-sm flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${CATEGORY_CONFIG[t.category]?.bg || 'bg-slate-100'} ${CATEGORY_CONFIG[t.category]?.color || 'text-slate-400'}`}>
                  {CATEGORY_CONFIG[t.category]?.icon || <MoreHorizontal className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-secondary text-sm truncate">{t.description}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{t.date} · {t.time}</p>
                </div>
                <span className={`font-black text-sm shrink-0 ${t.type==='income' ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {t.type==='income' ? '+' : '-'}{fmt(t.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const SourceRow = ({ label, pct, amount, icon, color, bg, totalLabel, onClick }: any) => (
  <button onClick={onClick} className="w-full bg-white p-6 rounded-5xl border border-white shadow-sm flex items-center justify-between hover:shadow-xl hover:border-primary/10 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 ${bg} ${color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <div className="text-left">
        <h5 className="font-black text-secondary text-sm">{label}</h5>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{pct}% {totalLabel}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-black text-secondary">${amount.toLocaleString()}</span>
      <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
    </div>
  </button>
);
