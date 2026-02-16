
import React from 'react';
import { Vet } from '../types';
import { Star, MapPin, CheckCircle, Search as SearchIcon, Filter, MessageSquare, Clock } from 'lucide-react';

const mockVets: Vet[] = [
  {
    id: '1',
    name: 'Dr. Alejandro Soto',
    specialties: ['Perros Senior', 'Cirugía'],
    experience: 12,
    rating: 4.9,
    reviewCount: 124,
    location: 'A 1.2 km de ti',
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    responseTime: '< 1 hora'
  },
  {
    id: '2',
    name: 'Dra. María Lucía',
    specialties: ['Medicina Interna', 'Nutrición'],
    experience: 8,
    rating: 4.7,
    reviewCount: 89,
    location: 'A 3.1 km de ti',
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
    responseTime: '< 3 horas'
  },
  {
    id: '3',
    name: 'Dr. Roberto Méndez',
    specialties: ['Urgencias 24h', 'Traumatología'],
    experience: 15,
    rating: 4.8,
    reviewCount: 210,
    location: 'A 0.5 km (Emergencia)',
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    responseTime: 'Inmediato'
  }
];

export const VetSearch: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Busca por raza, especialidad..." 
          className="w-full pl-14 pr-16 py-5 bg-white rounded-5xl border-2 border-transparent shadow-2xl focus:border-primary/20 focus:outline-none text-sm font-bold transition-all text-secondary"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-secondary text-white rounded-3xl hover:bg-primary transition-colors shadow-lg">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar">
        {['🔥 Popular', '📍 Cerca (Nuñez)', '🚑 Emergencia Ahora', '🦷 Dental', '🦴 Especialista'].map((cat, i) => (
          <button key={cat} className={`px-6 py-3 rounded-3xl text-xs font-black whitespace-nowrap shadow-sm transition-all ${i === 2 ? 'bg-rose-500 text-white shadow-xl shadow-rose-200' : 'bg-white text-secondary hover:border-primary/40 border border-white'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Vet List */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-secondary px-2">Expertos Recomendados</h3>
        {mockVets.map(vet => (
          <div key={vet.id} className="bg-white p-6 rounded-5xl border border-white shadow-sm hover:shadow-2xl transition-all group overflow-hidden">
            <div className="flex gap-5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/10 rounded-4xl rotate-3 group-hover:rotate-6 transition-transform"></div>
                <img src={vet.imageUrl} alt={vet.name} className="relative w-24 h-24 rounded-4xl object-cover border-2 border-white shadow-lg" />
                {vet.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-lg border border-slate-50">
                    <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-secondary text-lg group-hover:text-primary transition-colors">{vet.name}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">
                      {vet.specialties.join(' • ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-2xl">
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <span className="text-sm font-black text-accent">{vet.rating}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {vet.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-black uppercase tracking-tighter">
                      <Clock className="w-3.5 h-3.5" />
                      Responde en {vet.responseTime}
                    </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-secondary text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-secondary/5 group-hover:bg-primary transition-colors">
                Agendar Cita
              </button>
              <button className="px-5 bg-crema text-secondary rounded-2xl hover:bg-slate-100 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
