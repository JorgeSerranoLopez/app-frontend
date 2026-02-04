
import React from 'react';
import { Truck, Check, X, ArrowLeft, ArrowRight, DollarSign, Save, MapPin, Route, UserPlus } from 'lucide-react';
import { TRUCK_CAPACITY, TRUCK_BASE_PRICES, PRICE_PER_KM, Quote, User } from '../types';

interface Props {
  user: User;
  totalBlocks: number;
  origin: string;
  destination: string;
  distance: number;
  onBack: () => void;
  onSave: (quote: Omit<Quote, 'id' | 'date' | 'status'>) => void;
}

export const Recommendation: React.FC<Props> = ({ 
  user,
  totalBlocks, 
  origin, 
  destination, 
  distance, 
  onBack, 
  onSave 
}) => {
  
  // Logic to determine best truck
  let recommendedSize = '';
  if (totalBlocks <= TRUCK_CAPACITY.S) recommendedSize = 'S';
  else if (totalBlocks <= TRUCK_CAPACITY.M) recommendedSize = 'M';
  else if (totalBlocks <= TRUCK_CAPACITY.L) recommendedSize = 'L';
  else if (totalBlocks <= TRUCK_CAPACITY.XL) recommendedSize = 'XL';
  else recommendedSize = 'OVERFLOW';

  const isOverflow = recommendedSize === 'OVERFLOW';
  
  // Calculate Prices
  const getPrice = (size: 'S' | 'M' | 'L' | 'XL') => {
      const base = TRUCK_BASE_PRICES[size];
      const distanceCost = distance * PRICE_PER_KM;
      return { base, distanceCost, total: base + distanceCost };
  };

  const currentPricing = !isOverflow ? getPrice(recommendedSize as any) : { base: 0, distanceCost: 0, total: 0 };

  const handleSave = () => {
    onSave({
      origin,
      destination,
      distance,
      truck: `Camión ${recommendedSize}`,
      blocks: totalBlocks,
      basePrice: currentPricing.base,
      distancePrice: currentPricing.distanceCost,
      totalPrice: currentPricing.total
    });
  };
  
  const PricingBreakdown = () => (
      <div className="bg-slate-50 p-6 rounded-3xl space-y-3 text-sm border border-slate-100">
          <div className="flex justify-between text-slate-500 font-medium">
              <span>Tarifa Base (Camión {recommendedSize})</span>
              <span className="text-slate-700">${currentPricing.base.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500 font-medium">
              <span>Distancia ({distance} km x ${PRICE_PER_KM})</span>
              <span className="text-slate-700">${currentPricing.distanceCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-black text-slate-900 pt-4 border-t border-slate-200 text-xl">
              <span>Total Estimado</span>
              <span>${currentPricing.total.toLocaleString()}</span>
          </div>
      </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-[2.5rem] mb-4 shadow-xl shadow-blue-500/10">
            <Truck className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tu Propuesta Logística</h2>
        <div className="flex items-center justify-center gap-3 text-slate-500 font-bold">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{origin}</span>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <span>{destination}</span>
            <span className="bg-blue-600 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black ml-1 shadow-lg shadow-blue-500/20">{distance} km</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden group">
         {isOverflow ? (
             <div className="p-16 text-center text-red-600">
                 <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-black mb-3 text-slate-900">Carga Excesiva Detectada</h3>
                 <p className="text-slate-500 font-medium max-w-sm mx-auto">Tu carga de <strong>{totalBlocks} bloques</strong> excede la capacidad de nuestra flota estándar. Contacta a un ejecutivo para una mudanza industrial.</p>
             </div>
         ) : (
            <>
                <div className="bg-slate-900 p-8 md:p-10 text-white flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        <Truck size={100} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black tracking-tight">Camión {recommendedSize}</h3>
                        <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest mt-1">Capacidad óptima para {totalBlocks} bloques</p>
                    </div>
                    <div className="text-right relative z-10">
                        <span className="text-4xl font-black block">${currentPricing.total.toLocaleString()}</span>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">IVA Incluido</p>
                    </div>
                </div>
                
                <div className="p-10 space-y-8">
                    <div className="space-y-4">
                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                           <DollarSign className="w-4 h-4 text-blue-500" /> Detalle del Presupuesto
                        </h4>
                        <PricingBreakdown />
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-blue-50/50 text-blue-700 rounded-3xl text-sm border border-blue-100 font-medium">
                        <div className="p-2 bg-blue-100 rounded-xl">
                           <Route className="w-5 h-5 flex-shrink-0" />
                        </div>
                        <p>El presupuesto incluye chofer certificado, combustible y seguros de carga para el trayecto.</p>
                    </div>

                    <button 
                        onClick={handleSave}
                        className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 ${
                          user.isGuest 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20' 
                            : 'bg-slate-900 hover:bg-black text-white shadow-slate-900/20'
                        }`}
                    >
                        {user.isGuest ? (
                          <>
                            <UserPlus className="w-6 h-6" />
                            Regístrate para Reservar
                          </>
                        ) : (
                          <>
                            <Save className="w-6 h-6" />
                            Confirmar y Reservar
                          </>
                        )}
                    </button>
                    {user.isGuest && (
                      <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">No perderás tu progreso al registrarte</p>
                    )}
                </div>
            </>
         )}
      </div>

      <div className="flex justify-center">
        <button 
            onClick={onBack}
            className="px-8 py-4 rounded-2xl font-black text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all flex items-center gap-2 uppercase tracking-widest text-xs"
        >
            <ArrowLeft className="w-4 h-4" />
            Editar Inventario
        </button>
      </div>
    </div>
  );
};
