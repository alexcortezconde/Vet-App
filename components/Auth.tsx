
import React, { useState } from 'react';
import { Shield, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AppRole } from '../types';

interface AuthProps {
  onLogin: (email: string, role: AppRole) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>(AppRole.OWNER);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    if (email === 'testmail@mail.com' && password === 'testpassword') {
      onLogin(email, AppRole.OWNER); // Default for test
    } else {
      // For any other login, just let them in for demo purposes
      onLogin(email, selectedRole);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    onLogin(email, selectedRole);
  };

  return (
    <div className="min-h-screen bg-crema dark:bg-darkBg flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight">PetCare</h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Tu mascota en las mejores manos</p>
          </div>
        </div>

        <div className="bg-white dark:bg-darkCard p-8 rounded-5xl shadow-xl border border-white dark:border-slate-800">
          <h2 className="text-2xl font-black text-secondary dark:text-white mb-6">
            {isRegistering ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
          </h2>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nombre Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full bg-crema dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="email"
                  placeholder="testmail@mail.com"
                  className="w-full bg-crema dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="password"
                  placeholder="testpassword"
                  className="w-full bg-crema dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {isRegistering && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      type="password"
                      placeholder="Repite tu contraseña"
                      className="w-full bg-crema dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tipo de Usuario</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(AppRole.OWNER)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedRole === AppRole.OWNER 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-crema dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <UserIcon className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase">Dueño</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole(AppRole.VETERINARIAN)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedRole === AppRole.VETERINARIAN 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-crema dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <Shield className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase">Veterinario</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-bold text-slate-400 hover:text-primary transition-colors"
            >
              {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿Eres nuevo usuario? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
