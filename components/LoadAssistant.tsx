import React from 'react';
import { ArrowRight, Trash2, Box, AlertCircle, RotateCcw } from 'lucide-react';
import { FurnitureIcon } from './ui/FurnitureIcon';
import { FURNITURE_CATALOG, FurnitureItem, SelectedItem, TRUCK_CAPACITY } from '../types';

interface Props {
  selectedItems: SelectedItem[];
  onAddItem: (item: FurnitureItem) => void;
  onRemoveItem: (index: number) => void;
  onReset: () => void;
  onFinish: () => void;
}

export const LoadAssistant: React.FC<Props> = ({ 
  selectedItems, 
  onAddItem, 
  onRemoveItem, 
  onReset,
  onFinish 
}) => {
  const totalBlocks = selectedItems.reduce((acc, item) => acc + item.blocks, 0);
  const isOverCapacityS = totalBlocks > TRUCK_CAPACITY.S;
  
  // Grid visualization (6x6 = 36 blocks for Truck S visual reference)
  const gridCells = Array.from({ length: TRUCK_CAPACITY.S });
  
  // Calculate percentage for progress bar
  const percentage = Math.min((totalBlocks / TRUCK_CAPACITY.S) * 100, 100);

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
      
      {/* LEFT PANEL: Item Selector */}
      <div className="lg:col-span-4 flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Box className="w-5 h-5 text-blue-500" />
          Agregar Muebles
        </h3>
        <p className="text-sm text-slate-500 mb-2">Selecciona los artículos para cargar al camión.</p>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {FURNITURE_CATALOG.map((item) => (
            <button
              key={item.id}
              onClick={() => onAddItem(item)}
              className="w-full group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white text-slate-600 transition-colors">
                  <FurnitureIcon type={item.icon} className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block font-medium text-slate-800">{item.name}</span>
                  <span className="text-xs text-slate-500">{item.blocks} Bloques (50x50cm)</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all font-bold">
                +
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CENTER/RIGHT PANEL: Visualization */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Progress Bar & Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Ocupación (Camión S)</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${isOverCapacityS ? 'text-red-500' : 'text-slate-800'}`}>
                  {totalBlocks}
                </span>
                <span className="text-slate-400 font-medium">/ {TRUCK_CAPACITY.S} Bloques</span>
              </div>
            </div>
            {isOverCapacityS && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium animate-pulse">
                <AlertCircle className="w-4 h-4" />
                Capacidad excedida
              </div>
            )}
          </div>
          
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${
                isOverCapacityS ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* The Grid */}
        <div className="flex-1 bg-slate-200/50 rounded-2xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Vista Planta Camión S (6x6)
            </div>

            <div className="grid grid-cols-6 gap-2 w-full max-w-md aspect-square bg-white p-4 shadow-xl rounded-xl">
              {gridCells.map((_, i) => {
                // If this cell index is less than totalBlocks, it is filled.
                // If the index + 1 is greater than 36 (implied by rendering loop limit, but handled by color logic), 
                // we show red if overall total > 36.
                
                // Visual Logic: We only show 36 cells.
                // If we have 5 items of 1 block, cells 0-4 are green.
                // If total > 36, ALL 36 cells become red to indicate overflow of this truck size.
                
                const isFilled = i < totalBlocks;
                const isOverflowState = totalBlocks > TRUCK_CAPACITY.S;
                
                let cellColor = 'bg-slate-100'; // Empty
                if (isFilled) {
                    cellColor = isOverflowState ? 'bg-red-400' : 'bg-green-400';
                }

                return (
                  <div 
                    key={i}
                    className={`rounded-md transition-all duration-300 ${cellColor} ${isFilled ? 'shadow-inner scale-100' : 'scale-95'}`}
                  ></div>
                );
              })}
            </div>
            
            {/* Overlay for large excess */}
            {totalBlocks > TRUCK_CAPACITY.S && (
                <div className="mt-4 text-center">
                    <p className="text-red-600 font-bold">
                        +{totalBlocks - TRUCK_CAPACITY.S} Bloques extra
                    </p>
                    <p className="text-xs text-slate-500">Se recomendará un camión más grande.</p>
                </div>
            )}
        </div>

        {/* Action Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center justify-between sticky bottom-4">
            <div className="flex items-center gap-4 text-sm text-slate-500">
                <button 
                    onClick={onReset}
                    className="flex items-center gap-2 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                    disabled={selectedItems.length === 0}
                >
                    <Trash2 className="w-4 h-4" />
                    Limpiar todo
                </button>
                {selectedItems.length > 0 && (
                     <button 
                        onClick={() => onRemoveItem(selectedItems.length - 1)}
                        className="flex items-center gap-2 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Deshacer último
                    </button>
                )}
            </div>

            <button
                onClick={onFinish}
                disabled={selectedItems.length === 0}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                    selectedItems.length === 0 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-slate-900 hover:bg-slate-800 hover:shadow-slate-900/30'
                }`}
            >
                Calcular y Finalizar
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};