import React, { useState, useEffect } from 'react';
import { LayoutGrid, LogOut } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { LoadAssistant } from './components/LoadAssistant';
import { Recommendation } from './components/Recommendation';
import { Auth } from './components/Auth';
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

  const handleRegister = (name: string, email: string, pass: string) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      setAuthError('El correo ya está registrado');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password: pass,
      history: []
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('mudanza_users', JSON.stringify(updatedUsers));
    localStorage.setItem('mudanza_current_user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    setAuthError(null);
  };

  const handleLogin = (email: string, pass: string) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    
    if (user) {
      localStorage.setItem('mudanza_current_user', JSON.stringify(user));
      setCurrentUser(user);
      setAuthError(null);
    } else {
      setAuthError('Credenciales inválidas');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mudanza_current_user');
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

  const handleFinishStep1 = (origin: string, destination: string, distance: number) => {
    setQuoteData({ origin, destination, distance });
    setCurrentView('result');
  };

  const handleSaveQuote = (finalQuoteData: Omit<Quote, 'id' | 'date' | 'status'>) => {
    if (!currentUser) return;

    const newQuote: Quote = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString(),
      status: 'Reservado',
      ...finalQuoteData
    };

    const updatedUser = {
      ...currentUser,
      history: [newQuote, ...currentUser.history]
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('mudanza_current_user', JSON.stringify(updatedUser));
    updateGlobalUsers(updatedUser);

    setCurrentView('dashboard');
  };

  const handleDeleteQuote = (id: string) => {
    if (!currentUser) return;
    if(!window.confirm("¿Estás seguro de eliminar esta cotización?")) return;
    const updatedHistory = currentUser.history.filter(q => q.id !== id);
    const updatedUser = { ...currentUser, history: updatedHistory };
    setCurrentUser(updatedUser);
    localStorage.setItem('mudanza_current_user', JSON.stringify(updatedUser));
    updateGlobalUsers(updatedUser);
  };

  // --- View Rendering ---

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} error={authError} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser} onStartQuote={handleStartQuote} onDeleteQuote={handleDeleteQuote} />;
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
      default:
        return <Dashboard user={currentUser} onStartQuote={handleStartQuote} onDeleteQuote={handleDeleteQuote} />;
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