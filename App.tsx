
import React, { useState, useEffect } from 'react';
import { LayoutGrid, LogOut, FileUp, ClipboardList, Users, Shield } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { LoadAssistant } from './components/LoadAssistant';
import { Recommendation } from './components/Recommendation';
import { Auth } from './components/Auth';
import { AdminQuotes } from './components/admin/AdminQuotes';
import { AdminUsers } from './components/admin/AdminUsers';
import { Uploads } from './components/Uploads';
import { ViewState, SelectedItem, FurnitureItem, User, Quote, TRUCK_DIMENSIONS, TruckSize } from './types';

const getRandomColor = () => {
  const hues = [
    'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-lime-400', 
    'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-sky-400', 
    'bg-blue-400', 'bg-indigo-400', 'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 'bg-rose-400'
  ];
  return hues[Math.floor(Math.random() * hues.length)];
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [currentTruckSize, setCurrentTruckSize] = useState<TruckSize>('S');
  const [quoteData, setQuoteData] = useState({ origin: '', destination: '', distance: 0 });
  const [pendingQuote, setPendingQuote] = useState<Omit<Quote, 'id' | 'date' | 'status'> | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mudanza_current_user');
    if (savedUser) {
      const user: User = JSON.parse(savedUser);
      setCurrentUser(user);
    }
  }, []);

  const getUsers = (): User[] => {
    const usersStr = localStorage.getItem('mudanza_users');
    return usersStr ? JSON.parse(usersStr) : [];
  };

  const updateGlobalUsers = (updatedUser: User) => {
    if (updatedUser.isGuest) return;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('mudanza_users', JSON.stringify(users));
    }
  };

  const processPendingQuote = (user: User) => {
    if (pendingQuote) {
      const newQuote: Quote = { 
        id: crypto.randomUUID(), 
        date: new Date().toLocaleDateString(), 
        status: 'Reservado', 
        ...pendingQuote 
      };
      const updatedUser = { ...user, history: [newQuote, ...user.history] };
      setCurrentUser(updatedUser);
      localStorage.setItem('mudanza_current_user', JSON.stringify(updatedUser));
      updateGlobalUsers(updatedUser);
      setPendingQuote(null);
      setCurrentView('dashboard');
      alert("¡Tu cotización ha sido guardada con éxito en tu nueva cuenta!");
    } else if (user.isAdmin) {
      setCurrentView('admin_quotes');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleRegister = (name: string, email: string, pass: string) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      setAuthError('El correo ya está registrado');
      return;
    }
    const newUser: User = { id: crypto.randomUUID(), name, email, password: pass, history: [], isAdmin: email.includes('admin') };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('mudanza_users', JSON.stringify(updatedUsers));
    localStorage.setItem('mudanza_current_user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    setAuthError(null);
    processPendingQuote(newUser);
  };

  const handleLogin = (email: string, pass: string) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      localStorage.setItem('mudanza_current_user', JSON.stringify(user));
      setCurrentUser(user);
      setAuthError(null);
      processPendingQuote(user);
    } else {
      setAuthError('Credenciales inválidas');
    }
  };

  const handleGuestAccess = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Invitado',
      email: 'invitado@app.com',
      password: '',
      history: [],
      isGuest: true
    };
    setCurrentUser(guestUser);
    setAuthError(null);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('mudanza_current_user');
    setCurrentUser(null);
    setSelectedItems([]);
    setCurrentTruckSize('S');
    setCurrentView('dashboard');
    setPendingQuote(null);
  };

  const handleAddItem = (item: FurnitureItem) => {
    const newItem: SelectedItem = { ...item, instanceId: Math.random().toString(36).substr(2, 9), color: getRandomColor() };
    const newProposedList = [...selectedItems, newItem];
    const sizes: TruckSize[] = ['S', 'M', 'L', 'XL'];
    let startIndex = selectedItems.length === 0 ? 0 : sizes.indexOf(currentTruckSize);
    
    for (let i = startIndex; i < sizes.length; i++) {
        const dimension = TRUCK_DIMENSIONS[sizes[i] as TruckSize];
        const grid = Array(dimension).fill(null).map(() => Array(dimension).fill(''));
        let possible = true;
        const placedItems: SelectedItem[] = [];

        for (const it of newProposedList) {
          let placed = false;
          for (let y = 0; y < dimension && !placed; y++) {
            for (let x = 0; x < dimension && !placed; x++) {
              let canFit = true;
              for (let r = 0; r < it.shape.length; r++) {
                for (let c = 0; c < it.shape[r].length; c++) {
                  if (it.shape[r][c] === 1) {
                    if (y + r >= dimension || x + c >= dimension || grid[y + r][x + c] !== '') {
                      canFit = false;
                      break;
                    }
                  }
                }
                if (!canFit) break;
              }
              if (canFit) {
                for (let r = 0; r < it.shape.length; r++) {
                  for (let c = 0; c < it.shape[r].length; c++) {
                    if (it.shape[r][c] === 1) grid[y + r][x + c] = it.instanceId;
                  }
                }
                placedItems.push({ ...it, position: { x, y } });
                placed = true;
              }
            }
          }
          if (!placed) { possible = false; break; }
        }

        if (possible) {
            setSelectedItems(placedItems);
            setCurrentTruckSize(sizes[i] as TruckSize);
            return;
        }
    }
    alert("¡No hay espacio suficiente!");
  };

  const handleRemoveItem = (index: number) => {
    const remainingItems = selectedItems.filter((_, i) => i !== index);
    const sizes: TruckSize[] = ['S', 'M', 'L', 'XL'];
    for (const size of sizes) {
        const dimension = TRUCK_DIMENSIONS[size as TruckSize];
        const grid = Array(dimension).fill(null).map(() => Array(dimension).fill(''));
        let possible = true;
        const placedItems: SelectedItem[] = [];
        for (const it of remainingItems) {
          let placed = false;
          for (let y = 0; y < dimension && !placed; y++) {
            for (let x = 0; x < dimension && !placed; x++) {
              let canFit = true;
              for (let r = 0; r < it.shape.length; r++) {
                for (let c = 0; c < it.shape[r].length; c++) {
                  if (it.shape[r][c] === 1) {
                    if (y + r >= dimension || x + c >= dimension || grid[y + r][x + c] !== '') {
                      canFit = false;
                      break;
                    }
                  }
                }
                if (!canFit) break;
              }
              if (canFit) {
                for (let r = 0; r < it.shape.length; r++) {
                  for (let c = 0; c < it.shape[r].length; c++) {
                    if (it.shape[r][c] === 1) grid[y + r][x + c] = it.instanceId;
                  }
                }
                placedItems.push({ ...it, position: { x, y } });
                placed = true;
              }
            }
          }
          if (!placed) { possible = false; break; }
        }
        if (possible) {
            setSelectedItems(placedItems);
            setCurrentTruckSize(size as TruckSize);
            return;
        }
    }
    setSelectedItems([]);
    setCurrentTruckSize('S');
  };

  const handleSaveQuote = (finalQuoteData: Omit<Quote, 'id' | 'date' | 'status'>) => {
    if (!currentUser) return;
    if (currentUser.isGuest) {
      setPendingQuote(finalQuoteData);
      setCurrentUser(null);
      alert("¡Excelente precio! Ahora regístrate o inicia sesión para guardar tu historial y confirmar la reserva.");
      return;
    }
    const newQuote: Quote = { id: crypto.randomUUID(), date: new Date().toLocaleDateString(), status: 'Reservado', ...finalQuoteData };
    const updatedUser = { ...currentUser, history: [newQuote, ...currentUser.history] };
    setCurrentUser(updatedUser);
    localStorage.setItem('mudanza_current_user', JSON.stringify(updatedUser));
    updateGlobalUsers(updatedUser);
    setCurrentView('dashboard');
  };

  const handleDeleteQuote = (id: string) => {
    if (currentUser?.isGuest) return;
    if (!window.confirm("¿Eliminar cotización?")) return;
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, history: prevUser.history.filter(q => q.id !== id) };
      localStorage.setItem('mudanza_current_user', JSON.stringify(updatedUser));
      updateGlobalUsers(updatedUser);
      return updatedUser;
    });
  };

  const handleUpdateQuoteStatus = (id: string, status: Quote['status']) => {
    alert(`Estado actualizado para ${id} a ${status}`);
  };

  if (!currentUser) return <Auth onLogin={handleLogin} onRegister={handleRegister} onGuestAccess={handleGuestAccess} error={authError} isPending={!!pendingQuote} />;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': 
        return (
          <Dashboard 
            user={currentUser} 
            onStartQuote={() => setCurrentView('assistant')} 
            onStartAiQuote={() => setCurrentView('uploads')}
            onDeleteQuote={handleDeleteQuote} 
          />
        );
      case 'assistant': return <LoadAssistant selectedItems={selectedItems} truckSize={currentTruckSize} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} onReset={() => setSelectedItems([])} onFinish={(o, d, dist) => { setQuoteData({ origin: o, destination: d, distance: dist }); setCurrentView('result'); }} />;
      case 'result': return <Recommendation user={currentUser} totalBlocks={selectedItems.reduce((acc, i) => acc + i.blocks, 0)} origin={quoteData.origin} destination={quoteData.destination} distance={quoteData.distance} onBack={() => setCurrentView('assistant')} onSave={handleSaveQuote} />;
      case 'admin_quotes': return <AdminQuotes quotes={getUsers().flatMap(u => u.history.map(h => ({ ...h, userName: u.name })))} onUpdateStatus={handleUpdateQuoteStatus} />;
      case 'admin_users': return <AdminUsers users={getUsers()} />;
      case 'uploads': return <Uploads onStartManual={() => setCurrentView('assistant')} />;
      default: return <Dashboard user={currentUser} onStartQuote={() => setCurrentView('assistant')} onStartAiQuote={() => setCurrentView('uploads')} onDeleteQuote={handleDeleteQuote} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className={`p-1.5 rounded-lg text-white ${currentUser.isAdmin ? 'bg-slate-900' : 'bg-blue-600'}`}>
              <LayoutGrid className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 hidden sm:inline-block">MudanzaApp</span>
            {currentUser.isAdmin && (
              <div className="ml-2 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest hidden lg:block">Admin</div>
            )}
          </div>
          
          <div className="flex items-center gap-1 md:gap-4">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className={`p-2 rounded-xl transition-colors ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`} 
                title="Dashboard"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentView('uploads')} className={`p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors ${currentView === 'uploads' ? 'bg-blue-50 text-blue-600' : ''}`} title="Documentos"><FileUp className="w-5 h-5" /></button>
              {currentUser.isAdmin && (
                <>
                  <button onClick={() => setCurrentView('admin_quotes')} className={`p-2 rounded-xl transition-colors ${currentView === 'admin_quotes' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`} title="Gestión Cotizaciones">
                    <ClipboardList className="w-5 h-5" />
                  </button>
                  <button onClick={() => setCurrentView('admin_users')} className={`p-2 rounded-xl transition-colors ${currentView === 'admin_users' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`} title="Gestión Usuarios">
                    <Users className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
               <div className="flex items-center gap-2">
                 <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${currentUser.isAdmin ? 'bg-slate-900 text-white' : (currentUser.isGuest ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600')}`}>
                   {currentUser.name.charAt(0)}
                 </div>
                 <div className="hidden lg:block">
                    <span className="text-sm font-bold text-slate-700 block leading-none">{currentUser.name}</span>
                    {currentUser.isAdmin && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Administrador</span>}
                 </div>
               </div>
               <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                 <LogOut className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{renderView()}</main>
    </div>
  );
}

export default App;
