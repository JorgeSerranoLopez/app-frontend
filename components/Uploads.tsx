
  import React, { useState, useEffect } from 'react';
  import { UploadCloud, FileText, Image as ImageIcon, X, Check, Loader2, FileCode, Paperclip, FileStack, Sparkles, Box, Truck, BarChart3, ChevronRight, PlusCircle, Navigation } from 'lucide-react';
  import { COMUNAS_RM } from '../types';

  interface AnalysisResult {
    detectedItems: string[];
    volume: number;
    recommendedTruck: string;
  }

  interface FileItem {
    id: string;
    name: string;
    size: string;
    type: string;
    status: 'uploading' | 'completed';
    analysis?: AnalysisResult;
  }

  interface Props {
    onStartManual: () => void;
    onConfirmAiQuote: (origin: string, destination: string, distance: number, volume: number) => void;
  }

  export const Uploads: React.FC<Props> = ({ onStartManual, onConfirmAiQuote }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [distance, setDistance] = useState<number>(0);
    
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

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files) as File[];
      processFiles(droppedFiles);
    };

    const processFiles = (newFiles: File[]) => {
      const processed: FileItem[] = newFiles.map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
        type: f.type,
        status: 'uploading'
      }));

      setFiles(prev => [...prev, ...processed]);

      processed.forEach(file => {
        // Simulate Deep AI Analysis
        setTimeout(() => {
          const volume = Math.floor(Math.random() * 35) + 5;
          let truck = "Camioneta Pequeña (S)";
          if (volume > 25) truck = "Camión Mudanzero (XL)";
          else if (volume > 10) truck = "Camión 3/4 (L)";

          const simulatedAnalysis: AnalysisResult = {
            detectedItems: ["🛋️ Sofá L", "🛏️ Cama King", "📦 12 Cajas", "📺 TV 65\"", "🚲 Bicicleta"],
            volume,
            recommendedTruck: truck
          };

          setFiles(current => 
            current.map(f => f.id === file.id ? { 
              ...f, 
              status: 'completed',
              analysis: simulatedAnalysis
            } : f)
          );
        }, 3000 + Math.random() * 2000);
      });
    };

    const removeFile = (id: string) => {
      setFiles(prev => prev.filter(f => f.id !== id));
    };

    const getFileIcon = (type: string) => {
      if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
      if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
      return <FileCode className="w-5 h-5 text-slate-500" />;
    };

    return (
      <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI Smart Analysis Engine
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Análisis de Inventario Visual</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">Nuestra red neuronal detectará tus muebles y estimará el volumen exacto para recomendarte el mejor vehículo.</p>
          
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 flex items-center gap-2 text-xs uppercase tracking-widest">
                <Navigation className="w-4 h-4 text-blue-600" />
                Ruta del Camión
              </h3>
              {distance > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
                  {distance} KM
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Origen</label>
                <select 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="">Seleccionar</option>
                  {COMUNAS_RM.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
              <button 
                  onClick={onStartManual}
                  className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-700 transition-colors bg-blue-50 px-5 py-2.5 rounded-2xl"
              >
                  <PlusCircle className="w-4 h-4" />
                  O prefiere carga manual
              </button>
          </div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-4 border-dashed rounded-[3rem] p-16 transition-all duration-700 flex flex-col items-center justify-center gap-8 group overflow-hidden
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-[0_35px_60px_-15px_rgba(59,130,246,0.3)]' 
              : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-slate-200'}
          `}
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-1000 scale-150">
              <FileStack size={200} />
          </div>

          <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 ${isDragging ? 'bg-blue-600 text-white rotate-12 scale-110 shadow-2xl shadow-blue-500/50' : 'bg-slate-100 text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-500 group-hover:-rotate-6'}`}>
            <UploadCloud className="w-12 h-12" />
          </div>
          
          <div className="text-center relative z-10 space-y-2">
            <p className="text-3xl font-black text-slate-800 tracking-tight">Arrastra imágenes de tus muebles</p>
            <p className="text-slate-400 font-bold text-lg italic">o <span className="text-blue-600 not-italic cursor-pointer hover:underline underline-offset-8 decoration-4">explora tus archivos locales</span></p>
          </div>
          
          <input 
            type="file" 
            multiple 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => processFiles(Array.from(e.target.files || []) as File[])}
          />
          
          <div className="flex gap-4 mt-4">
            {['HEIC', 'JPG', 'PNG', 'PDF'].map(ext => (
              <span key={ext} className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black rounded-xl border border-slate-100 group-hover:bg-white group-hover:text-blue-500 group-hover:border-blue-100 transition-all">{ext}</span>
            ))}
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-6 pt-10 pb-20">
            <div className="flex items-center justify-between px-4">
              <h3 className="font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest text-xs">
                <Paperclip className="w-4 h-4 text-blue-500" />
                Procesamiento de Archivos ({files.length})
              </h3>
              <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all uppercase tracking-widest">Nueva Sesión</button>
            </div>
            
            <div className="grid gap-6">
              {files.map((file) => (
                <div key={file.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up">
                  {/* Header of the file card */}
                  <div className="p-6 flex items-center justify-between border-b border-slate-50">
                      <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${file.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                              {file.status === 'uploading' ? <Loader2 className="w-6 h-6 animate-spin" /> : getFileIcon(file.type)}
                          </div>
                          <div>
                              <p className="font-black text-slate-800 text-lg leading-tight">{file.name}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{file.size} • {file.status === 'uploading' ? 'Analizando...' : 'Analizado con Éxito'}</p>
                          </div>
                      </div>
                      <button onClick={() => removeFile(file.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><X className="w-5 h-5" /></button>
                  </div>

                  {/* AI Result Section */}
                  {file.analysis && (
                      <div className="p-8 bg-slate-50/50 animate-fade-in">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Detection Results */}
                              <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      <Box className="w-3 h-3" /> Objetos Detectados
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      {file.analysis.detectedItems.map((tag, idx) => (
                                          <span key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:border-blue-300 transition-colors cursor-default">
                                              {tag}
                                          </span>
                                      ))}
                                  </div>
                              </div>

                              {/* Volume Estimation */}
                              <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      <BarChart3 className="w-3 h-3" /> Estimación Volumétrica
                                  </div>
                                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-end justify-between">
                                      <div>
                                          <span className="text-4xl font-black text-slate-900 leading-none">{file.analysis.volume}</span>
                                          <span className="text-lg font-bold text-slate-400 ml-1">M³</span>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Carga Óptima</p>
                                          <p className="text-xs font-bold text-slate-400">± 1.5m³ error</p>
                                      </div>
                                  </div>
                              </div>

                              {/* Truck Recommendation */}
                              <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      <Truck className="w-3 h-3" /> Vehículo Sugerido
                                  </div>
                                  <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-600/20 flex flex-col justify-between h-full min-h-[140px]">
                                      <div className="flex items-center justify-between mb-3">
                                          <Truck className="w-6 h-6 text-blue-200" />
                                          <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></div>
                                      </div>
                                      <p className="text-lg font-black">{file.analysis.recommendedTruck}</p>
                                      <button 
                                          onClick={() => onConfirmAiQuote(origin, destination, distance, file.analysis.volume)}
                                          disabled={!origin || !destination}
                                          className="mt-4 w-full bg-white text-blue-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                          Confirmar Inventario <ChevronRight className="w-3 h-3" />
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {file.status === 'uploading' && (
                      <div className="p-12 text-center space-y-4">
                          <div className="relative w-20 h-20 mx-auto">
                              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                          </div>
                          <div className="space-y-1">
                              <p className="font-black text-slate-800">IA Procesando Píxeles...</p>
                              <p className="text-slate-400 text-sm font-medium">Extrayendo geometrías y detectando mobiliario.</p>
                          </div>
                      </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
