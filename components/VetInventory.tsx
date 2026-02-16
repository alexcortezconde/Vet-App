
import React from 'react';
import { InventoryItem } from '../types';
import { Package, AlertTriangle, Plus, ChevronRight, ArrowUpRight } from 'lucide-react';

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Vacuna Rabia X-10', stock: 5, minThreshold: 10, unitPrice: 25 },
  { id: '2', name: 'Desparasitante Bravecto', stock: 42, minThreshold: 15, unitPrice: 18 },
  { id: '3', name: 'Antibiótico Genérico', stock: 2, minThreshold: 5, unitPrice: 12 },
  { id: '4', name: 'Shampoo Medicado', stock: 15, minThreshold: 5, unitPrice: 30 }
];

export const VetInventory: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-secondary">Inventario</h2>
          <p className="text-xs text-slate-400 font-medium">Gestiona stock y suministros</p>
        </div>
        <button className="bg-primary text-white p-4 rounded-3xl shadow-xl shadow-primary/20 hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Alertas */}
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-5xl flex gap-4 items-start">
        <div className="bg-rose-500 p-2 rounded-xl text-white">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-black text-rose-600 text-sm">2 Productos con stock crítico</h4>
          <p className="text-xs text-rose-500/70 font-medium leading-relaxed">Las vacunas de Rabia y los antibióticos se agotarán pronto. Revisa tus pedidos.</p>
        </div>
      </div>

      {/* Lista de Inventario */}
      <div className="space-y-4">
        {mockInventory.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-5xl border border-white shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group">
            <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${item.stock <= item.minThreshold ? 'bg-rose-50 text-rose-500' : 'bg-crema text-secondary'}`}>
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-secondary text-base">{item.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${item.stock <= item.minThreshold ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  Stock: {item.stock} unidades
                </span>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">P. Unit: ${item.unitPrice}</span>
              </div>
            </div>
            <button className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
