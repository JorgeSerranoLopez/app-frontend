
import React from 'react';
import { Quote } from '../../types';
import { Search, Filter, MoreHorizontal, MapPin, ArrowRight, Calendar, User, Eye, CheckCircle2, Truck, DollarSign } from 'lucide-react';

interface Props {
  quotes: Quote[];
  onUpdateStatus: (id: string, status: Quote['status']) => void;
}

export const AdminQuotes: React.FC<Props> = ({ quotes, onUpdateStatus }) => {
  const getStatusStyle = (status: Quote['status']) => {
    switch (status) {
      case 'Completado': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Reservado': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Pendiente': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestión Operativa</h2>
          <p className="text-slate-500 font-medium">Monitorea y despacha las cotizaciones activas en el sistema.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por cliente o ID..." 
              className="pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all w-full lg:w-72"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-blue-200 hover:bg-blue-50 transition-all">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.length === 0 ? (
          <div className="col-span-full py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-slate-300" />
             </div>
             <div className="space-y-1">
                <p className="text-xl font-black text-slate-800">Sin Solicitudes Pendientes</p>
                <p className="text-slate-400 font-medium">Las nuevas cotizaciones aparecerán automáticamente aquí.</p>
             </div>
          </div>
        ) : (
          quotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 shadow-sm">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-xl leading-tight">{quote.userName || 'Cliente Web'}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        <Calendar className="w-3 h-3" />
                        ID: {quote.id.substring(0, 8).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${getStatusStyle(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Desde</span>
                            <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-blue-500" />
                                {quote.origin}
                            </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                        <div className="flex flex-col text-right">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Hasta</span>
                            <span className="font-bold text-slate-700 text-sm flex items-center justify-end gap-2">
                                {quote.destination}
                                <MapPin className="w-3 h-3 text-indigo-500" />
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span className="flex items-center gap-2">
                          <Truck className="w-3 h-3" /> {quote.truck}
                       </span>
                       <span className="bg-white px-3 py-1 rounded-full border border-slate-100 text-blue-600">{quote.distance} KM</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monto Total</span>
                    <span className="text-2xl font-black text-slate-900">${quote.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onUpdateStatus(quote.id, 'Completado')}
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      title="Despachar"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                    <button className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <Eye className="w-6 h-6" />
                    </button>
                    <button className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all">
                      <MoreHorizontal className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
