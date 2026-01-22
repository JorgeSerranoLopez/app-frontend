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
    <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
      
      {/* LEFT PANEL: Route & Item Selector */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Route Selector Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Navigation className="w-5 h-5 text-blue-500" />
                Configurar Ruta
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Desde</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <select 
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm appearance-none bg-white"
                        >
                            <option value="">Seleccionar Comuna</option>
                            {COMUNAS_RM.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Hasta</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <select 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm appearance-none bg-white"
                        >
                            <option value="">Seleccionar Comuna</option>
                            {COMUNAS_RM.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                {distance > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between text-sm text-blue-700">
                        <span className="font-medium">Distancia estimada:</span>
                        <span className="font-bold">{distance} km</span>
                    </div>
                )}
            </div>
        </div>

        {/* Item Selector */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-500" />
            Agregar Muebles
            </h3>
            <p className="text-sm text-slate-500 mb-2">Selecciona los artículos.</p>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {FURNITURE_CATALOG.map((item) => (
                <button
                key={item.id}
                onClick={() => handleAddItemClick(item)}
                className={`w-full group flex items-center justify-between p-4 rounded-xl border transition-all bg-white ${
                    (!origin || !destination) ? 'opacity-50 cursor-not-allowed border-slate-100' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
                >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white text-slate-600 transition-colors">
                    <FurnitureIcon type={item.icon} className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                    <span className="block font-medium text-slate-800">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.blocks} Bloques</span>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all font-bold">
                    +
                </div>
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* CENTER/RIGHT PANEL: Visualization */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Progress Bar & Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Ocupación Total</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${isOverCapacity ? 'text-red-500' : 'text-slate-800'}`}>
                  {totalBlocks}
                </span>
                <span className="text-slate-400 font-medium">/ {maxCapacity} Bloques (Max XL)</span>
              </div>
            </div>
            {isOverCapacity && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium animate-pulse">
                <AlertCircle className="w-4 h-4" />
                Excede Camión XL
              </div>
            )}
          </div>
          
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${
                isOverCapacity ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* The Grid (12x12) */}
        <div className="flex-1 bg-slate-200/50 rounded-2xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Vista Planta (Hasta 12x12)
            </div>

            {/* Grid Container */}
            <div className="relative grid grid-cols-12 gap-1 w-full max-w-xl aspect-square bg-white p-4 shadow-xl rounded-xl">
              
              {/* Overlay Guides for Truck Sizes */}
              {/* Truck S (6x6) */}
              <div className="absolute top-4 left-4 border-2 border-dashed border-blue-200 pointer-events-none z-10"
                   style={{ 
                       width: 'calc(50% - 1rem)', 
                       height: 'calc(50% - 1rem)' 
                    }}>
                 <span className="absolute bottom-1 right-1 text-[10px] text-blue-300 font-bold">S</span>
              </div>
              {/* Truck M (8x8) */}
              <div className="absolute top-4 left-4 border-2 border-dashed border-indigo-200 pointer-events-none z-10"
                   style={{ 
                       width: 'calc(66.6% - 1rem)', 
                       height: 'calc(66.6% - 1rem)' 
                    }}>
                    <span className="absolute bottom-1 right-1 text-[10px] text-indigo-300 font-bold">M</span>
              </div>
               {/* Truck L (10x10) */}
               <div className="absolute top-4 left-4 border-2 border-dashed border-purple-200 pointer-events-none z-10"
                   style={{ 
                       width: 'calc(83.3% - 1rem)', 
                       height: 'calc(83.3% - 1rem)' 
                    }}>
                    <span className="absolute bottom-1 right-1 text-[10px] text-purple-300 font-bold">L</span>
              </div>

              {gridCells.map((_, i) => {
                const isFilled = i < totalBlocks;
                const isOverflowState = totalBlocks > maxCapacity;
                
                let cellColor = 'bg-slate-100'; 
                if (isFilled) {
                    cellColor = isOverflowState ? 'bg-red-400' : 'bg-green-400';
                }

                return (
                  <div 
                    key={i}
                    className={`rounded-[2px] transition-all duration-300 ${cellColor} ${isFilled ? 'shadow-inner' : ''}`}
                  ></div>
                );
              })}
            </div>
            
            <div className="mt-4 flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-200"></div> Camión S</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-200"></div> Camión M</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-200"></div> Camión L</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white border"></div> Camión XL</span>
            </div>
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
                    Limpiar
                </button>
                {selectedItems.length > 0 && (
                     <button 
                        onClick={() => onRemoveItem(selectedItems.length - 1)}
                        className="flex items-center gap-2 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Deshacer
                    </button>
                )}
            </div>

            <button
                onClick={handleFinishClick}
                disabled={selectedItems.length === 0 || !origin || !destination}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                    (selectedItems.length === 0 || !origin || !destination)
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-slate-900 hover:bg-slate-800 hover:shadow-slate-900/30'
                }`}
            >
                Calcular Precio
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};