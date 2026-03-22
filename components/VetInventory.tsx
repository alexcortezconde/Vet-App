
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import {
  Package, AlertTriangle, Plus, ArrowUpRight, X,
  Minus, ShoppingCart, Edit2, Trash2, Tag, Calendar, Building2
} from 'lucide-react';

interface Props {
  inventory: InventoryItem[];
  onUpdateInventory: (items: InventoryItem[]) => void;
}

const BLANK = { name: '', category: '', description: '', supplier: '', unitPrice: '', minThreshold: '5', expiryDate: '' };

export const VetInventory: React.FC<Props> = ({ inventory, onUpdateInventory }) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [orderQty, setOrderQty] = useState(10);
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState(BLANK);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const lowStockItems = inventory.filter(i => i.stock <= i.minThreshold);

  const handleOrder = () => {
    if (!selectedItem) return;
    onUpdateInventory(inventory.map(item => item.id === selectedItem.id ? { ...item, stock: item.stock + orderQty } : item));
    setSelectedItem(null);
    setOrderQty(10);
  };

  const handleAdd = () => {
    if (!newForm.name) return;
    const item: InventoryItem = {
      id: `i-${Date.now()}`,
      name: newForm.name,
      stock: 0,
      minThreshold: parseInt(newForm.minThreshold) || 5,
      unitPrice: parseFloat(newForm.unitPrice) || 0,
      category: newForm.category,
      description: newForm.description,
      supplier: newForm.supplier,
      expiryDate: newForm.expiryDate,
    };
    onUpdateInventory([...inventory, item]);
    setShowAdd(false);
    setNewForm(BLANK);
  };

  const handleSaveEdit = () => {
    if (!editItem) return;
    onUpdateInventory(inventory.map(i => i.id === editItem.id ? editItem : i));
    setEditItem(null);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    onUpdateInventory(inventory.filter(i => i.id !== id));
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-secondary dark:text-slate-100">Inventario</h2>
          <p className="text-xs text-slate-400 font-medium">{inventory.length} productos registrados</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-white p-4 rounded-3xl shadow-xl shadow-primary/20 hover:scale-110 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-6 rounded-5xl flex gap-4 items-start shadow-sm">
          <div className="bg-rose-500 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-200 dark:shadow-none shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-rose-600 dark:text-rose-400 text-sm">{lowStockItems.length} producto{lowStockItems.length>1?'s':''} con stock crítico</h4>
            <p className="text-xs text-rose-500/70 dark:text-rose-500/50 font-medium mt-0.5 leading-relaxed">
              {lowStockItems.map(i => i.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Inventory list */}
      <div className="space-y-4">
        {inventory.map(item => {
          const isCritical = item.stock <= item.minThreshold;
          return (
            <div
              key={item.id}
              onClick={() => { setSelectedItem(item); setOrderQty(10); }}
              className="bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-inner shrink-0 transition-colors ${isCritical ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' : 'bg-crema dark:bg-slate-700 text-secondary dark:text-slate-400'}`}>
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-secondary dark:text-slate-200 text-base leading-none mb-1.5">{item.name}</h4>
                {item.category && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2">{item.category}</p>}
                <div className="flex items-center flex-wrap gap-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg ${isCritical ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}>
                    Stock: {item.stock} uds
                  </span>
                  <span className="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest">${item.unitPrice}/ud</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm shrink-0">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Detail / Order Modal */}
      {selectedItem && !editItem && (
        <div className="fixed inset-0 z-[200] bg-secondary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-crema dark:bg-slate-900 w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10">
            <div className="p-6 space-y-5 overflow-y-auto flex-1 no-scrollbar">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-3xl shadow-sm ${selectedItem.stock <= selectedItem.minThreshold ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-primary/10'}`}>
                  <ShoppingCart className={`w-10 h-10 ${selectedItem.stock <= selectedItem.minThreshold ? 'text-rose-500' : 'text-primary'}`} />
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-3 bg-white dark:bg-darkCard rounded-2xl text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedItem.category || 'Producto'}</span>
                <h3 className="text-2xl font-black text-secondary dark:text-slate-100 mt-1">{selectedItem.name}</h3>
                {selectedItem.description && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed">{selectedItem.description}</p>}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Package className="w-4 h-4" />,   label: 'Stock Actual',  value: `${selectedItem.stock} uds` },
                  { icon: <AlertTriangle className="w-4 h-4" />, label: 'Mínimo',    value: `${selectedItem.minThreshold} uds` },
                  { icon: <Tag className="w-4 h-4" />,        label: 'Precio Unitario', value: `$${selectedItem.unitPrice}` },
                  { icon: <Building2 className="w-4 h-4" />,  label: 'Proveedor',   value: selectedItem.supplier || '—' },
                  { icon: <Calendar className="w-4 h-4" />,   label: 'Caducidad',   value: selectedItem.expiryDate || '—' },
                  { icon: <Tag className="w-4 h-4" />,        label: 'Valor Total',  value: `$${selectedItem.stock * selectedItem.unitPrice}` },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-white dark:bg-darkCard p-4 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-2 mb-1 text-primary">{icon}</div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">{label}</span>
                    <span className="text-sm font-black text-secondary dark:text-slate-200">{value}</span>
                  </div>
                ))}
              </div>

              {/* Order section */}
              <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-white dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad a Pedir</span>
                  <span className="text-sm font-black text-secondary dark:text-slate-200">Total: ${orderQty * selectedItem.unitPrice}</span>
                </div>
                <div className="flex items-center justify-center gap-8 py-2">
                  <button onClick={() => setOrderQty(q => Math.max(1, q - 1))} className="w-12 h-12 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-inner">
                    <Minus className="w-6 h-6 text-primary" />
                  </button>
                  <span className="text-3xl font-black text-secondary dark:text-slate-100 w-12 text-center">{orderQty}</span>
                  <button onClick={() => setOrderQty(q => q + 1)} className="w-12 h-12 bg-crema dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-inner">
                    <Plus className="w-6 h-6 text-primary" />
                  </button>
                </div>
              </div>

              <button onClick={handleOrder} className="w-full py-5 bg-secondary dark:bg-slate-700 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-secondary/10 hover:bg-primary transition-all">
                Recibir Pedido (+{orderQty} uds)
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setEditItem(selectedItem)} className="py-4 bg-white dark:bg-darkCard text-secondary dark:text-slate-200 rounded-3xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
                <button onClick={() => handleDelete(selectedItem.id)} className="py-4 bg-white dark:bg-darkCard text-rose-500 rounded-3xl font-black text-sm flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <FormModal
          title={`Editar — ${editItem.name}`}
          onClose={() => setEditItem(null)}
          onSubmit={handleSaveEdit}
          submitLabel="Guardar Cambios"
        >
          <ItemForm form={editItem} setForm={v => setEditItem(v as InventoryItem)} />
        </FormModal>
      )}

      {/* Add Modal */}
      {showAdd && (
        <FormModal
          title="Agregar Medicamento"
          onClose={() => { setShowAdd(false); setNewForm(BLANK); }}
          onSubmit={handleAdd}
          submitLabel="Agregar al Inventario"
          disabled={!newForm.name}
        >
          <ItemForm form={newForm} setForm={v => setNewForm(v as typeof BLANK)} isNew />
        </FormModal>
      )}
    </div>
  );
};

const ItemForm = ({ form, setForm, isNew = false }: { form: any; setForm: (v: any) => void; isNew?: boolean }) => (
  <div className="space-y-3">
    {[
      { key: 'name',          label: 'Nombre *',         type: 'text'   },
      { key: 'category',      label: 'Categoría',         type: 'text'   },
      { key: 'description',   label: 'Descripción',       type: 'text'   },
      { key: 'supplier',      label: 'Proveedor',          type: 'text'   },
      { key: 'unitPrice',     label: 'Precio Unitario ($)', type: 'number' },
      { key: 'minThreshold',  label: 'Stock Mínimo',       type: 'number' },
      { key: 'expiryDate',    label: 'Fecha de Caducidad', type: 'date'   },
    ].map(({ key, label, type }) => (
      <div key={key} className="space-y-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <input
          type={type}
          value={form[key] ?? ''}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl font-bold text-secondary dark:text-slate-200 outline-none"
        />
      </div>
    ))}
  </div>
);

const FormModal = ({ title, onClose, onSubmit, submitLabel, disabled = false, children }: any) => (
  <div className="fixed inset-0 z-[300] bg-secondary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
      <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-secondary dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        {children}
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-all"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  </div>
);
