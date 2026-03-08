
import React, { useState, useEffect } from 'react';
import { Vet, Appointment, Pet } from '../types';
import { requestLocationPermission } from '../utils/permissions';
import { CalendarPicker } from './CalendarPicker';
import {
  Star, MapPin, CheckCircle, Search as SearchIcon, Filter, MessageSquare,
  Clock, X, Calendar, ChevronLeft, Send, Map as MapIcon, List, LogOut,
  Phone, Mail, CheckCircle2
} from 'lucide-react';

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
    specialties: ['Rayos X', 'Urgencias 24h', 'Traumatología'],
    experience: 15,
    rating: 4.8,
    reviewCount: 210,
    location: 'A 0.5 km (Emergencia)',
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    responseTime: 'Inmediato'
  }
];

interface VetSearchProps {
  onAddAppointment: (app: Appointment) => void;
  onOpenEmergency?: () => void;
  pets?: Pet[];
  selectedPetId?: string;
}

const todayStr = (() => {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
})();

export const VetSearch: React.FC<VetSearchProps> = ({ onAddAppointment, onOpenEmergency, pets = [], selectedPetId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showBooking, setShowBooking] = useState<Vet | null>(null);
  const [bookingPetId, setBookingPetId] = useState<string>(selectedPetId || '');
  const [showContactPopup, setShowContactPopup] = useState<Vet | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [bookingReason, setBookingReason] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const getCurrentLocation = async () => {
    const granted = await requestLocationPermission();
    if (granted) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    }
  };

  useEffect(() => {
    if (viewMode === 'map') {
      getCurrentLocation();
    }
  }, [viewMode]);

  const filteredVets = mockVets.filter(vet => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = vet.name.toLowerCase().includes(searchLower) ||
                          vet.specialties.some(s => s.toLowerCase().includes(searchLower));
    if (activeFilter === '🔥 Popular') return matchesSearch && vet.rating >= 4.8;
    if (activeFilter === '🚑 Emergencia') return matchesSearch && vet.specialties.includes('Urgencias 24h');
    return matchesSearch;
  });

  const displayVets = activeFilter === '📍 Cerca'
    ? [...filteredVets].sort((a, b) => {
        const distA = parseFloat(a.location.match(/[\d.]+/)?.[0] ?? '999');
        const distB = parseFloat(b.location.match(/[\d.]+/)?.[0] ?? '999');
        return distA - distB;
      })
    : filteredVets;

  const handleConfirmBooking = () => {
    if (showBooking) {
      const selectedPet = pets.find(p => p.id === bookingPetId) || pets[0];
      const newApp: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        petName: selectedPet?.name || 'Mi mascota',
        ownerName: 'Usuario',
        petImageUrl: selectedPet?.imageUrl || '',
        reason: bookingReason || 'Chequeo General',
        date: selectedDate,
        time: selectedTime,
        status: 'Confirmed'
      };
      onAddAppointment(newApp);
      setShowBooking(null);
      setBookingReason('');
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-secondary dark:text-slate-100">Encontrar Ayuda</h2>
        <div className="flex gap-2">
          <button 
            onClick={onOpenEmergency}
            className="flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-2xl shadow-sm border border-rose-100 dark:border-rose-800 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
          >
            <Phone className="w-4 h-4" /> Urgencias
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="flex items-center gap-2 bg-white dark:bg-darkCard px-4 py-2 rounded-2xl shadow-sm border border-white dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-primary hover:shadow-md transition-all"
          >
            {viewMode === 'list' ? <><MapIcon className="w-4 h-4" /> Mapa</> : <><List className="w-4 h-4" /> Lista</>}
          </button>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Busca 'Rayos X', 'Cirugía'..."
          className="w-full pl-14 pr-5 py-5 bg-white dark:bg-darkCard rounded-5xl border-2 border-transparent shadow-xl focus:border-primary/10 focus:outline-none text-sm font-bold transition-all text-secondary dark:text-slate-100"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar">
        {['Todos', '🔥 Popular', '📍 Cerca', '🚑 Emergencia', '🦴 Especialista'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveFilter(cat)}
            className={`px-6 py-3 rounded-3xl text-xs font-black whitespace-nowrap shadow-sm transition-all border ${activeFilter === cat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-darkCard text-secondary dark:text-slate-400 border-white dark:border-slate-800 hover:border-primary/20'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-secondary dark:text-slate-100 px-2">Expertos Recomendados</h3>
          {displayVets.length > 0 ? displayVets.map(vet => (
            <div key={vet.id} className="bg-white dark:bg-darkCard p-6 rounded-5xl border border-white dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
              <div className="flex gap-5">
                <div className="relative shrink-0">
                  <img src={vet.imageUrl} alt={vet.name} className="relative w-24 h-24 rounded-4xl object-cover border-2 border-white dark:border-slate-700 shadow-md" />
                  {vet.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-lg border border-slate-50 dark:border-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50 dark:fill-emerald-900/20" />
                    </div>
                  )}
                </div>
                <div className="flex-1 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-secondary dark:text-slate-200 text-lg">{vet.name}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">{vet.specialties.join(' • ')}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-2xl">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      <span className="text-sm font-black text-accent">{vet.rating}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold"><MapPin className="w-3.5 h-3.5 text-primary" />{vet.location}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-tighter">
                        <Clock className="w-3.5 h-3.5" />Responde en {vet.responseTime}
                      </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => { setShowBooking(vet); setBookingPetId(selectedPetId || pets[0]?.id || ''); }} className="flex-1 bg-secondary dark:bg-slate-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-secondary/5 hover:bg-primary transition-all">
                  Agendar Cita
                </button>
                <button onClick={() => setShowContactPopup(vet)} className="px-5 bg-crema dark:bg-slate-800 text-secondary dark:text-slate-400 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-white dark:bg-darkCard rounded-5xl border-4 border-dashed border-crema dark:border-slate-800">
              <p className="font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">No se encontraron resultados</p>
            </div>
          )}

        </div>
      ) : (
        <div className="h-[500px] rounded-5xl border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden relative" style={{ backgroundColor: '#e8e4d9' }}>
          {/* Calles simuladas */}
          {userLocation && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bg-white/80 h-10 left-0 right-0" style={{ top: '38%' }} />
              <div className="absolute bg-white/80 h-7 left-0 right-0" style={{ top: '68%' }} />
              <div className="absolute bg-white/80 w-10 top-0 bottom-0" style={{ left: '32%' }} />
              <div className="absolute bg-white/80 w-7 top-0 bottom-0" style={{ left: '68%' }} />
              <div className="absolute bg-emerald-200/60 rounded-2xl" style={{ top: '5%', left: '5%', width: '22%', height: '28%' }} />
              <div className="absolute bg-emerald-200/40 rounded-xl" style={{ top: '72%', right: '6%', width: '18%', height: '20%' }} />
              <div className="absolute bg-slate-200/50 rounded-xl" style={{ top: '45%', right: '10%', width: '14%', height: '18%' }} />
              <div className="absolute bg-slate-200/50 rounded-xl" style={{ top: '8%', left: '40%', width: '22%', height: '24%' }} />
            </div>
          )}

          {/* Pantalla de permiso */}
          {!userLocation && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-secondary mb-2">Activar Ubicación</h4>
              <p className="text-xs text-slate-500 mb-6 max-w-[200px]">Para mostrarte los veterinarios más cercanos a tu posición actual.</p>
              <button
                onClick={getCurrentLocation}
                className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                Permitir Acceso
              </button>
            </div>
          )}

          {/* Markers de vets */}
          {userLocation && displayVets.map((v, i) => (
            <button
              key={v.id}
              onClick={() => { setShowBooking(v); setBookingPetId(selectedPetId || ''); }}
              className="absolute z-10 flex flex-col items-center gap-1 group"
              style={{ top: `${25 + i * 22}%`, left: `${15 + i * 25}%` }}
            >
              <div className="relative">
                <img src={v.imageUrl} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xl group-hover:scale-110 transition-transform" alt={v.name} />
                <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[8px] font-black px-1 rounded-md shadow-sm">★{v.rating}</div>
              </div>
              <div className="bg-white px-2 py-0.5 rounded-lg shadow-md text-[9px] font-black text-secondary whitespace-nowrap">{v.name.split(' ')[0]} {v.name.split(' ')[1]}</div>
            </button>
          ))}

          {/* Punto usuario */}
          {userLocation && (
            <div className="absolute z-20 bg-blue-500 w-5 h-5 rounded-full border-3 border-white shadow-xl animate-pulse" style={{ top: '52%', left: '50%', transform: 'translate(-50%,-50%)' }}>
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-40" />
            </div>
          )}

          <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-darkCard/90 backdrop-blur-xl p-5 rounded-4xl shadow-2xl border border-white dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white"><MapPin className="w-6 h-6" /></div>
            <div>
              <h4 className="font-black text-secondary dark:text-slate-100 text-sm">Mostrando veterinarias en tu zona</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{displayVets.length} locales disponibles · Toca para agendar</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agendar */}
      {showBooking && (
        <div className="fixed inset-0 z-[200] bg-secondary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-crema dark:bg-slate-900 w-full max-w-lg rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="bg-white dark:bg-darkCard p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-black text-secondary dark:text-slate-100">Agendar con {showBooking.name}</h3>
              <button onClick={() => setShowBooking(null)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500"><X /></button>
            </div>
            <div className="p-8 space-y-6">
              {pets.length > 1 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mascota</span>
                  <div className="flex gap-2 flex-wrap">
                    {pets.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setBookingPetId(p.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all ${bookingPetId === p.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                      >
                        <img src={p.imageUrl} className="w-6 h-6 rounded-lg object-cover" alt={p.name} />
                        <span className="text-[10px] font-black uppercase">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2 relative">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fecha de Consulta</span>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full flex items-center gap-4 pl-5 pr-6 py-4 bg-white dark:bg-darkCard rounded-3xl border border-slate-100 dark:border-slate-800 font-bold text-secondary dark:text-slate-200 shadow-sm"
                >
                  <Calendar className="w-5 h-5 text-primary" />
                  {selectedDate}
                </button>
                {showCalendar && (
                  <div className="absolute top-20 left-0 right-0 z-[210]">
                    <CalendarPicker
                      value={selectedDate}
                      onChange={(date) => { setSelectedDate(date); setShowCalendar(false); }}
                      minDate={new Date()}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Horario Disponible</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { time: '09:00', available: false }, 
                    { time: '10:30', available: true }, 
                    { time: '12:00', available: true }, 
                    { time: '15:30', available: false }, 
                    { time: '17:00', available: true }
                  ].map(slot => (
                    <button 
                      key={slot.time} 
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`py-3 rounded-2xl text-[11px] font-black transition-all shadow-sm ${
                        !slot.available 
                          ? 'bg-slate-100 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 cursor-not-allowed border border-transparent opacity-50 line-through' 
                          : selectedTime === slot.time 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-white dark:bg-darkCard border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/30'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Motivo de Consulta</span>
                <input 
                  type="text" 
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="Ej: Vacunación, Chequeo..." 
                  className="w-full px-5 py-4 bg-white dark:bg-darkCard rounded-3xl border border-slate-100 dark:border-slate-800 font-bold text-secondary dark:text-slate-200 shadow-sm focus:outline-none focus:border-primary/20"
                />
              </div>
              <button 
                onClick={handleConfirmBooking}
                className="w-full py-5 bg-secondary dark:bg-slate-700 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl hover:bg-primary transition-all"
              >
                Confirmar Cita
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Contact Popup */}
      {showContactPopup && (
        <div className="fixed inset-0 z-[200] bg-secondary/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-darkCard w-full max-w-sm p-8 rounded-5xl shadow-2xl border border-white dark:border-slate-800 relative">
            <button onClick={() => setShowContactPopup(null)} className="absolute top-6 right-6 text-slate-300 hover:text-secondary transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center text-center space-y-4">
              <img src={showContactPopup.imageUrl} className="w-20 h-20 rounded-3xl object-cover border-4 border-crema dark:border-slate-800 shadow-xl" alt={showContactPopup.name} />
              <div>
                <h3 className="text-2xl font-black text-secondary dark:text-white">{showContactPopup.name}</h3>
                <p className="text-slate-400 font-medium text-sm">¿Cómo prefieres contactar?</p>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" />
                Enviar WhatsApp
              </button>
              <button className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <Mail className="w-5 h-5" />
                Enviar Email
              </button>
            </div>
            
            <button 
              onClick={() => setShowContactPopup(null)}
              className="w-full mt-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
