'use client';

import { useEffect, useState } from 'react';
import {
  getLead,
  deleteLead,
  updateLead,
  getComments,
  createComment,
} from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function LeadPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lead, setLead] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    status: 'NEW',
    value: '',
    notes: '',
  });

  const [text, setText] = useState('');

  useEffect(() => {
    const leadId = Number(id);
    if (!leadId) return;

    setLoading(true);

    Promise.all([getLead(leadId), getComments(leadId)])
      .then(([leadData, commentsData]) => {
        setLead(leadData);
        setComments(commentsData);

        setForm({
          name: leadData.name ?? '',
          email: leadData.email ?? '',
          company: leadData.company ?? '',
          status: leadData.status ?? 'NEW',
          value: leadData.value ?? '',
          notes: leadData.notes ?? '',
        });
      })
      .catch(() => setError('Failed to load lead'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const payload = {
        ...(form.name.trim() && { name: form.name.trim() }),
        ...(form.email.trim() && { email: form.email.trim() }),
        ...(form.company.trim() && { company: form.company.trim() }),
        ...(form.status && { status: form.status }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
        ...(form.value && { value: Number(form.value) }),
      };

      const updated = await updateLead(lead.id, payload);

      setLead(updated);
      setIsEditing(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this lead?')) return;

    await deleteLead(lead.id);
    router.push('/leads');
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!lead) return <p className="p-4">Not found</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">

      <button onClick={() => router.push('/leads')} className="text-blue-500">
        ← Back
      </button>

      {isEditing ? (
        <div className="space-y-2">
          <input className="w-full p-2 rounded-xl bg-white"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input className="w-full p-2 rounded-xl bg-white"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <input className="w-full p-2 rounded-xl bg-white"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })} />

          <select className="w-full p-2 rounded-xl bg-white" value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>NEW</option>
            <option>CONTACTED</option>
            <option>IN_PROGRESS</option>
            <option>WON</option>
            <option>LOST</option>
          </select>

          <input className="w-full p-2 rounded-xl bg-white"
            placeholder="Value"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })} />

          <textarea className="w-full p-2 rounded-xl bg-white" value={form.notes}
            placeholder="Notes"
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <button onClick={handleSave}
            className="px-3 py-2 bg-green-500 hover:bg-green-600 cursor-pointer text-white rounded-xl">
            Save
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <h1 className="text-xl font-bold">{lead.name}</h1>
          <p>{lead.email}</p>
          <p>{lead.company}</p>
          <p>Status: {lead.status}</p>
          <p>Value: {lead.value}</p>
          <p>{lead.notes}</p>

          <button onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-xl">
            Edit
          </button>
        </div>
      )}

      <button onClick={handleDelete}
        className="px-3 py-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-xl">
        Delete
      </button>

      <hr />

      <h2 className="font-semibold">Comments</h2>

      {comments.length === 0 && <p>No comments</p>}

      {comments.map((c) => (
        <div key={c.id} className="p-2 border rounded">{c.text}</div>
      ))}

      <input className="w-full p-2 rounded-xl bg-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add comment..." />

      <button
        onClick={async () => {
          if (!text.trim()) return;

          try {
            setAdding(true);
            const newComment = await createComment(lead.id, text);
            setComments((prev) => [...prev, newComment]);
            setText('');
          } finally {
            setAdding(false);
          }
        }}
        className="px-3 py-1 bg-purple-500 hover:bg-purple-600 cursor-pointer text-white rounded-xl"
      >
        {adding ? 'Adding...' : 'Add comment'}
      </button>
    </div>
  );
}
