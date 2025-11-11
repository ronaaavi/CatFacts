import { useEffect, useState } from 'react';
import api from '@/services/api';

type Fact = { id: number; fact: string };

export default function ManageFacts() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Fact | null>(null);
  const [form, setForm] = useState({ fact: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() { try { const res = await api.get('/facts'); setFacts(res.data || []); } catch (err) { console.error(err); } }

  function openNew() { setEditing(null); setForm({ fact: '' }); setOpen(true); }
  function openEdit(f: Fact) { setEditing(f); setForm({ fact: f.fact }); setOpen(true); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate form
    if (!form.fact.trim()) {
      setMessage({ type: 'error', text: 'Please enter a fact.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setSaving(true);
    const payload = { fact: form.fact.trim() };
    
    try {
      let response;
      if (editing) {
        response = await api.put(`/facts/${editing.id}`, payload);
        if (response.status === 200) {
          setMessage({ type: 'success', text: 'Fact updated successfully!' });
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        response = await api.post('/facts', payload);
        if (response.status === 200 || response.status === 201) {
          setMessage({ type: 'success', text: 'Fact added successfully!' });
        } else {
          throw new Error('Invalid response from server');
        }
      }
      setOpen(false);
      fetchAll();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save fact. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) { if (!confirm('Delete this fact?')) return; try { await api.delete(`/facts/${id}`); fetchAll(); } catch (err) { console.error(err); } }

  return (
    <div>
      {/* Success/Error Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg ${
          message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-fade-in`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-amber-600">Manage Cat Facts</h1>
        <button onClick={openNew} className="bg-amber-500 text-white px-3 py-2 rounded">Add Fact</button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <ul className="space-y-3">
          {facts.map(f => (
            <li key={f.id} className="flex justify-between items-center">
              <div className="text-sm text-gray-800">{f.fact}</div>
              <div>
                <button onClick={() => openEdit(f)} className="mr-2 text-amber-600">Edit</button>
                <button onClick={() => remove(f.id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Fact' : 'Add Fact'}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500">Close</button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="block text-sm">Fact</label>
                <textarea className="w-full border rounded px-2 py-1" value={form.fact} onChange={e => setForm({ ...form, fact: e.target.value })} required />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="px-3 py-1" disabled={saving}>Cancel</button>
                <button type="submit" className="bg-amber-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
