'use client';

import { useEffect, useState } from 'react';
import { getLeads } from '@/lib/api';
import Link from 'next/link';
import Card from '@/components/Card';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setQ(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getLeads({ q, status, page, limit: 10 })
      .then((res) => {
        setLeads(res.data);
        setMeta(res.meta);
      })
      .catch((err) => {
        setLeads([]);
        setMeta(null);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [q, status, page]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">

      <h1 className="text-2xl font-bold">Leads</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* FILTERS */}
      <div className="flex gap-2">
        <input
          className="bg-white p-2 w-full rounded-xl cursor-pointer text-black"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-blue-300 p-2 rounded-xl cursor-pointer text-white"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All</option>
          <option>NEW</option>
          <option>CONTACTED</option>
          <option>IN_PROGRESS</option>
          <option>WON</option>
          <option>LOST</option>
        </select>
      </div>

      {/* CREATE */}
      <Link href="/leads/new">
        <button className="px-3 py-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-xl mb-4  ">
          Create Lead
        </button>
      </Link>

      {/* LIST */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && !leads.length && (
        <p className="text-gray-500">No leads found</p>
      )}

      <ul className="space-y-2">
        {leads.map((lead) => (
        <li key={lead.id}>
          <Link href={`/leads/${lead.id}`} className="block">
            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-900">
                    {lead.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {lead.company || '—'}
                  </div>
                </div>

                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {lead.status}
                </span>
              </div>
            </Card>
          </Link>
        </li>
        ))}
      </ul>

      {/* PAGINATION */}
      {meta && (
        <div className="flex items-center gap-3">
          <button
            className="px-2 py-1 rounded bg-blue-400 text-white"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {meta.page} / {meta.pages}
          </span>

          <button
            className="px-2 py-1 rounded bg-blue-400 text-white"
            disabled={!meta || page === meta.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
