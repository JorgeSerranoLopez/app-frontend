import React from 'react';
import { Truck, Check, X, ArrowLeft, ArrowRight, DollarSign, Save, MapPin, Route } from 'lucide-react';
import { TRUCK_CAPACITY, TRUCK_BASE_PRICES, PRICE_PER_KM, Quote } from '../types';

interface Props {
  totalBlocks: number;
  origin: string;
  destination: string;
  distance: number;
  onBack: () => void;
  onSave: (quote: Omit<Quote, 'id' | 'date' | 'status'>) => void;
}

export const Recommendation: React.FC<Props> = ({ 
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
      <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
          <div className="flex justify-between text-slate-500">
              <span>Tarifa Base (Camión {recommendedSize})</span>
              <span>${currentPricing.base.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500">
              <span>Distancia ({distance} km x ${PRICE_PER_KM})</span>
              <span>${currentPricing.distanceCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-200 text-lg">
              <span>Total Estimado</span>
              <span>${currentPricing.total.toLocaleString()}</span>
          </div>
      </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Tu Mudanza Ideal</h2>
        <div className="flex items-center justify-center gap-2 text-slate-500">
            <MapPin className="w-4 h-4" />
            <span>{origin}</span>
            <ArrowRight className="w-3 h-3" />
            <span>{destination}</span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold ml-1">{distance} km</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-xl overflow-hidden">
         {isOverflow ? (
             <div className="p-12 text-center text-red-600">
                 <X className="w-16 h-16 mx-auto mb-4" />
                 <h3 className="text-2xl font-bold mb-2">Carga Excesiva</h3>
                 <p className="text-slate-600">Tu carga de {totalBlocks} bloques excede nuestro camión más grande (XL - 144 bloques). Por favor contacta soporte para una mudanza industrial.</p>
             </div>
         ) : (
            <>
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold">Camión {recommendedSize}</h3>
                        <p className="text-blue-100 text-sm">Recomendado para {totalBlocks} bloques</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold">${currentPricing.total.toLocaleString()}</span>
                        <p className="text-blue-200 text-xs">Precio final</p>
                    </div>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-slate-800">Detalle del costo</h4>
                        <PricingBreakdown />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm border border-yellow-100">
                        <Route className="w-5 h-5 flex-shrink-0" />
                        <p>El precio incluye chofer y combustible para la ruta seleccionada.</p>
                    </div>

                    <button 
                        onClick={handleSave}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Confirmar y Reservar
                    </button>
                </div>
            </>
         )}
      </div>

      <div className="flex justify-center">
        <button 
            onClick={onBack}
            className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2"
        >
            <ArrowLeft className="w-4 h-4" />
            Volver y editar
        </button>
      </div>
    </div>
  );
};