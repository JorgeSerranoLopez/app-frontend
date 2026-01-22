import React, { useState, useEffect } from 'react';
import { LayoutGrid, LogOut } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { LoadAssistant } from './components/LoadAssistant';
import { Recommendation } from './components/Recommendation';
import { Auth } from './components/Auth';
import { ViewState, SelectedItem, FurnitureItem, User, Quote } from './types';

function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // App State
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  
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
    
    // Auto login
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

  // --- App Handlers ---

  // Calculate totals
  const totalBlocks = selectedItems.reduce((acc, item) => acc + item.blocks, 0);

  const handleAddItem = (item: FurnitureItem) => {
    const newItem: SelectedItem = {
      ...item,
      instanceId: Math.random().toString(36).substr(2, 9),
    };
    setSelectedItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setSelectedItems([]);
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

    // Update Current User State
    const updatedUser = {
      ...currentUser,
      history: [newQuote, ...currentUser.history] // Add to top
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('mudanza_current_user', JSON.stringify(updatedUser));
    updateGlobalUsers(updatedUser);

    // Go back to dashboard
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
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onReset={handleReset}
            onFinish={handleFinishStep1}
          />
        );
      case 'result':
        return (
          <Recommendation
            totalBlocks={totalBlocks}
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
      {/* Top Navigation Bar */}
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
             {/* View Indicator */}
             {currentView !== 'dashboard' && (
                <div className="hidden md:block text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {currentView === 'assistant' ? 'Paso 1: Ruta y Carga' : 'Paso 2: Cotización'}
                </div>
             )}

             {/* User Profile */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;