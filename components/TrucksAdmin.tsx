import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit, Trash2, PlusCircle } from 'lucide-react';
import { TruckForm } from './TruckForm';

interface Truck {
  id: number;
  name: string;
  type: string;
  capacity: number;
}

interface Props {
  apiBase: string;
  apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  isAdmin: boolean;
  onBack: () => void;
}

export const TrucksAdmin: React.FC<Props> = ({ apiBase, apiFetch, isAdmin, onBack }) => {
  const [items, setItems] = useState<Truck[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadList = async () => {
    setError(null);
    try {
      const res = await apiFetch(`${apiBase}/trucks?page=${page}&pageSize=${pageSize}`);
      if (!res.ok) {
        const e = await res.json().catch(() => null);
        setError(e?.error || 'Error al listar camiones');
        return;
      }
      const j = await res.json();
      const arr = Array.isArray(j.items) ? j.items : [];
      setItems(arr);
    } catch {
      setError('Error de red');
    }
  };

  useEffect(() => {
    loadList();
  }, [page, pageSize]);

  const submitCreate = async (data: { name: string; type: string; capacity: number }) => {
    setError(null);
    try {
      const res = await apiFetch(`${apiBase}/trucks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => null);
        setError(e?.error || 'No autorizado o error al crear');
        return;
      }
      setCreating(false);
      await loadList();
    } catch {
      setError('Error de red');
    }
  };

  const submitEdit = async (data: { name: string; type: string; capacity: number }) => {
    if (editingId == null) return;
    setError(null);
    try {
      const res = await apiFetch(`${apiBase}/trucks/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => null);
        setError(e?.error || 'No autorizado o error al editar');
        return;
      }
      setEditingId(null);
      await loadList();
    } catch {
      setError('Error de red');
    }
  };

  const removeTruck = async (id: number) => {
    if (!window.confirm('¿Eliminar camión?')) return;
    setError(null);
    try {
      const res = await apiFetch(`${apiBase}/trucks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const e = await res.json().catch(() => null);
        setError(e?.error || 'No autorizado o error al eliminar');
        return;
      }
      await loadList();
    } catch {
      setError('Error de red');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
        <div className="text-sm text-slate-600">Admin</div>
      </div>

      {!isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4">
          No tienes permisos de administrador para crear o modificar camiones. Puedes ver la lista.
        </div>
      )}

      {isAdmin && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Gestión de Camiones</div>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <PlusCircle className="w-4 h-4" />
              Nuevo
            </button>
          </div>
          {creating && <TruckForm initial={null} onSubmit={submitCreate} />}
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Tipo</th>
              <th className="text-left px-4 py-2">Capacidad</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2">{t.name}</td>
                <td className="px-4 py-2">{t.type}</td>
                <td className="px-4 py-2">{t.capacity}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(t.id)}
                      className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center gap-1"
                      disabled={!isAdmin}
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => removeTruck(t.id)}
                      className="px-3 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1"
                      disabled={!isAdmin}
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={4}>No hay camiones</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingId != null && isAdmin && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="font-semibold">Editar Camión</div>
          <TruckForm
            initial={items.find(i => i.id === editingId) ? {
              name: items.find(i => i.id === editingId)!.name,
              type: items.find(i => i.id === editingId)!.type,
              capacity: items.find(i => i.id === editingId)!.capacity
            } : null}
            onSubmit={submitEdit}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingId(null)}
              className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
        <div className="text-sm text-slate-600">Página {page}</div>
      </div>
    </div>
  );
}
