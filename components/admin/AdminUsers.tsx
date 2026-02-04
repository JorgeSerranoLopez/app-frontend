
  import React from 'react';
  import { User as UserType } from '../../types';
  import { User, Mail, Shield, History, Settings2, MoreVertical, Search, Key, Trash2 } from 'lucide-react';

  interface Props {
    users: UserType[];
    onConfigure: (id: string, nextRole: 'admin' | 'client') => void;
    onDelete: (id: string) => void;
    onSearch?: (term: string) => void;
  }

  export const AdminUsers: React.FC<Props> = ({ users, onConfigure, onDelete, onSearch }) => {
    const [menuId, setMenuId] = React.useState<string | null>(null);
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
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
              <button 
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                onClick={() => setMenuId(prev => prev === String(user.id) ? null : String(user.id))}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuId === String(user.id) ? (
                <div className="absolute right-4 top-12 z-40 bg-white border border-slate-200 rounded-xl shadow-lg w-44 overflow-hidden">
                  {user.isAdmin ? (
                    <button 
                      onClick={() => { onConfigure(user.id, 'client'); setMenuId(null); }} 
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 text-sm"
                    >
                      Quitar privilegios de Admin
                    </button>
                  ) : (
                    <button 
                      onClick={() => { onConfigure(user.id, 'admin'); setMenuId(null); }} 
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 text-sm"
                    >
                      Convertir en Admin
                    </button>
                  )}
                  <div className="border-t border-slate-100"></div>
                  <button 
                    onClick={() => { onDelete(user.id); setMenuId(null); }} 
                    className="w-full text-left px-3 py-2 hover:bg-red-50 text-slate-700 text-sm"
                  >
                    Eliminar usuario
                  </button>
                </div>
              ) : null}

              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  {user.isAdmin && (
                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow border border-slate-100">
                      <Shield className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5 leading-tight">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-50">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Mudanzas</span>
                  <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
                    <History className="w-3.5 h-3.5 text-blue-400" />
                    {user.history?.length || 0}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nivel de Acceso</span>
                  <div className={`font-black text-[10px] uppercase tracking-widest ${user.isAdmin ? 'text-blue-600' : 'text-slate-600'}`}>
                    {user.isAdmin ? 'Administrador' : 'Cliente Estándar'}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => onConfigure(user.id, user.isAdmin ? 'client' : 'admin')} className="flex-1 bg-slate-900 hover:bg-black text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm">
                  <Settings2 className="w-4 h-4" />
                  Configurar
                </button>
                <button onClick={() => onDelete(user.id)} className="p-2.5 border border-slate-100 text-slate-400 rounded-xl hover:border-red-100 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
