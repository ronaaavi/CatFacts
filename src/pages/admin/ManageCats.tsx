import { useEffect, useState } from 'react';
import api from '@/services/api';

type Cat = { id: number; name: string; breed_id: number; breed_name?: string; age: number };

export default function ManageCats() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [form, setForm] = useState({ name: '', breed_id: '', age: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const res = await api.get('/cats');
      setCats(res.data || []);
    } catch (err) { console.error(err); }
  }

  function openNew() { setEditing(null); setForm({ name: '', breed_id: '', age: '' }); setOpen(true); }
  function openEdit(c: Cat) { setEditing(c); setForm({ name: c.name, breed_id: c.breed_id.toString(), age: c.age.toString() }); setOpen(true); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate form
    if (!form.name.trim() || !form.breed_id || !form.age) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    const age = Number(form.age);
    if (isNaN(age) || age < 0) {
      setMessage({ type: 'error', text: 'Please enter a valid age.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setSaving(true);
    const payload = { name: form.name.trim(), breed_id: Number(form.breed_id), age };
    
    try {
      let response;
      if (editing) {
        response = await api.put(`/cats/${editing.id}`, payload);
        if (response.status === 200) {
          setMessage({ type: 'success', text: 'Cat updated successfully!' });
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        response = await api.post('/cats', payload);
        if (response.status === 200 || response.status === 201) {
          setMessage({ type: 'success', text: 'Cat added successfully!' });
        } else {
          throw new Error('Invalid response from server');
        }
      }
      setOpen(false);
      fetchAll();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save cat. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) { if (!confirm('Delete this cat?')) return; try { await api.delete(`/cats/${id}`); fetchAll(); } catch (err) { console.error(err); } }

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
        <h1 className="text-2xl font-bold text-amber-600">Manage Cats</h1>
        <button onClick={openNew} className="bg-amber-500 text-white px-3 py-2 rounded">Add Cat</button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Breed</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.id}</td>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.breed_name ?? c.breed_id}</td>
                <td className="px-4 py-2">{c.age}</td>
                <td className="px-4 py-2">
                  <button onClick={() => openEdit(c)} className="mr-2 text-amber-600">Edit</button>
                  <button onClick={() => remove(c.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Cat' : 'Add Cat'}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500">Close</button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="block text-sm">Name</label>
                <input className="w-full border rounded px-2 py-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm">Breed ID</label>
                <input className="w-full border rounded px-2 py-1" value={form.breed_id} onChange={e => setForm({ ...form, breed_id: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm">Age</label>
                <input className="w-full border rounded px-2 py-1" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required />
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
