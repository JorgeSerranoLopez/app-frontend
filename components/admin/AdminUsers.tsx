import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

interface Props {
  apiBase: string;
  apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export const AdminUsers: React.FC<Props> = ({ apiBase, apiFetch }) => {
  const [items, setItems] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'usuario' });
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState<number | null>(null);

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (q) params.set('q', q);
      const res = await apiFetch(`${apiBase}/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error('Error al listar usuarios');
      const data = await res.json();
      const rows = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
      setItems(rows);
      if (data && typeof data.total !== 'undefined') {
        const t = parseInt(String(data.total), 10);
        setTotal(Number.isNaN(t) ? null : t);
      } else {
        setTotal(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.email || !form.password) {
      alert('Email y password son requeridos');
      return;
    }
    try {
      const r = await apiFetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name }),
      });
      if (!r.ok) {
        const t = await r.text();
        throw new Error(t || 'Error al crear usuario');
      }
      const created = await r.json().catch(() => null);
      if (created && form.role && form.role !== 'usuario') {
        const u = await apiFetch(`${apiBase}/admin/users/${created.id}/role`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: form.role }),
        });
        if (!u.ok) throw new Error('Error al asignar rol');
      }
      setForm({ email: '', password: '', name: '', role: 'usuario' });
      loadList();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error desconocido');
    }
  };

  const handleRole = async (id: number, role: string) => {
    try {
      const r = await apiFetch(`${apiBase}/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!r.ok) throw new Error('Error al actualizar rol');
      loadList();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error desconocido');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    try {
      const r = await apiFetch(`${apiBase}/admin/users/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Error al eliminar usuario');
      loadList();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error desconocido');
    }
  };

  useEffect(() => {
    loadList();
  }, [apiBase, page, pageSize, q]);

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input className="border rounded px-2 py-1" placeholder="Buscar por email/nombre…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
          <select className="border rounded px-2 py-1" value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value, 10)); setPage(1); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <button onClick={() => { setQ(''); setPage(1); }} className="border rounded px-3 py-1">Limpiar</button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="font-semibold mb-3">Crear usuario</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input className="border rounded px-2 py-1" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="border rounded px-2 py-1" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <input className="border rounded px-2 py-1" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <select className="border rounded px-2 py-1" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="usuario">usuario</option>
            <option value="admin">admin</option>
          </select>
          <button onClick={handleCreate} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded">
            <PlusCircle className="w-4 h-4" /> Crear
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Rol</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.id}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.name || ''}</td>
                <td className="px-4 py-2">
                  <select value={u.role} onChange={e => handleRole(u.id, e.target.value)} className="border rounded px-2 py-1">
                    <option value="usuario">usuario</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Página {page}{total ? ` de ${Math.max(1, Math.ceil(total / pageSize))}` : ''} {total ? `· ${total} resultados` : ''}
        </div>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))} className={`px-3 py-2 rounded ${page <= 1 ? 'bg-slate-100 text-slate-400' : 'bg-slate-200'}`}>Anterior</button>
          <button
            disabled={total ? page >= Math.ceil(total / pageSize) : items.length < pageSize}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-2 rounded ${total ? (page >= Math.ceil(total / pageSize) ? 'bg-slate-100 text-slate-400' : 'bg-slate-200') : (items.length < pageSize ? 'bg-slate-100 text-slate-400' : 'bg-slate-200')}`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
