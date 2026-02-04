
  import React, { useState } from 'react';
  import { LayoutGrid, UserPlus, LogIn, UserCircle, ArrowRight, Sparkles, ShieldCheck, Lock } from 'lucide-react';

  interface Props {
    onLogin: (email: string, pass: string, adminOnly?: boolean) => void;
    onRegister: (name: string, email: string, pass: string) => void;
    onGuestAccess: () => void;
    error?: string | null;
    isPending?: boolean;
  }

  export const Auth: React.FC<Props> = ({ onLogin, onRegister, onGuestAccess, error, isPending }) => {
    const [isRegistering, setIsRegistering] = useState(isPending);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isRegistering) {
        onRegister(name, email, password);
      } else {
        onLogin(email, password, isAdminMode);
      }
    };

    const toggleAdminMode = () => {
      setIsAdminMode(!isAdminMode);
      setIsRegistering(false);
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="mb-10 flex flex-col items-center">
          <div className={`p-4 rounded-[2rem] text-white mb-4 shadow-2xl transition-all duration-500 rotate-3 ${isAdminMode ? 'bg-slate-900 shadow-slate-900/40' : 'bg-blue-600 shadow-blue-500/40'}`}>
            {isAdminMode ? <ShieldCheck className="w-10 h-10" /> : <LayoutGrid className="w-10 h-10" />}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isAdminMode ? 'MudanzaApp Admin' : 'MudanzaApp'}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isAdminMode ? 'Panel de control de infraestructura' : 'Tu logística personal potenciada por IA'}
          </p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 ${isAdminMode ? 'bg-slate-900' : 'bg-gradient-to-r from-blue-400 to-indigo-600'}`}></div>
          
          {isPending && !isAdminMode && (
            <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-2xl animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Casi listo</p>
              </div>
              <p className="text-xs font-bold text-slate-600">Regístrate para guardar tu cotización y confirmar la fecha de tu mudanza.</p>
            </div>
          )}

          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => setIsRegistering(false)}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                !isRegistering 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isAdminMode ? 'Acceso Admin' : 'Ingresar'}
            </button>
            {!isAdminMode && (
              <button
                onClick={() => setIsRegistering(true)}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                  isRegistering 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Registro
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="animate-fade-in">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700"
                  placeholder="Ej. Alejandro Pérez"
                />
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                {isAdminMode ? 'Email Administrativo' : 'Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none transition-all font-bold text-slate-700 ${isAdminMode ? 'focus:border-slate-900 focus:ring-slate-900/10' : 'focus:border-blue-500 focus:ring-blue-500/10'}`}
                placeholder={isAdminMode ? 'admin@mudanzaapp.com' : 'nombre@ejemplo.com'}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none transition-all font-bold text-slate-700 ${isAdminMode ? 'focus:border-slate-900 focus:ring-slate-900/10' : 'focus:border-blue-500 focus:ring-blue-500/10'}`}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 flex items-center gap-3 animate-shake">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group mt-6 ${isAdminMode ? 'bg-slate-900 hover:bg-black text-white shadow-slate-900/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
            >
              {isAdminMode ? 'Entrar al Portal' : (isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {!isPending && (
            <div className="mt-8 space-y-4">
              <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]"><span className="bg-white px-4 text-slate-300">Explorar</span></div>
              </div>

              <button
                onClick={onGuestAccess}
                className="w-full bg-white border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-slate-600 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 group"
              >
                <UserCircle className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
                Continuar como Invitado
              </button>

              <button
                onClick={toggleAdminMode}
                className={`w-full py-4 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-2xl ${isAdminMode ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <Lock className="w-3 h-3" />
                {isAdminMode ? 'Volver a Clientes' : 'Acceso Administrativo'}
              </button>
            </div>
          )}
        </div>
        
        <p className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">v2.5 Smart Logistics System</p>
      </div>
    );
  };
