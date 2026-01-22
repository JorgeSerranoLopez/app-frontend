import React from 'react';
import { PlusCircle, Clock, CheckCircle2, MapPin, Truck, Inbox, Trash2, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User;
  onStartQuote: () => void;
  onDeleteQuote: (id: string) => void;
}

export const Dashboard: React.FC<Props> = ({ user, onStartQuote, onDeleteQuote }) => {
  const history = user.history || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Hola, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500">Bienvenido a tu panel de control de mudanzas.</p>
      </header>

      {/* Hero Action */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Truck size={120} />
        </div>

        <div className="space-y-2 text-center md:text-left relative z-10">
          <h2 className="text-2xl font-bold">¿Planeando una nueva mudanza?</h2>
          <p className="text-blue-100">Calcula el espacio exacto que necesitas en segundos.</p>
        </div>
        <button
          onClick={onStartQuote}
          className="relative z-10 group bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 transform hover:scale-105"
        >
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Nueva Cotización
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-slate-800">Historial de Cotizaciones</h3>
        </div>
        
        {history.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <Inbox className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-lg font-medium text-slate-600">No tienes cotizaciones aún</p>
            <p className="text-sm">Tus estimaciones guardadas aparecerán aquí.</p>
            <button 
              onClick={onStartQuote}
              className="mt-6 text-blue-600 font-semibold hover:underline"
            >
              Comenzar la primera
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Ruta</th>
                  <th className="px-6 py-4">Distancia</th>
                  <th className="px-6 py-4">Camión</th>
                  <th className="px-6 py-4">Precio Total</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="font-medium">{item.origin}</span>
                        <ArrowRight className="w-3 h-3 text-slate-300" />
                        <span className="font-medium">{item.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.distance} km</td>
                    <td className="px-6 py-4">
                        <span className="font-bold bg-slate-100 px-2 py-1 rounded text-slate-700">
                           {item.truck}
                        </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">${item.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Reservado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.status === 'Reservado' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => onDeleteQuote(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar cotización"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};