    import React, { useEffect, useState } from 'react';

    interface QuoteRow {
    id: number;
    user_id: number;
    customer_name: string;
    truck_id: number | null;
    origin: string | null;
    destination: string | null;
    distance: number | null;
    total_blocks: number | null;
    status: string;
    created_at: string;
    }

    interface Props {
    apiBase: string;
    apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    initialQuoteId?: number | null;
    }

    export const AdminQuotes: React.FC<Props> = ({ apiBase, apiFetch, initialQuoteId }) => {
    const [items, setItems] = useState<QuoteRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [detail, setDetail] = useState<any | null>(null);
    const [editStatus, setEditStatus] = useState<string>('');
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [userIdFilter, setUserIdFilter] = useState<string>('');
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
      if (statusFilter) params.set('status', statusFilter);
      if (userIdFilter) params.set('user_id', userIdFilter);
      const res = await apiFetch(`${apiBase}/admin/quotes?${params.toString()}`);
        if (!res.ok) throw new Error('Error al listar cotizaciones');
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

    const openDetail = async (id: number) => {
        setError(null);
        try {
        const res = await apiFetch(`${apiBase}/quotes/${id}`);
        if (!res.ok) throw new Error('Error al obtener detalle');
        const j = await res.json();
        setDetail(j);
        setEditStatus(j.status || '');
        } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
        }
    };

    const saveStatus = async () => {
        if (!detail?.id) return;
        setError(null);
        try {
        const res = await apiFetch(`${apiBase}/quotes/${detail.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: editStatus, customer_name: detail.customer_name }),
        });
        if (!res.ok) throw new Error('Error al actualizar estado');
        await openDetail(detail.id);
        await loadList();
        } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
        }
    };

    const removeQuote = async (id: number) => {
        if (!window.confirm('¿Eliminar cotización?')) return;
        setError(null);
        try {
        const res = await apiFetch(`${apiBase}/quotes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar cotización');
        await loadList();
        } catch (e) {
        alert(e instanceof Error ? e.message : 'Error desconocido');
        }
    };

  useEffect(() => {
    loadList();
  }, [apiBase, page, pageSize, q, statusFilter, userIdFilter]);

  useEffect(() => {
    if (initialQuoteId && !detail) {
      openDetail(initialQuoteId);
    }
  }, [initialQuoteId]);

    if (loading) return <div>Cargando cotizaciones...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input className="border rounded px-2 py-1" placeholder="Buscar…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
          <select className="border rounded px-2 py-1" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Todos los estados</option>
            <option value="Reservado">Reservado</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <input className="border rounded px-2 py-1" placeholder="Filtrar por user_id" value={userIdFilter} onChange={e => { setUserIdFilter(e.target.value); setPage(1); }} />
          <select className="border rounded px-2 py-1" value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value, 10)); setPage(1); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <button onClick={() => { setQ(''); setStatusFilter(''); setUserIdFilter(''); setPage(1); }} className="border rounded px-3 py-1">
            Limpiar
          </button>
        </div>
      </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full">
            <thead className="bg-slate-50">
                <tr>
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Usuario</th>
                <th className="text-left px-4 py-2">Cliente</th>
                <th className="text-left px-4 py-2">Origen</th>
                <th className="text-left px-4 py-2">Destino</th>
                <th className="text-left px-4 py-2">Distancia</th>
                <th className="text-left px-4 py-2">Estado</th>
                <th className="text-left px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {items.map((q) => (
                <tr key={q.id} className="border-t">
                    <td className="px-4 py-2">{q.id}</td>
                    <td className="px-4 py-2">{q.user_id}</td>
                    <td className="px-4 py-2">{q.customer_name}</td>
                    <td className="px-4 py-2">{q.origin || ''}</td>
                    <td className="px-4 py-2">{q.destination || ''}</td>
                    <td className="px-4 py-2">{q.distance || 0} km</td>
                    <td className="px-4 py-2">{q.status}</td>
                    <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                        <button onClick={() => openDetail(q.id)} className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50">
                        Ver
                        </button>
                        <button onClick={() => removeQuote(q.id)} className="px-3 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50">
                        Eliminar
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
                {items.length === 0 && (
                <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={8}>Sin cotizaciones</td>
                </tr>
                )}
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

        {detail && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="font-semibold">Detalle #{detail.id}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 border rounded-lg">
                <div className="text-slate-500 text-sm">Origen</div>
                <div className="font-medium">{detail.origin || '-'}</div>
                </div>
                <div className="p-3 border rounded-lg">
                <div className="text-slate-500 text-sm">Destino</div>
                <div className="font-medium">{detail.destination || '-'}</div>
                </div>
                <div className="p-3 border rounded-lg">
                <div className="text-slate-500 text-sm">Distancia</div>
                <div className="font-medium">{detail.distance || 0} km</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <select className="border rounded px-2 py-1" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                <option value="Reservado">Reservado</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
                </select>
                <button onClick={saveStatus} className="px-3 py-2 bg-blue-600 text-white rounded">Guardar</button>
                <button onClick={() => setDetail(null)} className="px-3 py-2 border rounded">Cerrar</button>
            </div>
            </div>
        )}
        </div>
    );
    };
