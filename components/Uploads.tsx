  import React, { useEffect, useState } from 'react';

  interface UploadItem {
    id: number;
    title: string | null;
    note: string | null;
    original_name: string;
    mimetype: string;
    size: number;
    created_at: string;
    ai_status?: string | null;
    ai_tags?: any;
    ai_summary?: string | null;
    ai_flags?: any;
  }

  interface Props {
    apiBase: string;
    apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    onBack: () => void;
  }

  export const Uploads: React.FC<Props> = ({ apiBase, apiFetch, onBack }) => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [items, setItems] = useState<UploadItem[]>([]);
    const [busy, setBusy] = useState(false);
    const loadList = async () => {
      try {
        const res = await apiFetch(`${apiBase}/uploads`);
        if (res.ok) {
          const data = await res.json();
          const normalized = Array.isArray(data)
            ? data.map((d: any) => ({
                ...d,
                ai_tags:
                  typeof d?.ai_tags === 'string'
                    ? (() => {
                        try {
                          return JSON.parse(d.ai_tags);
                        } catch {
                          return [];
                        }
                      })()
                    : d?.ai_tags || [],
                ai_flags:
                  typeof d?.ai_flags === 'string'
                    ? (() => {
                        try {
                          return JSON.parse(d.ai_flags);
                        } catch {
                          return {};
                        }
                      })()
                    : d?.ai_flags || {},
              }))
            : [];
          setItems(normalized);
        }
      } catch {}
    };
    useEffect(() => {
      loadList();
    }, []);
    const handleDownload = async (it: UploadItem) => {
      try {
        const res = await apiFetch(`${apiBase}/uploads/${it.id}/download`);
        if (!res.ok) {
          alert('Error al descargar archivo');
          return;
        }
        const blob = await res.blob();
        const cd = res.headers.get('Content-Disposition') || '';
        const m = cd.match(/filename="([^"]+)"/);
        const filename = m?.[1] || it.original_name || 'archivo';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {
        alert('Error de red al descargar');
      }
    };
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!files || files.length === 0) {
        alert('Selecciona al menos un archivo');
        return;
      }
      setBusy(true);
      try {
        const fd = new FormData();
        for (let i = 0; i < files.length; i++) {
          const f = files.item(i);
          if (f) fd.append('files', f, f.name);
        }
        fd.append('title', title);
        fd.append('note', note);
        const res = await apiFetch(`${apiBase}/uploads`, { method: 'POST', body: fd });
        if (!res.ok) {
        let msg = 'Error al subir';
        try {
          const data = await res.json();
          if (data?.error) {
            msg = data.error + (data.detail ? `: ${data.detail}` : '');
          }
        } catch {}
        alert(msg);
        } else {
          setTitle('');
          setNote('');
          const inputEl = document.getElementById('uploads-input') as HTMLInputElement | null;
          if (inputEl) inputEl.value = '';
          setFiles(null);
          await loadList();
        }
      } catch {
        alert('Error de red');
      } finally {
        setBusy(false);
      }
    };
    const handleReanalyze = async (id: number) => {
      try {
        const res = await apiFetch(`${apiBase}/uploads/${id}/reanalyze`, { method: 'POST' });
        if (res.ok) {
          await loadList();
        } else {
          alert('Error al reanalizar');
        }
      } catch {
        alert('Error de red al reanalizar');
      }
    };
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Subir Archivos y Texto</h2>
          <button onClick={onBack} className="text-blue-600 font-semibold hover:underline">Volver</button>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nota</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Archivos</label>
            <input id="uploads-input" type="file" multiple onChange={(e) => setFiles(e.target.files)} className="block w-full" />
          </div>
          <button type="submit" disabled={busy} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50">
            {busy ? 'Subiendo...' : 'Subir'}
          </button>
        </form>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Tus Archivos</h3>
          </div>
          <div className="p-4">
            {items.length === 0 ? (
              <div className="text-slate-500 text-sm">No hay archivos subidos</div>
            ) : (
              <ul className="space-y-3">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                    <div>
                      <div className="font-medium text-slate-800">{it.title || it.original_name}</div>
                      <div className="text-xs text-slate-500">{it.mimetype} · {(it.size / 1024).toFixed(1)} KB · {new Date(it.created_at).toLocaleString()}</div>
                      {it.note && <div className="text-sm text-slate-700 mt-1">{it.note}</div>}
                      <div className="mt-2 text-xs">
                        <div className="text-slate-500">IA: {it.ai_status || 'none'}</div>
                        {Array.isArray(it.ai_tags) && it.ai_tags.length > 0 && (
                          <div className="text-slate-700">Tags: {it.ai_tags.join(', ')}</div>
                        )}
                        {it.ai_summary && (
                          <div className="text-slate-700">Resumen: {it.ai_summary}</div>
                        )}
                        {it.ai_flags && Array.isArray((it.ai_flags as any).inventory_items) && (it.ai_flags as any).inventory_items.length > 0 && (
                          <div className="text-slate-700 mt-1">
                            <div className="font-semibold">Inventario detectado:</div>
                            <ul className="list-disc ml-5">
                              {((it.ai_flags as any).inventory_items as Array<{ name: string; quantity: number }>).map((itx, idx) => (
                                <li key={idx}>{itx.name} — {itx.quantity}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleDownload(it)} className="text-blue-600 font-semibold hover:underline">
                        Descargar
                      </button>
                      <button onClick={() => handleReanalyze(it.id)} className="text-slate-600 font-semibold hover:underline">
                        Reanalizar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
