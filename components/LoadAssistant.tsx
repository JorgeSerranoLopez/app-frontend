import React, { useState, useEffect } from 'react';
import { ArrowRight, Trash2, Box, AlertCircle, RotateCcw, MapPin, Navigation } from 'lucide-react';
import { FurnitureIcon } from './ui/FurnitureIcon';
import { FURNITURE_CATALOG, FurnitureItem, SelectedItem, TRUCK_CAPACITY, COMUNAS_RM } from '../types';

interface Props {
  selectedItems: SelectedItem[];
  onAddItem: (item: FurnitureItem) => void;
  onRemoveItem: (index: number) => void;
  onReset: () => void;
  onFinish: (origin: string, destination: string, distance: number) => void;
}

export const LoadAssistant: React.FC<Props> = ({ 
  selectedItems, 
  onAddItem, 
  onRemoveItem, 
  onReset,
  onFinish 
}) => {
  // Route State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(0);

  // Calculate Distance when routes change
  useEffect(() => {
    if (origin && destination) {
      if (origin === destination) {
        setDistance(0);
      } else {
        // Deterministic pseudo-random distance based on string length to simulate realism
        // Range: 5km to 45km
        const seed = origin.length + destination.length;
        const calcDistance = 5 + (seed * 7 % 40);
        setDistance(calcDistance);
      }
    } else {
      setDistance(0);
    }
  }, [origin, destination]);

  const totalBlocks = selectedItems.reduce((acc, item) => acc + item.blocks, 0);
  const maxCapacity = TRUCK_CAPACITY.XL; // 144 blocks
  const isOverCapacity = totalBlocks > maxCapacity;
  
  // Grid visualization (12x12 = 144 blocks for Max Capacity)
  const gridCells = Array.from({ length: maxCapacity });
  
  // Progress percentage relative to MAX capacity
  const percentage = Math.min((totalBlocks / maxCapacity) * 100, 100);

  const handleAddItemClick = (item: FurnitureItem) => {
    if (!origin || !destination) {
      alert("Por favor selecciona la comuna de origen y destino antes de agregar muebles.");
      return;
    }
    if (origin === destination) {
       alert("El origen y destino no pueden ser iguales.");
       return;
    }
    onAddItem(item);
  };

  const handleFinishClick = () => {
      onFinish(origin, destination, distance);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      
      {/* LEFT PANEL: Route & Item Selector */}
      <div className="lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
        
        {/* Route Selector Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex-shrink-0">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-sm">
                <Navigation className="w-4 h-4 text-blue-500" />
                Configurar Ruta
            </h3>
            <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Desde</label>
                        <div className="relative">
                            <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                            <select 
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs appearance-none bg-white font-medium text-slate-700"
                            >
                                <option value="">Seleccionar</option>
                                {COMUNAS_RM.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Hasta</label>
                        <div className="relative">
                            <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                            <select 
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs appearance-none bg-white font-medium text-slate-700"
                            >
                                <option value="">Seleccionar</option>
                                {COMUNAS_RM.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                {distance > 0 && (
                    <div className="bg-blue-50 px-3 py-2 rounded-lg flex items-center justify-between text-xs text-blue-700 border border-blue-100">
                        <span className="font-medium">Distancia estimada</span>
                        <span className="font-bold">{distance} km</span>
                    </div>
                )}
            </div>
        </div>

        {/* Item Selector */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 p-5 overflow-hidden min-h-0">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2 text-sm">
                <Box className="w-4 h-4 text-blue-500" />
                Agregar Muebles
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
            {FURNITURE_CATALOG.map((item) => (
                <button
                key={item.id}
                onClick={() => handleAddItemClick(item)}
                disabled={!origin || !destination}
                className={`w-full group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                    (!origin || !destination) 
                        ? 'opacity-50 cursor-not-allowed border-slate-50 bg-slate-50' 
                        : 'border-slate-100 bg-white hover:border-blue-300 hover:shadow-md hover:translate-x-1'
                }`}
                >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                        (!origin || !destination) ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                    }`}>
                        <FurnitureIcon type={item.icon} className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <span className="block font-semibold text-slate-700 text-sm">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{item.blocks} Bloques</span>
                    </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                     (!origin || !destination) 
                     ? 'bg-slate-200 text-slate-400'
                     : 'bg-slate-100 text-slate-400 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110'
                }`}>
                    <span className="font-bold text-lg leading-none mb-0.5">+</span>
                </div>
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* CENTER/RIGHT PANEL: Visualization */}
      <div className="lg:col-span-8 flex flex-col gap-4 h-full min-h-0">
        
        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-shrink-0">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ocupación del Camión</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-bold tabular-nums tracking-tight ${isOverCapacity ? 'text-red-500' : 'text-slate-800'}`}>
                  {totalBlocks}
                </span>
                <span className="text-slate-400 font-medium text-sm">/ {maxCapacity} Bloques (Max XL)</span>
              </div>
            </div>
            {isOverCapacity && (
              <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-xs font-bold border border-red-100 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                EXCEDE CAPACIDAD
              </div>
            )}
          </div>
          
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-500 ease-out shadow-sm ${
                isOverCapacity ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* The Grid Visualization */}
        <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-200 p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-0">
            <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded backdrop-blur-sm">
                Vista Planta (12x12)
            </div>

            {/* Grid Container - RESPONSIVE FIXES HERE */}
            <div className="relative w-full max-w-lg aspect-square">
                 {/* Guides Layer */}
                 <div className="absolute inset-0 z-0 pointer-events-none p-1">
                    {/* Truck S (6x6 - 36 blocks) - Top Left 50% */}
                    <div className="absolute top-1 left-1 w-[calc(50%-0.5rem)] h-[calc(50%-0.5rem)] border-r-2 border-b-2 border-dashed border-blue-300/50 rounded-br-lg z-10">
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-blue-400 bg-blue-50 px-1.5 py-0.5 rounded">S</span>
                    </div>
                     {/* Truck M (8x8 - 64 blocks) - Top Left 66.6% */}
                    <div className="absolute top-1 left-1 w-[calc(66.66%-0.5rem)] h-[calc(66.66%-0.5rem)] border-r-2 border-b-2 border-dashed border-indigo-300/50 rounded-br-lg z-0">
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">M</span>
                    </div>
                     {/* Truck L (10x10 - 100 blocks) - Top Left 83.3% */}
                    <div className="absolute top-1 left-1 w-[calc(83.33%-0.5rem)] h-[calc(83.33%-0.5rem)] border-r-2 border-b-2 border-dashed border-purple-300/50 rounded-br-lg -z-10">
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-purple-400 bg-purple-50 px-1.5 py-0.5 rounded">L</span>
                    </div>
                 </div>

                {/* Cells Grid */}
                <div className="grid grid-cols-12 gap-1 w-full h-full p-1 bg-white shadow-2xl rounded-xl border border-slate-200/60 backdrop-blur-sm z-10 relative">
                    {gridCells.map((_, i) => {
                        const isFilled = i < totalBlocks;
                        const isOverflowState = totalBlocks > maxCapacity;
                        
                        // 3D Block Styling Logic
                        let baseClasses = "aspect-square rounded-[2px] sm:rounded-sm transition-all duration-300 ease-out transform";
                        let stateClasses = "";

                        if (isFilled) {
                            if (isOverflowState) {
                                // Red / Overflow - 3D Effect
                                stateClasses = "bg-gradient-to-br from-red-400 via-red-500 to-red-600 border-t border-l border-red-300 shadow-sm scale-95 z-20";
                            } else {
                                // Green / Normal - 3D Effect with subtle lift
                                stateClasses = "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 border-t border-l border-emerald-300 shadow-[1px_1px_2px_rgba(0,0,0,0.1)] scale-100 z-20";
                            }
                        } else {
                            // Empty - Subtle placeholder
                            stateClasses = "bg-slate-50 border border-slate-100/50 scale-90 opacity-50";
                        }

                        return (
                            <div 
                                key={i}
                                className={`${baseClasses} ${stateClasses}`}
                            ></div>
                        );
                    })}
                </div>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-400"></div> Camión S</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-indigo-400"></div> Camión M</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-purple-400"></div> Camión L</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-white border border-slate-300 shadow-sm"></div> Camión XL</span>
            </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
                <button 
                    onClick={onReset}
                    className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 text-sm font-medium"
                    disabled={selectedItems.length === 0}
                >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Limpiar</span>
                </button>
                {selectedItems.length > 0 && (
                     <button 
                        onClick={() => onRemoveItem(selectedItems.length - 1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium"
                    >
                        <RotateCcw className="w-4 h-4" />
                         <span className="hidden sm:inline">Deshacer</span>
                    </button>
                )}
            </div>

            <button
                onClick={handleFinishClick}
                disabled={selectedItems.length === 0 || !origin || !destination}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 text-sm sm:text-base ${
                    (selectedItems.length === 0 || !origin || !destination)
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-slate-900 hover:bg-slate-800 hover:shadow-slate-900/30'
                }`}
            >
                Calcular Precio
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};