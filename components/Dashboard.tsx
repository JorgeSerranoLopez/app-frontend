
  import React from 'react';
  import { PlusCircle, Clock, CheckCircle2, MapPin, Truck, Inbox, Trash2, ArrowRight, Sparkles, Wand2 } from 'lucide-react';
  import { User } from '../types';

  interface Props {
    user: User;
    onStartQuote: () => void;
    onStartAiQuote: () => void;
    onDeleteQuote: (id: string) => void;
  }

  export const Dashboard: React.FC<Props> = ({ user, onStartQuote, onStartAiQuote, onDeleteQuote }) => {
    const history = user.history || [];

    return (
      <div className="space-y-10 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hola, {user.name.split(' ')[0]} 👋</h1>
              <p className="text-slate-500 font-medium">Bienvenido a tu panel de control logístico.</p>
          </div>
          {user.isGuest && (
              <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Modo Invitado</span>
              </div>
          )}
        </header>

        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700">
            <Truck size={240} />
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50"></div>

          <div className="space-y-4 text-center md:text-left relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
              Smart Assistant
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">¿Nueva mudanza en camino?</h2>
            <p className="text-slate-400 font-medium text-lg">Calcula tu espacio en segundos usando nuestra IA o de forma manual.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
            <button
              onClick={onStartAiQuote}
              className="group bg-blue-600 text-white px-8 py-5 rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              Cotizar con IA
            </button>
            
            <button
              onClick={onStartQuote}
              className="group bg-white/10 border border-white/20 text-white px-8 py-5 rounded-2xl font-black shadow-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Manual
            </button>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest text-xs">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Historial de Actividad
              </h3>
          </div>
          
          {history.length === 0 ? (
            <div className="py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center text-slate-400">
              <div className="bg-slate-50 p-6 rounded-[2rem] mb-6">
                <Inbox className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-xl font-black text-slate-800">Bandeja Vacía</p>
              <p className="text-slate-500 font-medium mt-1">Tus cotizaciones guardadas aparecerán aquí.</p>
              {!user.isGuest && (
                  <button onClick={onStartQuote} className="mt-8 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors">Comenzar Ahora</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{item.date}</span>
                              <div className="flex items-center gap-3">
                                  <span className="font-black text-slate-800 text-lg">{item.origin}</span>
                                  <ArrowRight className="w-4 h-4 text-slate-300" />
                                  <span className="font-black text-slate-800 text-lg">{item.destination}</span>
                              </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.status === 'Reservado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                              {item.status}
                          </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-slate-50 p-3 rounded-2xl">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Camión</span>
                              <span className="font-bold text-slate-700 text-xs">{item.truck}</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-2xl">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ruta</span>
                              <span className="font-bold text-slate-700 text-xs">{item.distance} KM</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-2xl">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Carga</span>
                              <span className="font-bold text-slate-700 text-xs">{item.blocks} BLQ</span>
                          </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="text-xl font-black text-slate-900">${item.totalPrice.toLocaleString()}</span>
                          <div className="flex gap-2">
                              <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><CheckCircle2 className="w-5 h-5" /></button>
                              <button onClick={() => onDeleteQuote(item.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                          </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </section>
      </div>
    );
  };
