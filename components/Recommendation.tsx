import React, { useState } from 'react';
import { Truck, Check, X, ArrowLeft, DollarSign, Save, MapPin } from 'lucide-react';
import { TRUCK_CAPACITY, Quote } from '../types';

interface Props {
  totalBlocks: number;
  onBack: () => void;
  onSave: (quote: Omit<Quote, 'id' | 'date' | 'status'>) => void;
}

export const Recommendation: React.FC<Props> = ({ totalBlocks, onBack, onSave }) => {
  const [route, setRoute] = useState('');
  const [error, setError] = useState('');

  // Logic: Recommend M if > 36
  const recommendM = totalBlocks > TRUCK_CAPACITY.S;
  const recommendedTruck = recommendM ? 'M' : 'S';
  const estimatedPrice = recommendM ? 200 : 120;

  const handleSave = () => {
    if (!route.trim()) {
      setError('Por favor ingresa una ruta o nombre para la cotización.');
      return;
    }
    onSave({
      route: route,
      truck: `Camión ${recommendedTruck}`,
      blocks: totalBlocks,
      price: estimatedPrice
    });
  };
  
  const TruckCard = ({ 
    size, 
    capacity, 
    recommended, 
    disabled,
    price 
  }: { 
    size: 'S' | 'M', 
    capacity: number, 
    recommended: boolean, 
    disabled: boolean,
    price: number
  }) => (
    <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 flex flex-col ${
      recommended 
        ? 'border-green-500 bg-white shadow-2xl scale-105 z-10' 
        : disabled 
          ? 'border-red-200 bg-red-50 opacity-60 grayscale' 
          : 'border-slate-200 bg-white hover:border-blue-300'
    }`}>
      {recommended && (
        <div className="absolute top-0 inset-x-0 bg-green-500 text-white text-center text-xs font-bold uppercase tracking-widest py-1">
          Recomendado
        </div>
      )}
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20 backdrop-blur-[1px]">
             <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold flex items-center gap-2 border border-red-200 shadow-sm">
                <X className="w-5 h-5" />
                Espacio Insuficiente
             </div>
        </div>
      )}

      <div className={`p-8 flex flex-col h-full ${recommended ? 'pt-10' : ''}`}>
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-2xl font-bold text-slate-800">Camión {size}</h3>
                <p className="text-slate-500 text-sm">Capacidad estándar</p>
            </div>
            <Truck className={`w-10 h-10 ${recommended ? 'text-green-500' : 'text-slate-400'}`} />
        </div>

        <div className="flex-1 space-y-4">
             <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-3">
                <span className="text-slate-500">Capacidad Total</span>
                <span className="font-semibold text-slate-800">{capacity} Bloques</span>
             </div>
             <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-3">
                <span className="text-slate-500">Tu Carga</span>
                <span className={`font-semibold ${disabled ? 'text-red-500' : 'text-slate-800'}`}>
                    {totalBlocks} Bloques
                </span>
             </div>
             <div className="pt-2">
                <span className="text-3xl font-bold text-slate-800 flex items-center">
                    <DollarSign className="w-6 h-6 text-slate-400" />
                    {price}
                </span>
                <span className="text-xs text-slate-400">Precio estimado</span>
             </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Resultado de tu cálculo</h2>
        <p className="text-slate-500">Basado en {totalBlocks} bloques de volumen total.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center justify-center py-8">
        <TruckCard 
            size="S" 
            capacity={TRUCK_CAPACITY.S} 
            recommended={!recommendM} 
            disabled={recommendM}
            price={120}
        />
        <TruckCard 
            size="M" 
            capacity={TRUCK_CAPACITY.M} 
            recommended={recommendM} 
            disabled={false} 
            price={200}
        />
      </div>

      {/* Save / Reserve Action */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 max-w-2xl mx-auto">
         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Guardar Cotización
         </h3>
         <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1">
                <input 
                    type="text" 
                    value={route}
                    onChange={(e) => {
                        setRoute(e.target.value);
                        setError('');
                    }}
                    placeholder="Ej: Centro -> Condesa"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
             </div>
             <button 
                onClick={handleSave}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
                <Save className="w-4 h-4" />
                Reservar / Guardar
             </button>
         </div>
      </div>

      <div className="flex justify-center pt-4">
        <button 
            onClick={onBack}
            className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2"
        >
            <ArrowLeft className="w-4 h-4" />
            Volver y editar items
        </button>
      </div>
    </div>
  );
};