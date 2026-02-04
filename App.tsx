
import React, { useState, useEffect } from 'react';
import { LayoutGrid, LogOut, FileUp, ClipboardList, Users, Shield } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { LoadAssistant } from './components/LoadAssistant';
import { Recommendation } from './components/Recommendation';
import { Auth } from './components/Auth';
import { AdminQuotes } from './components/admin/AdminQuotes';
import { AdminUsers } from './components/admin/AdminUsers';
import { Uploads } from './components/Uploads';
import { ViewState, SelectedItem, FurnitureItem, User, Quote, TRUCK_DIMENSIONS, TruckSize, TRUCK_BASE_PRICES, PRICE_PER_KM } from './types';

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
  const [aiVolume, setAiVolume] = useState<number | null>(null);
  const [apiBase, setApiBase] = useState<string>(
    (typeof window !== 'undefined' && window.localStorage.getItem('mudanza_api_base')) ||
    (import.meta as any).env?.VITE_API_BASE ||
    `http://${window.location.hostname}:3000`
  );
  const [adminQuotes, setAdminQuotes] = useState<Quote[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminQuotesRaw, setAdminQuotesRaw] = useState<Quote[]>([]);
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminDetail, setAdminDetail] = useState<any | null>(null);
  const [adminUsersSearch, setAdminUsersSearch] = useState<string>('');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && window.localStorage.getItem('mudanza_api_base')) || '';
    const candidates = [
      'http://localhost:3000',
      `http://${window.location.hostname}:3000`,
      'http://127.0.0.1:3000',
      stored || apiBase
    ];
    const probe = async (base: string) => {
      try {
        const res = await fetch(`${base}/`);
        if (!res.ok) return false;
        const text = await res.text();
        return typeof text === 'string' && text.includes('API de Mudanza App funcionando.');
      } catch {
        return false;
      }
    };
    const resolve = async () => {
      for (const c of candidates) {
        const ok = await probe(c);
        if (ok) {
          setApiBase(c);
          try {
            window.localStorage.setItem('mudanza_api_base', c);
          } catch {}
          break;
        }
      }
    };
    resolve();
  }, []);

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

  const mapBackendQuote = (q: any): Quote => {
    const blocks = q.total_blocks ?? 0;
    let size: TruckSize = 'S';
    if (blocks <= 36) size = 'S';
    else if (blocks <= 64) size = 'M';
    else size = 'XL';
    const basePrice = TRUCK_BASE_PRICES[size];
    const distancePrice = Math.max(0, Number(q.distance || 0)) * PRICE_PER_KM;
    const totalPrice = basePrice + distancePrice;
    const truck = size === 'S' ? 'Camioneta Pequeña (S)' : size === 'M' ? 'Camión 3/4 (M)' : 'Camión Mudanzero (XL)';
    const dateStr = q.created_at ? new Date(q.created_at).toLocaleDateString() : new Date().toLocaleDateString();
    return {
      id: String(q.id),
      date: dateStr,
      origin: q.origin || '',
      destination: q.destination || '',
      distance: Number(q.distance || 0),
      truck,
      blocks,
      basePrice,
      distancePrice,
      totalPrice,
      status: (q.status as Quote['status']) || 'Reservado',
      userName: currentUser?.name
    };
  };
  const mapAdminRow = (q: any): Quote => {
    const blocks = q.total_blocks ?? 0;
    let size: TruckSize = 'S';
    if (blocks <= 36) size = 'S';
    else if (blocks <= 64) size = 'M';
    else size = 'XL';
    const basePrice = TRUCK_BASE_PRICES[size];
    const distancePrice = Math.max(0, Number(q.distance || 0)) * PRICE_PER_KM;
    const totalPrice = basePrice + distancePrice;
    const truck = size === 'S' ? 'Camioneta Pequeña (S)' : size === 'M' ? 'Camión 3/4 (M)' : 'Camión Mudanzero (XL)';
    const dateStr = q.created_at ? new Date(q.created_at).toLocaleDateString() : new Date().toLocaleDateString();
    return {
      id: String(q.id),
      date: dateStr,
      origin: q.origin || '',
      destination: q.destination || '',
      distance: Number(q.distance || 0),
      truck,
      blocks,
      basePrice,
      distancePrice,
      totalPrice,
      status: (q.status as Quote['status']) || 'Reservado',
      userName: q.user_name || 'Cliente Web'
    };
  };

  const fetchUserQuotes = async (token: string) => {
    try {
      const res = await fetch(`${apiBase}/quotes`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const list = await res.json();
      const mapped: Quote[] = Array.isArray(list) ? list.map(mapBackendQuote) : [];
      setCurrentUser(prev => prev ? { ...prev, history: mapped } : prev);
      const cu = JSON.parse(localStorage.getItem('mudanza_current_user') || 'null');
      if (cu) {
        localStorage.setItem('mudanza_current_user', JSON.stringify({ ...cu, history: mapped }));
      }
    } catch {}
  };
  useEffect(() => {
    const run = async () => {
      if (!currentUser?.isAdmin) return;
      if (currentView !== 'admin_quotes') return;
      const token = localStorage.getItem('mudanza_token') || '';
      if (!token) return;
      try {
        const url = adminSearch ? `${apiBase}/admin/quotes?q=${encodeURIComponent(adminSearch)}` : `${apiBase}/admin/quotes`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const j = await res.json();
        const arr = Array.isArray(j) ? j : Array.isArray(j?.items) ? j.items : [];
        const mapped = arr.map(mapAdminRow);
        setAdminQuotesRaw(mapped);
        setAdminQuotes(mapped);
      } catch {}
    };
    run();
  }, [currentUser, currentView, apiBase, adminSearch]);

  useEffect(() => {
    const run = async () => {
      if (!currentUser?.isAdmin) return;
      if (currentView !== 'admin_users') return;
      const token = localStorage.getItem('mudanza_token') || '';
      if (!token) return;
      try {
        const url = adminUsersSearch ? `${apiBase}/admin/users?q=${encodeURIComponent(adminUsersSearch)}` : `${apiBase}/admin/users`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const j = await res.json();
        const arr = Array.isArray(j) ? j : Array.isArray(j?.items) ? j.items : [];
        const mapped: User[] = arr.map((u: any) => ({
          id: String(u.id),
          name: u.name || 'Usuario',
          email: u.email,
          password: '',
          history: [],
          isAdmin: (u.role || '') === 'admin'
        }));
        setAdminUsers(mapped);
      } catch {}
    };
    run();
  }, [currentUser, currentView, apiBase, adminUsersSearch]);

  const processPendingQuote = async (user: User) => {
    if (pendingQuote) {
      const token = localStorage.getItem('mudanza_token') || '';
      try {
        const loads = selectedItems.map(it => ({ description: it.name, blocks: it.blocks }));
        const body = { customer_name: user.name, origin: pendingQuote.origin, destination: pendingQuote.destination, distance: pendingQuote.distance, loads };
        const res = await fetch(`${apiBase}/quotes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          await fetchUserQuotes(token);
          setPendingQuote(null);
          setCurrentView('dashboard');
          alert("¡Tu cotización ha sido guardada con éxito!");
        } else {
          setPendingQuote(null);
          setCurrentView('dashboard');
          alert("No se pudo guardar en el backend, se continuará sin historial remoto.");
        }
      } catch {
        setPendingQuote(null);
        setCurrentView('dashboard');
        alert("Error de red al guardar cotización.");
      }
    } else if (user.isAdmin) {
      setCurrentView('admin_quotes');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    setAuthError(null);
    try {
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setAuthError(err.error || 'Error al registrar');
        return;
      }
      const loginRes = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      if (!loginRes.ok) {
        setAuthError('Error al iniciar sesión');
        return;
      }
      const { token, refreshToken } = await loginRes.json();
      localStorage.setItem('mudanza_token', token);
      localStorage.setItem('mudanza_refresh', refreshToken || '');
      const prof = await fetch(`${apiBase}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const profile = await prof.json();
      const newUser: User = { id: String(profile.id), name: profile.name || name, email: profile.email || email, password: '', history: [], isAdmin: profile.role === 'admin' };
      setCurrentUser(newUser);
      localStorage.setItem('mudanza_current_user', JSON.stringify(newUser));
      updateGlobalUsers(newUser);
      await processPendingQuote(newUser);
      await fetchUserQuotes(token);
    } catch {
      setAuthError('Error de red');
    }
  };

  const handleLogin = async (email: string, pass: string, adminOnly?: boolean) => {
    setAuthError(null);
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setAuthError(err.error || 'Credenciales inválidas');
        return;
      }
      const { token, refreshToken } = await res.json();
      localStorage.setItem('mudanza_token', token);
      localStorage.setItem('mudanza_refresh', refreshToken || '');
      const prof = await fetch(`${apiBase}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const profile = await prof.json();
      if (adminOnly && profile.role !== 'admin') {
        localStorage.removeItem('mudanza_token');
        localStorage.removeItem('mudanza_refresh');
        setAuthError('Solo administradores pueden acceder aquí');
        return;
      }
      const user: User = { id: String(profile.id), name: profile.name || 'Usuario', email: profile.email || email, password: '', history: [], isAdmin: profile.role === 'admin' };
      localStorage.setItem('mudanza_current_user', JSON.stringify(user));
      setCurrentUser(user);
      await fetchUserQuotes(token);
      await processPendingQuote(user);
    } catch {
      setAuthError('Error de red');
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

  const handleSaveQuote = async (finalQuoteData: Omit<Quote, 'id' | 'date' | 'status'>) => {
    if (!currentUser) return;
    if (currentUser.isGuest) {
      setPendingQuote(finalQuoteData);
      setCurrentUser(null);
      alert("¡Excelente precio! Ahora regístrate o inicia sesión para guardar tu historial y confirmar la reserva.");
      return;
    }
    const token = localStorage.getItem('mudanza_token') || '';
    try {
      const loads = selectedItems.length > 0 ? selectedItems.map(it => ({ description: it.name, blocks: it.blocks })) : (aiVolume != null ? [{ description: 'Inventario IA', blocks: aiVolume }] : []);
      const body = { customer_name: currentUser.name, origin: finalQuoteData.origin, destination: finalQuoteData.destination, distance: finalQuoteData.distance, loads };
      const res = await fetch(`${apiBase}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        await fetchUserQuotes(token);
        setCurrentView('dashboard');
        setAiVolume(null);
      } else {
        alert("No se pudo guardar en el backend.");
      }
    } catch {
      alert("Error de red al guardar cotización.");
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (currentUser?.isGuest) return;
    if (!window.confirm("¿Eliminar cotización?")) return;
    const token = localStorage.getItem('mudanza_token') || '';
    try {
      const res = await fetch(`${apiBase}/quotes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        await fetchUserQuotes(token);
      }
    } catch {}
  };

  const handleUpdateQuoteStatus = async (id: string, status: Quote['status']) => {
    const token = localStorage.getItem('mudanza_token') || '';
    try {
      const res = await fetch(`${apiBase}/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchUserQuotes(token);
        if (currentUser?.isAdmin && currentView === 'admin_quotes') {
          try {
            const qurl = adminSearch ? `${apiBase}/admin/quotes?q=${encodeURIComponent(adminSearch)}` : `${apiBase}/admin/quotes`;
            const r = await fetch(qurl, { headers: { Authorization: `Bearer ${token}` } });
            const j = await r.json().catch(() => ({}));
            const arr = Array.isArray(j) ? j : Array.isArray(j?.items) ? j.items : [];
            const mapped = arr.map(mapAdminRow);
            setAdminQuotesRaw(mapped);
            setAdminQuotes(mapped);
          } catch {}
        }
      }
    } catch {}
  };

  const handleAdminSearch = (term: string) => {
    setAdminSearch(term);
    if (!term) {
      setAdminQuotes(adminQuotesRaw);
      return;
    }
    const t = term.toLowerCase();
    const filtered = adminQuotesRaw.filter(q => {
      const name = (q.userName || '').toLowerCase();
      return name.includes(t) || String(q.id).toLowerCase().includes(t);
    });
    setAdminQuotes(filtered);
  };

  const handleAdminView = async (id: string) => {
    const token = localStorage.getItem('mudanza_token') || '';
    setAdminDetail(null);
    try {
      const res = await fetch(`${apiBase}/quotes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const j = await res.json();
      setAdminDetail(j);
    } catch {}
  };
  const handleAdminUsersSearch = (term: string) => {
    setAdminUsersSearch(term);
  };
  const handleAdminUserConfigure = async (id: string, nextRole: 'admin' | 'client') => {
    const token = localStorage.getItem('mudanza_token') || '';
    try {
      const res = await fetch(`${apiBase}/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: nextRole })
      });
      if (!res.ok) return;
      const url = adminUsersSearch ? `${apiBase}/admin/users?q=${encodeURIComponent(adminUsersSearch)}` : `${apiBase}/admin/users`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const j = await r.json();
      const arr = Array.isArray(j) ? j : Array.isArray(j?.items) ? j.items : [];
      const mapped: User[] = arr.map((u: any) => ({
        id: String(u.id),
        name: u.name || 'Usuario',
        email: u.email,
        password: '',
        history: [],
        isAdmin: (u.role || '') === 'admin'
      }));
      setAdminUsers(mapped);
    } catch {}
  };
  const handleAdminUserDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    if (String(currentUser?.id) === String(id)) {
      alert('No puedes eliminar tu propio usuario.');
      return;
    }
    const token = localStorage.getItem('mudanza_token') || '';
    try {
      const res = await fetch(`${apiBase}/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const url = adminUsersSearch ? `${apiBase}/admin/users?q=${encodeURIComponent(adminUsersSearch)}` : `${apiBase}/admin/users`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const j = await r.json();
      const arr = Array.isArray(j) ? j : Array.isArray(j?.items) ? j.items : [];
      const mapped: User[] = arr.map((u: any) => ({
        id: String(u.id),
        name: u.name || 'Usuario',
        email: u.email,
        password: '',
        history: [],
        isAdmin: (u.role || '') === 'admin'
      }));
      setAdminUsers(mapped);
    } catch {}
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
      case 'admin_quotes': return <AdminQuotes quotes={currentUser.isAdmin ? adminQuotes : (currentUser?.history || []).map(h => ({ ...h, userName: currentUser?.name }))} onUpdateStatus={handleUpdateQuoteStatus} onSearch={handleAdminSearch} onView={handleAdminView} detail={adminDetail} onCloseDetail={() => setAdminDetail(null)} />;
      case 'admin_users': return <AdminUsers users={adminUsers} onConfigure={handleAdminUserConfigure} onDelete={handleAdminUserDelete} onSearch={handleAdminUsersSearch} />;
      case 'uploads': return <Uploads onStartManual={() => setCurrentView('assistant')} onConfirmAiQuote={(o, d, dist, vol) => { setQuoteData({ origin: o, destination: d, distance: dist }); setAiVolume(vol); handleSaveQuote({ origin: o, destination: d, distance: dist } as any); }} />;
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
