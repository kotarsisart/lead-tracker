'use client';

import { useState } from 'react';
import { createLead } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function NewLeadPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    status: 'NEW',
    value: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        status: form.status,
        ...(form.email.trim() && { email: form.email.trim() }),
        ...(form.company.trim() && { company: form.company.trim() }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
        ...(form.value && { value: Number(form.value) }),
      };

      await createLead(payload);

      router.push('/leads');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-3">
      <h1 className="text-2xl font-bold">Create Lead</h1>

      <button onClick={() => router.push('/leads')} className="text-blue-500">
        ← Back
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <input className="border p-2 w-full"
        placeholder="Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input className="border p-2 w-full"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <input className="border p-2 w-full"
        placeholder="Company"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })} />

      <select className="border p-2 w-full"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option>NEW</option>
        <option>CONTACTED</option>
        <option>IN_PROGRESS</option>
        <option>WON</option>
        <option>LOST</option>
      </select>

      <input className="border p-2 w-full"
        placeholder="Value"
        value={form.value}
        onChange={(e) => setForm({ ...form, value: e.target.value })} />

      <textarea className="border p-2 w-full"
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create'}
      </button>
    </div>
  );
}
