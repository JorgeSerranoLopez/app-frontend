import React from 'react';
import { Truck, Check, X, ArrowLeft, DollarSign } from 'lucide-react';
import { TRUCK_CAPACITY } from '../types';

interface Props {
  totalBlocks: number;
  onBack: () => void;
  onRestart: () => void;
}

export const Recommendation: React.FC<Props> = ({ totalBlocks, onBack, onRestart }) => {
  // Logic: Recommend M if > 36
  const recommendM = totalBlocks > TRUCK_CAPACITY.S;
  
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

        {recommended && (
            <button className="mt-8 w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                Seleccionar Camión {size}
                <Check className="w-5 h-5" />
            </button>
        )}
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
        {/* Truck S Card */}
        <TruckCard 
            size="S" 
            capacity={TRUCK_CAPACITY.S} 
            recommended={!recommendM} 
            disabled={recommendM}
            price={120}
        />

        {/* Truck M Card */}
        <TruckCard 
            size="M" 
            capacity={TRUCK_CAPACITY.M} 
            recommended={recommendM} 
            disabled={false} // M is always big enough in this specific logic context (assuming max load fits in M)
            price={200}
        />
      </div>

      <div className="flex justify-center gap-4">
        <button 
            onClick={onBack}
            className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2"
        >
            <ArrowLeft className="w-4 h-4" />
            Editar items
        </button>
        <button 
            onClick={onRestart}
            className="px-6 py-3 rounded-xl font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
            Volver al Dashboard
        </button>
      </div>
    </div>
  );
};