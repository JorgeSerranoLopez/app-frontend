    import React, { useState, useEffect } from 'react';
    import { ArrowRight, Trash2, Box, AlertCircle, RotateCcw, MapPin, Navigation, Truck } from 'lucide-react';
    import { FurnitureIcon } from './ui/FurnitureIcon';
    import { FURNITURE_CATALOG, FurnitureItem, SelectedItem, TRUCK_DIMENSIONS, COMUNAS_RM, TruckSize } from '../types';

    interface Props {
    selectedItems: SelectedItem[];
    truckSize: TruckSize;
    onAddItem: (item: FurnitureItem) => void;
    onRemoveItem: (index: number) => void;
    onReset: () => void;
    onFinish: (origin: string, destination: string, distance: number) => void;
    }

    export const LoadAssistant: React.FC<Props> = ({ 
    selectedItems, 
    truckSize,
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
            const seed = origin.length + destination.length;
            const calcDistance = 5 + (seed * 7 % 40);
            setDistance(calcDistance);
        }
        } else {
        setDistance(0);
        }
    }, [origin, destination]);

    const gridSize = TRUCK_DIMENSIONS[truckSize];
    
    // Construct the visualization grid
    // We create a flat array representing the grid cells to map over
    const renderGrid = () => {
        const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
        
        // Fill grid with items
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

    // Helper to determine cell styling
    const getCellStyles = (item: SelectedItem | null) => {
        if (!item) return "bg-slate-50/50 border-slate-100";
        return `${item.color} border-black/10 shadow-sm z-10`;
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
                            {/* Visual representation of shape (mini grid) */}
                            <div className="flex flex-col gap-[1px] mt-1">
                                {item.shape.map((row, i) => (
                                    <div key={i} className="flex gap-[1px]">
                                        {row.map((cell, j) => (
                                            <div key={j} className={`w-1.5 h-1.5 rounded-[1px] ${cell ? 'bg-slate-400' : 'bg-transparent'}`}></div>
                                        ))}
                                    </div>
                                ))}
                            </div>
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
            
            {/* Info Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Camión Actual: {truckSize}</h2>
                        <p className="text-slate-500 text-sm">{gridSize}x{gridSize} Bloques</p>
                    </div>
                </div>
                
                <div className="flex gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className={`px-2 py-1 rounded ${truckSize === 'S' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>S</span>
                    <span className={`px-2 py-1 rounded ${truckSize === 'M' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>M</span>
                    <span className={`px-2 py-1 rounded ${truckSize === 'L' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>L</span>
                    <span className={`px-2 py-1 rounded ${truckSize === 'XL' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>XL</span>
                </div>
            </div>

            {/* The Grid Visualization */}
            <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-200 p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-0">
                <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded backdrop-blur-sm">
                    Vista Planta
                </div>

                {/* Grid Container */}
                <div className="relative w-full max-w-lg aspect-square bg-white shadow-2xl rounded-xl border border-slate-200/60 p-2 sm:p-4 overflow-hidden">
                    
                    {/* Dynamic Grid */}
                    <div 
                        className="grid gap-1 w-full h-full"
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
                                        rounded-[2px] sm:rounded-sm border border-opacity-20 transition-all duration-300
                                        ${getCellStyles(cellItem)}
                                    `}
                                >
                                    {cellItem && (
                                        // Optional: Small icon or indicator inside the block if it's the "main" block of the item (top-left) could go here
                                        // For now, color is enough
                                        <div className="w-full h-full"></div>
                                    )}
                                </div>
                            ))
                        ))}
                    </div>
                </div>
                
                <div className="mt-6 text-center text-slate-400 text-xs">
                    Los muebles se organizan automáticamente para optimizar el espacio (Bin Packing).
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
                            <span className="hidden sm:inline">Deshacer Último</span>
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