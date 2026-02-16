
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const data = [
  { name: 'Ene', ingresos: 4000, gastos: 2400 },
  { name: 'Feb', ingresos: 3000, gastos: 1398 },
  { name: 'Mar', ingresos: 2000, gastos: 9800 },
  { name: 'Abr', ingresos: 2780, gastos: 3908 },
  { name: 'May', ingresos: 1890, gastos: 4800 },
  { name: 'Jun', ingresos: 2390, gastos: 3800 },
];

export const VetFinancials: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="px-2">
        <h2 className="text-2xl font-black text-secondary">Resumen Financiero</h2>
        <p className="text-xs text-slate-400 font-medium">Estado de cuenta y balance mensual</p>
      </div>

      {/* Balance Hero */}
      <div className="bg-emerald-500 p-8 rounded-5xl text-white shadow-2xl shadow-emerald-200">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Balance Neto</span>
            <h3 className="text-4xl font-black mt-1">$12,450.80</h3>
          </div>
          <div className="bg-white/20 p-3 rounded-3xl backdrop-blur-md">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight className="w-3 h-3 text-white" />
              <span className="text-[9px] font-black uppercase">Ingresos</span>
            </div>
            <span className="text-lg font-black">$18.2k</span>
          </div>
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownRight className="w-3 h-3 text-white/50" />
              <span className="text-[9px] font-black uppercase">Gastos Stock</span>
            </div>
            <span className="text-lg font-black">$5.8k</span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <section className="bg-white p-8 rounded-5xl border border-white shadow-sm">
        <h4 className="text-sm font-black text-secondary mb-6 uppercase tracking-widest">Flujo de Caja (6 meses)</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#cbd5e1'}} dy={10} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="ingresos" radius={[6, 6, 6, 6]} barSize={12}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#FF7A59' : '#1B3B36'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Desglose Rápido */}
      <div className="space-y-4">
        <h4 className="text-sm font-black text-secondary px-2 uppercase tracking-widest">Fuentes de Ingreso</h4>
        <div className="bg-white p-6 rounded-5xl border border-white shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
               <TrendingUp className="w-5 h-5" />
             </div>
             <div>
               <h5 className="font-black text-secondary text-sm">Consultas Médicas</h5>
               <p className="text-[10px] text-slate-400 font-bold uppercase">64% del total</p>
             </div>
           </div>
           <span className="font-black text-secondary">$11,648</span>
        </div>
        <div className="bg-white p-6 rounded-5xl border border-white shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
               <ArrowUpRight className="w-5 h-5" />
             </div>
             <div>
               <h5 className="font-black text-secondary text-sm">Venta de Insumos</h5>
               <p className="text-[10px] text-slate-400 font-bold uppercase">36% del total</p>
             </div>
           </div>
           <span className="font-black text-secondary">$6,552</span>
        </div>
      </div>
    </div>
  );
};
