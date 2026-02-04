
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, Trash2, Box, AlertCircle, RotateCcw, 
  MapPin, Navigation, Truck, LayoutGrid, 
  Zap, ChevronRight, Info, Layers
} from 'lucide-react';
import { FurnitureIcon } from './ui/FurnitureIcon';
import { FURNITURE_CATALOG, FurnitureItem, SelectedItem, TRUCK_DIMENSIONS, TRUCK_CAPACITY, COMUNAS_RM, TruckSize } from '../types';

interface Props {
  selectedItems: SelectedItem[];
  truckSize: TruckSize;
  onAddItem: (item: FurnitureItem) => void;
  onRemoveItem: (index: number) => void;
  onReset: () => void;
  onFinish: (origin: string, destination: string, distance: number) => void;
}

type Category = 'Todos' | 'Básicos' | 'Living' | 'Dormitorio' | 'Oficina';

export const LoadAssistant: React.FC<Props> = ({ 
  selectedItems, 
  truckSize,
  onAddItem, 
  onRemoveItem, 
  onReset,
  onFinish 
}) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');

  // Logic for the Categories
  const categorizedCatalog = useMemo(() => {
    return FURNITURE_CATALOG.filter(item => {
      if (activeCategory === 'Todos') return true;
      if (activeCategory === 'Básicos') return ['box', 'nightstand', 'microwave'].includes(item.id);
      if (activeCategory === 'Living') return ['sofa', 'tv', 'dining', 'chair'].includes(item.id);
      if (activeCategory === 'Dormitorio') return ['bed', 'wardrobe', 'nightstand'].includes(item.id);
      if (activeCategory === 'Oficina') return ['desk', 'chair', 'box'].includes(item.id);
      return true;
    });
  }, [activeCategory]);

  useEffect(() => {
    if (origin && destination) {
      if (origin === destination) {
        setDistance(0);
      } else {
        const seed = origin.length + destination.length;
        const calcDistance = 5 + (seed * 7 % 40);
        setDistance(calcDistance);
      }
    } else {
      setDistance(0);
    }
  }, [origin, destination]);

  const gridSize = TRUCK_DIMENSIONS[truckSize];
  const capacity = TRUCK_CAPACITY[truckSize];
  const occupiedBlocks = selectedItems.reduce((acc, item) => acc + item.blocks, 0);
  const occupancyPercent = Math.round((occupiedBlocks / capacity) * 100);

  const renderGrid = () => {
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    selectedItems.forEach(item => {
        if (item.position) {
            const { x, y } = item.position;
            item.shape.forEach((row, rIndex) => {
                row.forEach((cell, cIndex) => {
                    if (cell === 1) {
                        if (grid[y + rIndex] && grid[y + rIndex][x + cIndex] !== undefined) {
                            grid[y + rIndex][x + cIndex] = item;
                        }
                    }
                });
            });
        }
    });
    return grid;
  };

  const gridData = renderGrid();

  const handleAddItemClick = (item: FurnitureItem) => {
    if (!origin || !destination) {
      alert("⚠️ Selecciona origen y destino primero.");
      return;
    }
    onAddItem(item);
  };

  const getCapacityFeedback = () => {
    if (occupancyPercent === 0) return "El camión está vacío. ¡Empieza a cargar!";
    if (occupancyPercent < 50) return "¡Buen ritmo! Tienes mucho espacio aún.";
    if (occupancyPercent < 85) return "Se está llenando. ¡Optimiza los rincones!";
    if (occupancyPercent < 100) return "¡Casi al límite! Quizás un objeto más.";
    return "¡CAPACIDAD MÁXIMA ALCANZADA!";
  };

  const getMeterColor = () => {
    if (occupancyPercent < 60) return "bg-emerald-500";
    if (occupancyPercent < 85) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-full min-h-[85vh]">
      
      {/* LEFT: Item Selector & Route */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Step 1: Route */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-800 flex items-center gap-2 text-xs uppercase tracking-widest">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    1. Ruta del Camión
                </h3>
                {distance > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
                        {distance} KM
                    </span>
                )}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Origen</label>
                    <select 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 font-bold text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                        <option value="">Seleccionar</option>
                        {COMUNAS_RM.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Destino</label>
                    <select 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 font-bold text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                        <option value="">Seleccionar</option>
                        {COMUNAS_RM.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {/* Step 2: Furniture Picker */}
        <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-6 flex flex-col min-h-0">
            <h3 className="font-black text-slate-800 flex items-center gap-2 mb-6 text-xs uppercase tracking-widest">
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                2. Cargar Inventario
            </h3>

            {/* Categories */}
            <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['Todos', 'Básicos', 'Living', 'Dormitorio', 'Oficina'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as Category)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            activeCategory === cat 
                                ? 'bg-slate-900 text-white shadow-lg' 
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {categorizedCatalog.map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleAddItemClick(item)}
                    disabled={!origin || !destination}
                    className="w-full group flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                            <FurnitureIcon type={item.icon} className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <span className="block font-black text-slate-800 text-sm leading-tight">{item.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {item.blocks} {item.blocks === 1 ? 'Bloque' : 'Bloques'}
                            </span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-black">
                        +
                    </div>
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* RIGHT: Visualization Game */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Capacity Meter Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Zap size={120} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Monitor de Carga</p>
                    <h2 className="text-3xl font-black tracking-tight">{occupancyPercent}% Ocupado</h2>
                    <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        {getCapacityFeedback()}
                    </p>
                </div>

                <div className="flex-1 max-w-md w-full">
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className={`h-full transition-all duration-700 ease-out ${getMeterColor()}`}
                            style={{ width: `${occupancyPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>0%</span>
                        <span>{occupiedBlocks} / {capacity} BLOQUES</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>
        </div>

        {/* The Truck Blueprint */}
        <div className="flex-1 bg-white rounded-[3rem] border-4 border-slate-100 shadow-sm relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12">
            
            {/* Legend */}
            <div className="absolute top-6 left-8 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Camión {truckSize}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-300" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vista Superior</span>
                </div>
            </div>

            {/* Floating Undo */}
            <div className="absolute top-6 right-8 flex gap-2">
                 <button 
                    onClick={onReset}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm active:scale-90"
                    title="Limpiar Camión"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => onRemoveItem(selectedItems.length - 1)}
                    disabled={selectedItems.length === 0}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all shadow-sm active:scale-90 disabled:opacity-30"
                    title="Deshacer"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            {/* Truck Interior Visualizer */}
            <div className="relative w-full max-w-2xl aspect-square bg-slate-100 rounded-[2rem] border-8 border-slate-200 shadow-inner flex items-center justify-center overflow-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]">
                
                {/* Blueprint lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="w-full h-px bg-slate-900 absolute top-1/2 -translate-y-1/2"></div>
                    <div className="h-full w-px bg-slate-900 absolute left-1/2 -translate-x-1/2"></div>
                </div>

                {/* The Visual Grid */}
                <div 
                    className="grid gap-1.5 p-4 sm:p-6 w-full h-full"
                    style={{ 
                        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))` 
                    }}
                >
                    {gridData.map((row, rowIndex) => (
                        row.map((cellItem: SelectedItem | null, colIndex) => (
                             <div 
                                key={`${rowIndex}-${colIndex}`}
                                className={`
                                    rounded-lg border-2 transition-all duration-500 animate-in zoom-in-75
                                    ${cellItem 
                                        ? `${cellItem.color} border-black/10 shadow-lg relative z-10 scale-100` 
                                        : "bg-white/40 border-slate-200/50 scale-100"
                                    }
                                `}
                            >
                                {cellItem && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden p-0.5">
                                        <FurnitureIcon type={cellItem.icon} className="w-2/3 h-2/3 text-white/40" />
                                    </div>
                                )}
                            </div>
                        ))
                    ))}
                </div>
            </div>

            {/* Footer Prompt */}
            <div className="mt-8 flex items-center gap-3 bg-blue-50/50 px-6 py-3 rounded-2xl border border-blue-100">
                <Zap className="w-4 h-4 text-blue-500" />
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">
                    Optimización Automática de Espacio Activa
                </p>
            </div>
        </div>

        {/* Final CTA */}
        <div className="flex items-center justify-between gap-6">
            <div className="hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trayecto</p>
                <div className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="truncate max-w-[100px]">{origin || 'Origen'}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className="truncate max-w-[100px]">{destination || 'Destino'}</span>
                </div>
            </div>
            
            <button
                onClick={() => onFinish(origin, destination, distance)}
                disabled={selectedItems.length === 0 || !origin || !destination}
                className="flex-1 md:flex-none group bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
                Finalizar Cotización
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
}
