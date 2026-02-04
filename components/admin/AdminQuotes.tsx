
import React from 'react';
import { Quote } from '../../types';
import { Search, Filter, MoreHorizontal, MapPin, ArrowRight, Calendar, User, Eye, CheckCircle2, Truck, X } from 'lucide-react';

interface Props {
  quotes: Quote[];
  onUpdateStatus: (id: string, status: Quote['status']) => void;
  onSearch: (term: string) => void;
  onView: (id: string) => void;
  detail?: any | null;
  onCloseDetail?: () => void;
}

export const AdminQuotes: React.FC<Props> = ({ quotes, onUpdateStatus, onSearch, onView, detail, onCloseDetail }) => {
  const [menuId, setMenuId] = React.useState<string | null>(null);
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
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-blue-200 hover:bg-blue-50 transition-all">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div key={quote.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
              
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                      <h3 className="font-black text-slate-800 text-sm leading-tight">{quote.userName || 'Cliente Web'}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {quote.id.substring(0, 8).toUpperCase()}
                      </div>
                    </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
                <div className="space-y-3 mb-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Desde</span>
                        <span className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-blue-500" />
                          {quote.origin}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hasta</span>
                        <span className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
                          {quote.destination}
                          <MapPin className="w-3 h-3 text-indigo-500" />
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <Truck className="w-3 h-3" /> {quote.truck}
                      </span>
                      <span className="bg-white px-2.5 py-0.5 rounded-full border border-slate-100 text-blue-600 text-[10px]">{quote.distance} KM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monto Total</span>
                    <span className="text-lg font-black text-slate-900">${quote.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => onUpdateStatus(quote.id, 'Completado')}
                      title="Despachar"
                      className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onView(quote.id)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setMenuId(prev => prev === quote.id ? null : quote.id)} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-all" title="Opciones">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {menuId === quote.id ? (
                  <div className="absolute right-6 bottom-20 z-40 bg-white border border-slate-200 rounded-xl shadow-lg w-44 overflow-hidden">
                    <button onClick={() => { onView(quote.id); setMenuId(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 text-sm">Ver detalle</button>
                    <div className="border-t border-slate-100"></div>
                    <button onClick={() => { onUpdateStatus(quote.id, 'Pendiente'); setMenuId(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 text-sm">Marcar Pendiente</button>
                    <button onClick={() => { onUpdateStatus(quote.id, 'Reservado'); setMenuId(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 text-sm">Marcar Reservado</button>
                    <button onClick={() => { onUpdateStatus(quote.id, 'Completado'); setMenuId(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 text-sm">Marcar Completado</button>
                  </div>
                ) : null}
            </div>
          ))
        )}
      </div>
      {detail ? (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="relative z-50 bg-white rounded-3xl w-full max-w-2xl border border-slate-100 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="font-black text-slate-900">Detalle de Cotización #{String(detail.id)}</div>
              <button onClick={onCloseDetail} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 border rounded-xl">
                  <div className="text-slate-500 text-sm">Origen</div>
                  <div className="font-semibold">{detail.origin || '-'}</div>
                </div>
                <div className="p-3 border rounded-xl">
                  <div className="text-slate-500 text-sm">Destino</div>
                  <div className="font-semibold">{detail.destination || '-'}</div>
                </div>
                <div className="p-3 border rounded-xl">
                  <div className="text-slate-500 text-sm">Distancia</div>
                  <div className="font-semibold">{Number(detail.distance || 0)} km</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Cargas</div>
                <div className="space-y-1">
                  {Array.isArray(detail.loads) && detail.loads.length > 0 ? (
                    detail.loads.map((l: any) => (
                      <div key={l.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
                        <div>{l.description}</div>
                        <div className="text-slate-600">{l.blocks} UC</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500">Sin cargas</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
