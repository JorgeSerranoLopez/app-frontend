import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TrucksAdmin } from './TrucksAdmin';
import { Uploads } from './Uploads';
import { AdminUsers } from './admin/AdminUsers';
import { AdminQuotes } from './admin/AdminQuotes';

interface Props {
  apiBase: string;
  apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  onBack: () => void;
  initialSection?: 'trucks' | 'uploads' | 'quotes' | 'users';
  initialQuoteId?: number | null;
}

export const AdminPanel: React.FC<Props> = ({ apiBase, apiFetch, onBack, initialSection, initialQuoteId }) => {
  const [section, setSection] = useState<'trucks' | 'uploads' | 'quotes' | 'users'>(initialSection || 'trucks');
  const [quoteToOpen, setQuoteToOpen] = useState<number | null>(initialQuoteId || null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Panel Admin</div>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setSection('trucks')} className={`px-3 py-2 rounded ${section==='trucks'?'bg-blue-600 text-white':'bg-slate-100'}`}>Trucks</button>
        <button onClick={() => setSection('uploads')} className={`px-3 py-2 rounded ${section==='uploads'?'bg-blue-600 text-white':'bg-slate-100'}`}>Uploads</button>
        <button onClick={() => setSection('quotes')} className={`px-3 py-2 rounded ${section==='quotes'?'bg-blue-600 text-white':'bg-slate-100'}`}>Quotes</button>
        <button onClick={() => setSection('users')} className={`px-3 py-2 rounded ${section==='users'?'bg-blue-600 text-white':'bg-slate-100'}`}>Users</button>
      </div>
      <div>
        {section === 'trucks' && (
          <TrucksAdmin apiBase={apiBase} apiFetch={apiFetch} isAdmin={true} onBack={onBack} />
        )}
        {section === 'uploads' && (
          <Uploads
            apiBase={apiBase}
            apiFetch={apiFetch}
            onBack={onBack}
            onViewQuote={(qid) => {
              setQuoteToOpen(qid);
              setSection('quotes');
            }}
          />
        )}
        {section === 'quotes' && (
          <AdminQuotes apiBase={apiBase} apiFetch={apiFetch} initialQuoteId={quoteToOpen} />
        )}
        {section === 'users' && (
          <AdminUsers apiBase={apiBase} apiFetch={apiFetch} />
        )}
      </div>
    </div>
  );
};
