
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Package, AlertTriangle, Plus, ChevronRight, ArrowUpRight, X, Minus, ShoppingCart } from 'lucide-react';

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Vacuna Rabia X-10', stock: 5, minThreshold: 10, unitPrice: 25 },
  { id: '2', name: 'Desparasitante Bravecto', stock: 42, minThreshold: 15, unitPrice: 18 },
  { id: '3', name: 'Antibiótico Genérico', stock: 2, minThreshold: 5, unitPrice: 12 },
  { id: '4', name: 'Shampoo Medicado', stock: 15, minThreshold: 5, unitPrice: 30 }
];

export const VetInventory: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(10);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-secondary dark:text-slate-100">Inventario</h2>
          <p className="text-xs text-slate-400 font-medium">Gestiona stock y suministros</p>
        </div>
        <button className="bg-primary text-white p-4 rounded-3xl shadow-xl shadow-primary/20 hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-6 rounded-5xl flex gap-4 items-start shadow-sm">
        <div className="bg-rose-500 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-200 dark:shadow-none">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-black text-rose-600 dark:text-rose-400 text-sm">2 Productos con stock crítico</h4>
          <p className="text-xs text-rose-500/70 dark:text-rose-500/50 font-medium leading-relaxed mt-0.5">Las vacunas de Rabia y los antibióticos se agotarán pronto. Revisa tus pedidos.</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockInventory.map(item => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-inner transition-colors ${item.stock <= item.minThreshold ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' : 'bg-crema dark:bg-slate-700 text-secondary dark:text-slate-400'}`}>
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-secondary dark:text-slate-200 text-base leading-none mb-2">{item.name}</h4>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${item.stock <= item.minThreshold ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}>
                  Stock: {item.stock} uds
                </span>
                <span className="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest">P. Unit: ${item.unitPrice}</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detalle/Pedido Stock */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] bg-secondary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-crema dark:bg-slate-900 w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
             <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                   <div className="bg-primary/10 p-4 rounded-3xl shadow-sm"><ShoppingCart className="w-10 h-10 text-primary" /></div>
                   <button onClick={() => setSelectedItem(null)} className="p-3 bg-white dark:bg-darkCard rounded-2xl text-slate-300"><X /></button>
                </div>
                <div>
                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">Gestión de Stock</span>
                   <h3 className="text-2xl font-black text-secondary dark:text-slate-100 mt-1">{selectedItem.name}</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed">
                     Actualmente tienes <span className="font-black text-primary">{selectedItem.stock} unidades</span>. 
                     Tu umbral mínimo es {selectedItem.minThreshold}.
                   </p>
                </div>
                
                <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nueva Orden</span>
                      <span className="text-sm font-black text-secondary dark:text-slate-200">Total: ${orderQuantity * selectedItem.unitPrice}</span>
                   </div>
                   <div className="flex items-center justify-center gap-8 py-2">
                      <button onClick={() => setOrderQuantity(Math.max(1, orderQuantity-1))} className="w-12 h-12 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-inner"><Minus className="w-6 h-6 text-primary"/></button>
                      <span className="text-3xl font-black text-secondary dark:text-slate-100">{orderQuantity}</span>
                      <button onClick={() => setOrderQuantity(orderQuantity+1)} className="w-12 h-12 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-inner"><Plus className="w-6 h-6 text-primary"/></button>
                   </div>
                </div>

                <button onClick={() => setSelectedItem(null)} className="w-full py-5 bg-secondary dark:bg-slate-700 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-secondary/10 hover:bg-primary transition-all">Iniciar Pedido</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
