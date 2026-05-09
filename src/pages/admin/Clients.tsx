import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Pencil, Trash2, Loader2, Upload, AlertCircle } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  order_index: number;
  created_at: string;
}

export function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    order_index: 0
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (Array.isArray(data)) {
        setClients(data);
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (client?: Client) => {
    setError('');
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        description: client.description || '',
        image_url: client.image_url || '',
        order_index: client.order_index || 0
      });
    } else {
      setEditingClient(null);
      setFormData({ name: '', description: '', image_url: '', order_index: 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setFormData(prev => ({ ...prev, image_url: data.imageUrl }));
    } catch (err) {
      setError('Gagal mengunggah gambar. Pastikan ukurannya tidak terlalu besar.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Nama klien wajib diisi.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const method = editingClient ? 'PUT' : 'POST';
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save');

      await fetchClients();
      handleCloseModal();
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus klien ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete');

      fetchClients();
    } catch (err) {
      alert('Gagal menghapus klien.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Klien</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar klien dan mitra kerja perusahaan.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Klien
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-bold text-sm text-gray-600">Logo</th>
                <th className="py-4 px-6 font-bold text-sm text-gray-600">Nama Klien</th>
                <th className="py-4 px-6 font-bold text-sm text-gray-600">Keterangan</th>
                <th className="py-4 px-6 font-bold text-sm text-gray-600 w-24">Urutan</th>
                <th className="py-4 px-6 font-bold text-sm text-gray-600 w-32 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Belum ada klien. Klik "Tambah Klien" untuk menambahkan.</td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      {client.image_url ? (
                        <div className="w-12 h-12 rounded bg-white border border-gray-100 flex items-center justify-center p-1">
                          <img src={client.image_url} alt={client.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold">
                          {client.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{client.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate">{client.description || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{client.order_index}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(client)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingClient ? 'Edit Klien' : 'Tambah Klien'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 font-medium border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form id="clientForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Logo Klien (Opsional)</label>
                    <div className="flex items-center gap-4">
                      {formData.image_url ? (
                        <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-center relative group">
                          <img src={formData.image_url} alt="Preview" className="max-w-full max-h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-50 border border-gray-200 border-dashed rounded-lg flex items-center justify-center text-gray-400">
                          <Upload className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Pilih Gambar
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Disarankan rasio 1:1, latar belakang transparan (PNG).</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Nama Klien *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Contoh: PT ABC Indonesia"
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Keterangan (Opsional)</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Contoh: Mitra Keamanan Gedung"
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Urutan Tampil (Opsional)</label>
                    <input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                    />
                    <p className="text-xs text-gray-500">Angka lebih kecil tampil lebih dulu.</p>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="clientForm"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 bg-blue-600 rounded-lg transition-colors disabled:opacity-70"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Klien'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
