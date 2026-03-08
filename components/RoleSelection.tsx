
import React from 'react';
import { AppRole } from '../types';
import { User, Stethoscope, Heart, ShieldCheck, PawPrint } from 'lucide-react';

interface RoleSelectionProps {
  onSelect: (role: AppRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-crema flex flex-col items-center justify-center p-8 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-2xl rotate-6 shadow-primary/20">
          <PawPrint className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-secondary tracking-tighter">Pawell</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-1">Plataforma Integral de Salud</p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <RoleCard 
          icon={<User className="w-8 h-8" />}
          title="Dueño de Mascota"
          desc="Cuida y trackea la salud de tu mejor amigo."
          onClick={() => onSelect(AppRole.OWNER)}
          accent="primary"
        />
        <RoleCard 
          icon={<Stethoscope className="w-8 h-8" />}
          title="Médico Veterinario"
          desc="Gestiona tus citas, pacientes e historial médico."
          onClick={() => onSelect(AppRole.VETERINARIAN)}
          accent="secondary"
        />
      </div>

      <div className="flex items-center gap-2 text-slate-300">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">Entorno Seguro y Verificado</span>
      </div>
    </div>
  );
};

const RoleCard = ({ icon, title, desc, onClick, accent }: any) => (
  <button 
    onClick={onClick}
    className={`w-full bg-white p-8 rounded-5xl border-2 border-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-left flex items-center gap-6 group`}
  >
    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${accent === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'} group-hover:scale-110 transition-transform shadow-inner`}>
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-black text-secondary leading-none mb-1">{title}</h3>
      <p className="text-xs text-slate-400 font-medium">{desc}</p>
    </div>
  </button>
);
