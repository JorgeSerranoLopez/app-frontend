
import React from 'react';
import { User as UserType } from '../../types';
import { User, Mail, Shield, History, Settings2, MoreVertical, Search, Key, Trash2 } from 'lucide-react';

interface Props {
  users: UserType[];
}

export const AdminUsers: React.FC<Props> = ({ users }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Directorio de Usuarios</h2>
          <p className="text-slate-500 font-medium">Controla accesos, roles y audita la actividad de clientes.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            className="pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all w-full lg:w-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative">
            <button className="absolute top-6 right-6 p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-5 mb-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 transform group-hover:rotate-6 transition-transform">
                  <User className="w-8 h-8" />
                </div>
                {user.isAdmin && (
                  <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-md border border-slate-50">
                    <Shield className="w-4 h-4 text-blue-500" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-1.5 leading-tight">
                  {user.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Mudanzas</span>
                <div className="flex items-center gap-2 font-black text-slate-800">
                  <History className="w-4 h-4 text-blue-400" />
                  {user.history?.length || 0}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Nivel de Acceso</span>
                <div className={`font-black text-[10px] uppercase tracking-widest ${user.isAdmin ? 'text-blue-600' : 'text-slate-600'}`}>
                  {user.isAdmin ? 'Súper Admin' : 'Cliente Estándar'}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button className="flex-1 bg-slate-900 hover:bg-black text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                <Settings2 className="w-4 h-4" />
                Configurar
              </button>
              <button className="p-3.5 border-2 border-slate-50 text-slate-400 rounded-2xl hover:border-red-100 hover:text-red-500 hover:bg-red-50 transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
