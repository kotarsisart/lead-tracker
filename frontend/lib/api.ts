const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getLeads(params?: {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();

  if (params?.q) query.append('q', params.q);
  if (params?.status) query.append('status', params.status);
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  const res = await fetch(`${API_URL}/leads?${query.toString()}`, {
    cache: 'no-store',
  });

  let data = null;

  try {
    data = await res.json();
  } catch {

  }

  if (!res.ok) {
    console.error('API ERROR:', data);
    throw new Error(data?.message || 'Failed to fetch leads');
  }

  return data;
}


export async function getLead(id: number) {
  const res = await fetch(`${API_URL}/leads/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch lead');

  return res.json();
}

export async function createLead(data: any) {
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to create lead');
  }

  return res.json();
}

export async function updateLead(id: number, data: any) {
  const res = await fetch(`${API_URL}/leads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to update lead');

  return res.json();
}

export async function deleteLead(id: number) {
  const res = await fetch(`${API_URL}/leads/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete lead');
}

export async function getComments(leadId: number) {
  const res = await fetch(`${API_URL}/leads/${leadId}/comments`);

  if (!res.ok) throw new Error('Failed to fetch comments');

  return res.json();
}

export async function createComment(leadId: number, text: string) {
  const res = await fetch(`${API_URL}/leads/${leadId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      leadId,
    }),
  });

  if (!res.ok) throw new Error('Failed to create comment');

  return res.json();
}
