import React from 'react';
import { PlusCircle, Clock, CheckCircle2, MapPin } from 'lucide-react';

interface Props {
  onStartQuote: () => void;
}

const HISTORY_DATA = [
  { id: 1, date: '12 Oct 2023', route: 'Centro -> Norte', status: 'Completado', truck: 'Camión S' },
  { id: 2, date: '05 Sep 2023', route: 'Condesa -> Polanco', status: 'Completado', truck: 'Camión M' },
  { id: 3, date: '28 Ago 2023', route: 'Sur -> Centro', status: 'Cancelado', truck: '-' },
];

export const Dashboard: React.FC<Props> = ({ onStartQuote }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Hola, Alejandro 👋</h1>
        <p className="text-slate-500">Bienvenido a tu panel de control de mudanzas.</p>
      </header>

      {/* Hero Action */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold">¿Planeando una nueva mudanza?</h2>
          <p className="text-blue-100">Calcula el espacio exacto que necesitas en segundos.</p>
        </div>
        <button
          onClick={onStartQuote}
          className="group bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 transform hover:scale-105"
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Ruta</th>
                <th className="px-6 py-4">Camión</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {HISTORY_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.date}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {item.route}
                  </td>
                  <td className="px-6 py-4">{item.truck}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Completado'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status === 'Completado' && <CheckCircle2 className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};