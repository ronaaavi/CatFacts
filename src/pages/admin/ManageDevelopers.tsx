import { useEffect, useState } from 'react';
import api from '@/services/api';

type Dev = { 
  id: number; 
  name: string; 
  github?: string; 
  role: string; 
  bio?: string; 
  cat_name?: string; 
  cat_breed?: string; 
  profile_image?: string; 
  cat_image?: string;
};

export default function ManageDevelopers() {
  const [devs, setDevs] = useState<Dev[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Dev | null>(null);
  const [form, setForm] = useState<{ 
    name: string; 
    github: string; 
    role: string; 
    bio: string; 
    cat_name: string; 
    cat_breed: string; 
    profileImage?: File; 
    catImage?: File;
  }>({ name: '', github: '', role: '', bio: '', cat_name: '', cat_breed: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const res = await api.get('/developers');
      setDevs(res.data || []);
    } catch (err) { console.error(err); }
  }

  function openNew() {
    setEditing(null);
    setForm({ name: '', github: '', role: '', bio: '', cat_name: '', cat_breed: '' });
    setOpen(true);
  }

  function openEdit(d: Dev) {
    setEditing(d);
    setForm({ 
      name: d.name, 
      github: d.github || '', 
      role: d.role, 
      bio: d.bio || '', 
      cat_name: d.cat_name || '', 
      cat_breed: d.cat_breed || '', 
      profileImage: undefined
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate form
    if (!form.name.trim() || !form.role.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields (Name and Role).' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setSaving(true);
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('github', form.github.trim());
    formData.append('role', form.role.trim());
    formData.append('bio', form.bio.trim());
    formData.append('cat_name', form.cat_name.trim());
    formData.append('cat_breed', form.cat_breed.trim());
    if (form.profileImage) formData.append('profileImage', form.profileImage);
    if (form.catImage) formData.append('catImage', form.catImage);

    console.log('Sending data:', {
      name: form.name,
      github: form.github,
      role: form.role,
      bio: form.bio,
      cat_name: form.cat_name,
      cat_breed: form.cat_breed,
      hasProfileImage: !!form.profileImage
    });

    try {
      let response;
      if (editing) {
        console.log('Updating developer:', editing.id);
        response = await api.put(`/developers/${editing.id}`, formData, { 
          headers: { 'Content-Type': 'multipart/form-data' } 
        });
        console.log('Update response:', response);
        if (response.data && response.data.success) {
          setMessage({ type: 'success', text: 'Developer updated successfully!' });
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        console.log('Adding new developer');
        response = await api.post('/developers', formData, { 
          headers: { 'Content-Type': 'multipart/form-data' } 
        });
        console.log('Add response:', response);
        if (response.data && response.data.success) {
          setMessage({ type: 'success', text: 'Developer added successfully!' });
        } else {
          throw new Error('Invalid response from server');
        }
      }
      setOpen(false);
      fetchAll();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) { 
      console.error('Error details:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save developer. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this developer?')) return;
    try { await api.delete(`/developers/${id}`); fetchAll(); } catch (err) { console.error(err); }
  }

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
        <h1 className="text-2xl font-bold text-amber-600">Manage Developers</h1>
        <button onClick={openNew} className="bg-amber-500 text-white px-3 py-2 rounded">Add Developer</button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <ul className="space-y-4">
          {devs.map(d => (
            <li key={d.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {d.profile_image && (
                    <img src={`http://localhost:5050${d.profile_image}`} alt={d.name} className="w-16 h-16 rounded-full object-cover" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{d.name}</div>
                    <div className="text-sm text-gray-600">{d.role}</div>
                    {d.github && <div className="text-sm text-blue-600">GitHub: {d.github}</div>}
                    {d.bio && <div className="text-sm text-gray-700 mt-1">{d.bio}</div>}
                    {d.cat_name && (
                      <div className="text-sm text-amber-600 mt-2">
                        🐱 Cat: {d.cat_name} {d.cat_breed && `(${d.cat_breed})`}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(d)} className="text-amber-600 hover:underline">Edit</button>
                  <button onClick={() => remove(d.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Developer' : 'Add Developer'}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500">Close</button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Name *</label>
                <input className="w-full border rounded px-2 py-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium">GitHub Username</label>
                <input className="w-full border rounded px-2 py-1" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} placeholder="e.g., ronaaavi" />
              </div>
              <div>
                <label className="block text-sm font-medium">Role *</label>
                <input className="w-full border rounded px-2 py-1" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g., Frontend, Backend" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Bio</label>
                <textarea className="w-full border rounded px-2 py-1" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Cat Name</label>
                  <input className="w-full border rounded px-2 py-1" value={form.cat_name} onChange={e => setForm({ ...form, cat_name: e.target.value })} placeholder="e.g., Munchkin" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Cat Breed</label>
                  <input className="w-full border rounded px-2 py-1" value={form.cat_breed} onChange={e => setForm({ ...form, cat_breed: e.target.value })} placeholder="e.g., Persian" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Profile Image</label>
                <input type="file" accept="image/*" className="w-full text-sm" onChange={e => { if (e.target.files?.[0]) setForm({ ...form, profileImage: e.target.files[0] }); }} />
              </div>
              <div>
                <label className="block text-sm font-medium">Cat Image</label>
                <input type="file" accept="image/*" className="w-full text-sm" onChange={e => { if (e.target.files?.[0]) setForm({ ...form, catImage: e.target.files[0] }); }} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" disabled={saving}>Cancel</button>
                <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" disabled={saving}>
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
