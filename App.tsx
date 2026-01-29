  import React, { useState, useEffect } from 'react';
  import { LayoutGrid, LogOut } from 'lucide-react';
  import { Dashboard } from './components/Dashboard';
  import { LoadAssistant } from './components/LoadAssistant';
  import { Recommendation } from './components/Recommendation';
  import { Auth } from './components/Auth';
  import { Uploads } from './components/Uploads';
  import { ViewState, SelectedItem, FurnitureItem, User, Quote, TRUCK_DIMENSIONS, TruckSize } from './types';

  // Helper to generate a random pastel color for items
  const getRandomColor = () => {
    const hues = [
      'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-lime-400', 
      'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-sky-400', 
      'bg-blue-400', 'bg-indigo-400', 'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 'bg-rose-400'
    ];
    return hues[Math.floor(Math.random() * hues.length)];
  };

  function App() {
    const API_BASE = localStorage.getItem('mudanza_api_base') || (import.meta as any).env?.VITE_API_BASE || `http://${window.location.hostname}:3000`;
    const apiFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = localStorage.getItem('mudanza_token') || '';
      const headers = new Headers(init?.headers || {});
      if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
      const res = await fetch(input, { ...init, headers });
      if (res.status !== 401) return res;
      const refresh = localStorage.getItem('mudanza_refresh') || '';
      if (!refresh) return res;
      const r = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh })
      });
      if (!r.ok) return res;
      const data = await r.json().catch(() => null);
      if (!data?.token) return res;
      localStorage.setItem('mudanza_token', data.token);
      const retryHeaders = new Headers(init?.headers || {});
      retryHeaders.set('Authorization', `Bearer ${data.token}`);
      return fetch(input, { ...init, headers: retryHeaders });
    };
    // Auth State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);

    // App State
    const [currentView, setCurrentView] = useState<ViewState>('dashboard');
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [currentTruckSize, setCurrentTruckSize] = useState<TruckSize>('S');
    
    // New Quote Data State
    const [quoteData, setQuoteData] = useState<{
        origin: string; 
        destination: string; 
        distance: number;
    }>({ origin: '', destination: '', distance: 0 });

    // Load users from localStorage on mount
    useEffect(() => {
      const savedUser = localStorage.getItem('mudanza_current_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    }, []);

    useEffect(() => {
      const run = async () => {
        if (!currentUser) return;
        if (currentView !== 'dashboard') return;
        const token = localStorage.getItem('mudanza_token') || '';
        if (!token) return;
        try {
          const qRes = await fetch(`${API_BASE}/quotes`, { headers: { Authorization: `Bearer ${token}` } });
          if (qRes.ok) {
            const rows = await qRes.json();
            const mapped = rows.map((r: any) => {
              const blocks = r.total_blocks || 0;
              const truck = blocks <= 36 ? 'S' : blocks <= 64 ? 'M' : blocks <= 100 ? 'L' : 'XL';
              const basePrice = (truck === 'S' ? 45000 : truck === 'M' ? 85000 : truck === 'L' ? 130000 : truck === 'XL' ? 180000 : 0);
              const distancePrice = (r.distance || 0) * 1500;
              const totalPrice = basePrice + distancePrice;
              return {
                id: String(r.id),
                date: new Date(r.created_at).toLocaleDateString(),
                status: r.status || 'Reservado',
                origin: r.origin || '',
                destination: r.destination || '',
                distance: r.distance || 0,
                truck,
                blocks,
                basePrice,
                distancePrice,
                totalPrice
              } as Quote;
            });
            const withHistory = { ...currentUser, history: mapped };
            setCurrentUser(withHistory);
            localStorage.setItem('mudanza_current_user', JSON.stringify(withHistory));
          }
        } catch {}
      };
      run();
    }, [currentUser, currentView]);

    // --- Auth Handlers ---
    const getUsers = (): User[] => {
      const usersStr = localStorage.getItem('mudanza_users');
      return usersStr ? JSON.parse(usersStr) : [];
    };

    const updateGlobalUsers = (updatedUser: User) => {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('mudanza_users', JSON.stringify(users));
      }
    };

    const handleRegister = async (name: string, email: string, pass: string) => {
      setAuthError(null);
      const strong =
        typeof pass === 'string' &&
        pass.length >= 8 &&
        /[A-Z]/.test(pass) &&
        /[a-z]/.test(pass) &&
        /[0-9]/.test(pass) &&
        /[^A-Za-z0-9]/.test(pass);
      if (!strong) {
        setAuthError('La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.');
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password: pass })
        });
        if (!res.ok) {
          const e = await res.json().catch(() => null);
          setAuthError(e?.error || 'Error al registrar usuario');
          return;
        }
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        if (!loginRes.ok) {
          setAuthError('Error al iniciar sesión');
          return;
        }
        const loginData = await loginRes.json();
        localStorage.setItem('mudanza_token', loginData.token);
        if (loginData.refreshToken) localStorage.setItem('mudanza_refresh', loginData.refreshToken);
        const profileRes = await apiFetch(`${API_BASE}/auth/profile`);
        if (!profileRes.ok) {
          setAuthError('Error al obtener perfil');
          return;
        }
        const profile = await profileRes.json();
        const user: User = { id: String(profile.id), name: profile.name || '', email: profile.email, password: '', history: [] };
        localStorage.setItem('mudanza_current_user', JSON.stringify(user));
        setCurrentUser(user);
      } catch {
        setAuthError('Error de red');
      }
    };

    const handleLogin = async (email: string, pass: string) => {
      setAuthError(null);
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        if (!res.ok) {
          const e = await res.json().catch(() => null);
          setAuthError(e?.error || 'Credenciales inválidas');
          return;
        }
        const data = await res.json();
        localStorage.setItem('mudanza_token', data.token);
        if (data.refreshToken) localStorage.setItem('mudanza_refresh', data.refreshToken);
        const profileRes = await apiFetch(`${API_BASE}/auth/profile`);
        if (!profileRes.ok) {
          setAuthError('Error al obtener perfil');
          return;
        }
        const profile = await profileRes.json();
        const user: User = { id: String(profile.id), name: profile.name || '', email: profile.email, password: '', history: [] };
        localStorage.setItem('mudanza_current_user', JSON.stringify(user));
        // Fetch quotes from backend and map to frontend history
        try {
          const qRes = await apiFetch(`${API_BASE}/quotes`);
          if (qRes.ok) {
            const rows = await qRes.json();
            const mapped = rows.map((r: any) => {
              const blocks = r.total_blocks || 0;
              const truck = blocks <= 36 ? 'S' : blocks <= 64 ? 'M' : blocks <= 100 ? 'L' : 'XL';
              const basePrice = (truck === 'S' ? 45000 : truck === 'M' ? 85000 : truck === 'L' ? 130000 : truck === 'XL' ? 180000 : 0);
              const distancePrice = r.distance * 1500;
              const totalPrice = basePrice + distancePrice;
              return {
                id: String(r.id),
                date: new Date(r.created_at).toLocaleDateString(),
                status: r.status || 'Reservado',
                origin: r.origin || '',
                destination: r.destination || '',
                distance: r.distance || 0,
                truck,
                blocks,
                basePrice,
                distancePrice,
                totalPrice
              } as Quote;
            });
            const withHistory = { ...user, history: mapped };
            setCurrentUser(withHistory);
            localStorage.setItem('mudanza_current_user', JSON.stringify(withHistory));
          } else {
            setCurrentUser(user);
          }
        } catch {
          setCurrentUser(user);
        }
      } catch {
        setAuthError('Error de red');
      }
    };

    const handleLogout = () => {
      try {
        localStorage.removeItem('mudanza_current_user');
        localStorage.removeItem('mudanza_token');
        localStorage.removeItem('mudanza_refresh');
      } catch {}
      setCurrentUser(null);
      handleReset();
      setCurrentView('dashboard');
    };

    // --- Bin Packing Logic ---

    // Create an empty 2D grid
    const createGrid = (size: number): string[][] => {
      return Array(size).fill(null).map(() => Array(size).fill(''));
    };

    // Check if a specific shape fits at x, y in the grid
    const canPlaceItem = (grid: string[][], shape: number[][], startX: number, startY: number, gridSize: number): boolean => {
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col] === 1) {
            const targetY = startY + row;
            const targetX = startX + col;

            // Check bounds
            if (targetY >= gridSize || targetX >= gridSize) return false;
            
            // Check overlapping
            if (grid[targetY][targetX] !== '') return false;
          }
        }
      }
      return true;
    };

    // Mark the grid with the item ID
    const placeItemOnGrid = (grid: string[][], shape: number[][], startX: number, startY: number, id: string) => {
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col] === 1) {
            grid[startY + row][startX + col] = id;
          }
        }
      }
    };

    // Try to fit a list of items into a specific truck size
    const fitItemsInTruck = (items: SelectedItem[], size: TruckSize): { success: boolean; placements: SelectedItem[] } => {
      const dimension = TRUCK_DIMENSIONS[size];
      const grid = createGrid(dimension);
      const placedItems: SelectedItem[] = [];

      for (const item of items) {
        let placed = false;
        
        // Iterate through grid to find first spot
        for (let y = 0; y < dimension; y++) {
          if (placed) break;
          for (let x = 0; x < dimension; x++) {
            if (canPlaceItem(grid, item.shape, x, y, dimension)) {
              placeItemOnGrid(grid, item.shape, x, y, item.instanceId);
              placedItems.push({ ...item, position: { x, y } });
              placed = true;
              break;
            }
          }
        }

        if (!placed) {
          return { success: false, placements: [] };
        }
      }

      return { success: true, placements: placedItems };
    };

    const handleAddItem = (item: FurnitureItem) => {
      const newItem: SelectedItem = {
        ...item,
        instanceId: Math.random().toString(36).substr(2, 9),
        color: getRandomColor()
      };

      const newProposedList = [...selectedItems, newItem];
      
      // Algorithm: Try current size, if fail, try next sizes
      const sizes: TruckSize[] = ['S', 'M', 'L', 'XL'];
      let startIndex = sizes.indexOf(currentTruckSize);
      
      // Optimistic: Start checking from the current size (or S if empty)
      if (selectedItems.length === 0) startIndex = 0;

      for (let i = startIndex; i < sizes.length; i++) {
          const sizeToCheck = sizes[i];
          const result = fitItemsInTruck(newProposedList, sizeToCheck);
          
          if (result.success) {
              setSelectedItems(result.placements);
              setCurrentTruckSize(sizeToCheck);
              return;
          }
      }

      // If we reach here, it didn't fit in XL
      alert("¡No hay espacio suficiente para este mueble ni siquiera en el camión XL! Considera hacer dos mudanzas.");
    };

    const handleRemoveItem = (index: number) => {
      // When removing, we re-pack everything to optimize space
      // We start trying from 'S' again to see if we can downsize the truck
      const remainingItems = selectedItems.filter((_, i) => i !== index);
      
      const sizes: TruckSize[] = ['S', 'M', 'L', 'XL'];
      
      for (const size of sizes) {
          const result = fitItemsInTruck(remainingItems, size);
          if (result.success) {
              setSelectedItems(result.placements);
              setCurrentTruckSize(size);
              return;
          }
      }
      
      // Should always succeed if empty
      setSelectedItems([]);
      setCurrentTruckSize('S');
    };

    const handleReset = () => {
      setSelectedItems([]);
      setCurrentTruckSize('S');
      setQuoteData({ origin: '', destination: '', distance: 0 });
    };

    const handleStartQuote = () => {
      handleReset();
      setCurrentView('assistant');
    };
    
    const handleGoUploads = () => {
      setCurrentView('uploads');
    };

    const handleFinishStep1 = (origin: string, destination: string, distance: number) => {
      setQuoteData({ origin, destination, distance });
      setCurrentView('result');
    };

    const handleSaveQuote = async (finalQuoteData: Omit<Quote, 'id' | 'date' | 'status'>) => {
      if (!currentUser) return;
      try {
        const loads = selectedItems.map(i => ({ description: i.name, blocks: i.blocks }));
        const res = await apiFetch(`${API_BASE}/quotes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: currentUser.name,
            truck_id: null,
            origin: finalQuoteData.origin,
            destination: finalQuoteData.destination,
            distance: finalQuoteData.distance,
            loads
          })
        });
        if (!res.ok) {
          alert('Error al guardar la cotización en el servidor');
        } else {
          // Refresh history from backend to ensure consistency
          const qRes = await apiFetch(`${API_BASE}/quotes`);
          if (qRes.ok) {
            const rows = await qRes.json();
            const mapped = rows.map((r: any) => {
              const blocks = r.total_blocks || 0;
              const truck = blocks <= 36 ? 'S' : blocks <= 64 ? 'M' : blocks <= 100 ? 'L' : 'XL';
              const basePrice = (truck === 'S' ? 45000 : truck === 'M' ? 85000 : truck === 'L' ? 130000 : truck === 'XL' ? 180000 : 0);
              const distancePrice = (r.distance || 0) * 1500;
              const totalPrice = basePrice + distancePrice;
              return {
                id: String(r.id),
                date: new Date(r.created_at).toLocaleDateString(),
                status: r.status || 'Reservado',
                origin: r.origin || '',
                destination: r.destination || '',
                distance: r.distance || 0,
                truck,
                blocks,
                basePrice,
                distancePrice,
                totalPrice
              } as Quote;
            });
            const updatedUser = { ...currentUser, history: mapped };
            setCurrentUser(updatedUser);
            localStorage.setItem('mudanza_current_user', JSON.stringify(updatedUser));
            updateGlobalUsers(updatedUser);
          }
        }
      } catch {
        alert('Error de red al guardar la cotización');
      } finally {
        setCurrentView('dashboard');
      }
    };

    const handleDeleteQuote = async (id: string) => {
      if (!currentUser) return;
      if(!window.confirm("¿Estás seguro de eliminar esta cotización?")) return;
      try {
        const res = await apiFetch(`${API_BASE}/quotes/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          alert('Error al eliminar la cotización en el servidor');
          return;
        }
        const updatedHistory = currentUser.history.filter(q => q.id !== id);
        const updatedUser = { ...currentUser, history: updatedHistory };
        setCurrentUser(updatedUser);
        localStorage.setItem('mudanza_current_user', JSON.stringify(updatedUser));
        updateGlobalUsers(updatedUser);
      } catch {
        alert('Error de red al eliminar la cotización');
      }
    };

    // --- View Rendering ---

    if (!currentUser) {
      return <Auth onLogin={handleLogin} onRegister={handleRegister} error={authError} />;
    }

    const renderView = () => {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard user={currentUser} onStartQuote={handleStartQuote} onDeleteQuote={handleDeleteQuote} onGoUploads={handleGoUploads} />;
        case 'assistant':
          return (
            <LoadAssistant
              selectedItems={selectedItems}
              truckSize={currentTruckSize}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onReset={handleReset}
              onFinish={handleFinishStep1}
            />
          );
        case 'result':
          return (
            <Recommendation
              totalBlocks={selectedItems.reduce((acc, i) => acc + i.blocks, 0)}
              origin={quoteData.origin}
              destination={quoteData.destination}
              distance={quoteData.distance}
              onBack={() => setCurrentView('assistant')}
              onSave={handleSaveQuote}
            />
          );
        case 'uploads':
          return (
            <Uploads
              apiBase={API_BASE}
              apiFetch={apiFetch}
              onBack={() => setCurrentView('dashboard')}
            />
          );
        default:
          return <Dashboard user={currentUser} onStartQuote={handleStartQuote} onDeleteQuote={handleDeleteQuote} onGoUploads={handleGoUploads} />;
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setCurrentView('dashboard')}
            >
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 hidden sm:inline-block">
                MudanzaApp
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {currentView !== 'dashboard' && (
                  <div className="hidden md:block text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {currentView === 'assistant' ? 'Paso 1: Ruta y Carga' : 'Paso 2: Cotización'}
                  </div>
              )}

              <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {currentUser.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700 hidden sm:block">
                          {currentUser.name}
                      </span>
                  </div>
                  <button 
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Cerrar Sesión"
                  >
                      <LogOut className="w-5 h-5" />
                  </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderView()}
        </main>
      </div>
    );
  }

  export default App;
