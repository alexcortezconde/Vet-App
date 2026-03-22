
import React, { useState } from 'react';
import { PatientRecord } from '../types';
import { useLang } from '../context/LanguageContext';
import { translations } from '../services/i18n';
import {
  Search, Filter, History, Phone, FileText, X, Plus,
  ChevronRight, UserX, Edit2, Check, PawPrint
} from 'lucide-react';

interface Props {
  patients: PatientRecord[];
  onUpdatePatients: (p: PatientRecord[]) => void;
}

const BLANK_NEW = { petName: '', ownerName: '', ownerPhone: '', species: '', breed: '', age: '', weight: '', medicalNotes: '' };

export const VetPatients: React.FC<Props> = ({ patients, onUpdatePatients }) => {
  const { lang } = useLang();
  const T = translations[lang];

  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [detailPatient, setDetailPatient] = useState<PatientRecord | null>(null);
  const [contactPatient, setContactPatient] = useState<PatientRecord | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState(BLANK_NEW);
  const [editForm, setEditForm] = useState<PatientRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PatientRecord | null>(null);

  const filtered = patients.filter(p => {
    const q = query.toLowerCase();
    const matchSearch = !q || p.petName.toLowerCase().includes(q) || p.ownerName.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAdd = () => {
    if (!newForm.petName || !newForm.ownerName) return;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const p: PatientRecord = {
      id: `p-${Date.now()}`,
      petName: newForm.petName,
      ownerName: newForm.ownerName,
      ownerPhone: newForm.ownerPhone,
      lastVisit: dateStr,
      status: 'Active',
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=200',
      species: newForm.species,
      breed: newForm.breed,
      age: parseInt(newForm.age) || undefined,
      weight: parseFloat(newForm.weight) || undefined,
      medicalNotes: newForm.medicalNotes,
    };
    onUpdatePatients([...patients, p]);
    setShowAdd(false);
    setNewForm(BLANK_NEW);
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    onUpdatePatients(patients.map(p => p.id === editForm.id ? editForm : p));
    setEditForm(null);
    setDetailPatient(editForm);
  };

  const handleToggleStatus = (patient: PatientRecord) => {
    const updated = { ...patient, status: patient.status === 'Active' ? 'Inactive' as const : 'Active' as const };
    onUpdatePatients(patients.map(p => p.id === patient.id ? updated : p));
    setDetailPatient(updated);
  };

  const handleDelete = (patient: PatientRecord) => {
    setConfirmDelete(patient);
  };

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    onUpdatePatients(patients.filter(p => p.id !== confirmDelete.id));
    setConfirmDelete(null);
    setDetailPatient(null);
  };

  const filterLabel = filterStatus === 'Active' ? T.active : T.inactive;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-secondary dark:text-slate-100">{T.patTitle}</h2>
          <p className="text-xs text-slate-400 font-medium">{patients.length} {T.patSub}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-primary text-white p-3.5 rounded-3xl shadow-xl shadow-primary/20 hover:scale-110 transition-transform">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={T.patSearchPlaceholder}
          className="w-full pl-14 pr-16 py-5 bg-white dark:bg-darkCard rounded-5xl border border-white dark:border-slate-800 shadow-sm focus:outline-none focus:shadow-xl transition-all text-sm font-bold text-secondary dark:text-slate-200"
        />
        <button onClick={() => setShowFilter(true)} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl shadow-sm transition-all ${filterStatus !== 'all' ? 'bg-primary text-white' : 'bg-crema dark:bg-slate-700 text-secondary dark:text-slate-200'}`}>
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Active filter badge */}
      {filterStatus !== 'all' && (
        <div className="flex items-center gap-2 px-2">
          <span className="text-[10px] font-black text-slate-400 uppercase">{T.patFilterActive}:</span>
          <button onClick={() => setFilterStatus('all')} className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase">
            {filterLabel} <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 gap-4">
          <div className="w-16 h-16 bg-crema rounded-5xl flex items-center justify-center">
            <UserX className="w-8 h-8 text-slate-300" />
          </div>
          <p className="font-black text-secondary text-base">{T.patNoResults}</p>
          <p className="text-sm text-slate-400 font-medium">{T.patNoResultsSub}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(patient => (
            <div key={patient.id} className="bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group">
              <div className="relative shrink-0 cursor-pointer" onClick={() => setDetailPatient(patient)}>
                <img src={patient.imageUrl} className="w-20 h-20 rounded-4xl object-cover shadow-md group-hover:scale-105 transition-transform" alt={patient.petName} />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 ${patient.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <div className="flex-1 py-1 min-w-0 cursor-pointer" onClick={() => setDetailPatient(patient)}>
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h4 className="font-black text-secondary dark:text-slate-100 text-lg leading-none">{patient.petName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{patient.ownerName}</p>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-2">
                    <button
                      onClick={e => { e.stopPropagation(); setContactPatient(patient); }}
                      className="p-2.5 bg-crema dark:bg-slate-700 text-secondary dark:text-slate-300 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                      title={T.patContactTitle}
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setDetailPatient(patient); }}
                      className="p-2.5 bg-crema dark:bg-slate-700 text-secondary dark:text-slate-300 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                      title={T.patMedNotes}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <History className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{T.patLastVisit}: {patient.lastVisit}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Filter Modal */}
      {showFilter && (
        <Modal title={T.patFilterTitle} onClose={() => setShowFilter(false)}>
          <div className="space-y-3">
            {(['all', 'Active', 'Inactive'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setShowFilter(false); }}
                className={`w-full py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-crema text-secondary hover:bg-slate-100'}`}
              >
                {s === 'all' ? T.all : s === 'Active' ? T.patOnlyActive : T.patOnlyInactive}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Contact Modal */}
      {contactPatient && (
        <Modal title={T.patContactTitle} onClose={() => setContactPatient(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-crema rounded-4xl">
              <img src={contactPatient.imageUrl} className="w-14 h-14 rounded-3xl object-cover" />
              <div>
                <p className="font-black text-secondary">{contactPatient.petName}</p>
                <p className="text-xs text-slate-400 font-bold">{contactPatient.ownerName}</p>
              </div>
            </div>
            <div className="bg-crema p-5 rounded-4xl space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{T.patPhone}</span>
              <p className="font-black text-secondary text-lg">{contactPatient.ownerPhone || T.patNotRegistered}</p>
            </div>
            {contactPatient.ownerPhone && (
              <a href={`tel:${contactPatient.ownerPhone}`} className="block w-full py-4 bg-primary text-white rounded-3xl font-black text-sm text-center shadow-xl shadow-primary/20">
                {T.patCallNow}
              </a>
            )}
          </div>
        </Modal>
      )}

      {/* Patient Detail Modal */}
      {detailPatient && !editForm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-crema w-full max-w-lg rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 flex justify-between items-start border-b border-slate-100 bg-white">
              <div className="flex items-center gap-4">
                <img src={detailPatient.imageUrl} className="w-16 h-16 rounded-3xl object-cover shadow-lg border-2 border-white" />
                <div>
                  <h3 className="text-xl font-black text-secondary">{detailPatient.petName}</h3>
                  <p className="text-xs text-slate-400 font-bold">{detailPatient.ownerName}</p>
                  <span className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${detailPatient.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${detailPatient.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {detailPatient.status === 'Active' ? T.active : T.inactive}
                  </span>
                </div>
              </div>
              <button onClick={() => setDetailPatient(null)} className="p-2 bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1 no-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: T.patSpecies, value: detailPatient.species || '—' },
                  { label: T.patBreed,   value: detailPatient.breed   || '—' },
                  { label: T.patAge,     value: detailPatient.age    != null ? `${detailPatient.age} ${lang === 'en' ? 'yrs' : 'años'}` : '—' },
                  { label: T.patWeight,  value: detailPatient.weight != null ? `${detailPatient.weight} kg` : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white p-4 rounded-4xl shadow-sm">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">{label}</span>
                    <span className="text-sm font-black text-secondary">{value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white p-5 rounded-4xl shadow-sm">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">{T.patMedNotes}</span>
                <p className="text-sm font-medium text-secondary leading-relaxed">{detailPatient.medicalNotes || T.patNoNotes}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setEditForm(detailPatient)} className="py-4 bg-white text-secondary rounded-3xl font-black text-xs shadow-sm flex flex-col items-center gap-1 hover:bg-primary hover:text-white transition-all">
                  <Edit2 className="w-4 h-4" />{T.edit}
                </button>
                <button onClick={() => handleToggleStatus(detailPatient)} className="py-4 bg-white text-secondary rounded-3xl font-black text-xs shadow-sm flex flex-col items-center gap-1 hover:bg-amber-500 hover:text-white transition-all">
                  <Check className="w-4 h-4" />{detailPatient.status === 'Active' ? T.patDeactivate : T.patActivate}
                </button>
                <button onClick={() => handleDelete(detailPatient)} className="py-4 bg-white text-rose-500 rounded-3xl font-black text-xs shadow-sm flex flex-col items-center gap-1 hover:bg-rose-500 hover:text-white transition-all">
                  <X className="w-4 h-4" />{T.delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editForm && (
        <Modal title={`${T.edit} — ${editForm.petName}`} onClose={() => setEditForm(null)}>
          <div className="space-y-3">
            {[
              { key: 'petName',    label: T.patPetName,    type: 'text'   },
              { key: 'ownerName',  label: T.patOwnerName,  type: 'text'   },
              { key: 'ownerPhone', label: T.patOwnerPhone, type: 'tel'    },
              { key: 'species',    label: T.patSpecies,    type: 'text'   },
              { key: 'breed',      label: T.patBreed,      type: 'text'   },
              { key: 'age',        label: T.patAge,        type: 'number' },
              { key: 'weight',     label: T.patWeight,     type: 'number' },
            ].map(({ key, label, type }) => (
              <div key={key} className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <input
                  type={type}
                  value={(editForm as any)[key] ?? ''}
                  onChange={e => setEditForm({ ...editForm, [key]: e.target.value } as PatientRecord)}
                  className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl font-bold text-secondary dark:text-slate-200 outline-none"
                />
              </div>
            ))}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{T.patMedNotes}</span>
              <textarea
                value={editForm.medicalNotes || ''}
                onChange={e => setEditForm({ ...editForm, medicalNotes: e.target.value })}
                rows={3}
                className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl font-medium text-secondary dark:text-slate-200 outline-none resize-none"
              />
            </div>
            <button onClick={handleSaveEdit} className="w-full py-4 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
              {T.save}
            </button>
          </div>
        </Modal>
      )}

      {/* Add Patient Modal */}
      {showAdd && (
        <Modal title={T.patAddTitle} onClose={() => { setShowAdd(false); setNewForm(BLANK_NEW); }}>
          <div className="space-y-3">
            {[
              { key: 'petName',    label: T.patPetName,    type: 'text'   },
              { key: 'ownerName',  label: T.patOwnerName,  type: 'text'   },
              { key: 'ownerPhone', label: T.patOwnerPhone, type: 'tel'    },
              { key: 'species',    label: T.patSpecies,    type: 'text'   },
              { key: 'breed',      label: T.patBreed,      type: 'text'   },
              { key: 'age',        label: T.patAge,        type: 'number' },
              { key: 'weight',     label: T.patWeight,     type: 'number' },
            ].map(({ key, label, type }) => (
              <div key={key} className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <input
                  type={type}
                  value={(newForm as any)[key]}
                  onChange={e => setNewForm({ ...newForm, [key]: e.target.value })}
                  className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl font-bold text-secondary dark:text-slate-200 outline-none"
                />
              </div>
            ))}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{T.patMedNotes}</span>
              <textarea
                value={newForm.medicalNotes}
                onChange={e => setNewForm({ ...newForm, medicalNotes: e.target.value })}
                rows={2}
                className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl font-medium text-secondary dark:text-slate-200 outline-none resize-none"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newForm.petName || !newForm.ownerName}
              className="w-full py-4 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {T.patAddBtn}
            </button>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[400] bg-secondary/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-sm rounded-5xl shadow-2xl p-8 space-y-5">
            <div className="w-14 h-14 bg-rose-100 rounded-4xl flex items-center justify-center mx-auto">
              <X className="w-7 h-7 text-rose-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-secondary dark:text-slate-100">{T.confirmDeleteTitle}</h3>
              <p className="text-sm text-slate-400 font-medium mt-2">
                <span className="font-black text-secondary dark:text-slate-200">{confirmDelete.petName}</span> — {T.confirmDeleteMsg}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setConfirmDelete(null)} className="py-4 bg-crema dark:bg-slate-700 text-secondary dark:text-slate-200 rounded-3xl font-black text-sm hover:bg-slate-100 transition-all">
                {T.cancel}
              </button>
              <button onClick={confirmDeleteAction} className="py-4 bg-rose-500 text-white rounded-3xl font-black text-sm shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all">
                {T.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
      <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-secondary dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  </div>
);
