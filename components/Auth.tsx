import React, { useState } from 'react';
import { LayoutGrid, UserPlus, LogIn } from 'lucide-react';

interface Props {
  onLogin: (email: string, pass: string) => void;
  onRegister: (name: string, email: string, pass: string) => void;
  error?: string | null;
}

export const Auth: React.FC<Props> = ({ onLogin, onRegister, error }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isStrong =
      typeof password === 'string' &&
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
    if (isRegistering && !isStrong) {
      alert('La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.');
      return;
    }
    if (isRegistering) {
      onRegister(name, email, password);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-blue-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-blue-500/30">
          <LayoutGrid className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">MudanzaApp</h1>
        <p className="text-slate-500 mt-2">Tu asistente inteligente de mudanzas</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        
        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              !isRegistering 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Ingresar
          </button>
          <button
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              isRegistering 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          {isRegistering ? 'Únete a MudanzaApp' : 'Bienvenido de nuevo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Ej. Alejandro Pérez"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="nombre@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
               {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group mt-4"
          >
            {isRegistering ? (
              <>
                Registrarse <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </>
            ) : (
              <>
                Iniciar Sesión <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
