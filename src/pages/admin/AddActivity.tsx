import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

export function AdminAddActivity() {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    if (!image) {
      setImagePreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = 'Tanggal wajib diisi';
    if (!title.trim()) newErrors.title = 'Judul wajib diisi';
    else if (title.trim().length < 5) newErrors.title = 'Judul minimal 5 karakter';
    
    if (!location.trim()) newErrors.location = 'Lokasi wajib diisi';
    if (!content.trim()) newErrors.content = 'Isi konten wajib diisi';
    else if (content.trim().length < 20) newErrors.content = 'Isi konten minimal 20 karakter';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      let imageUrl = null;

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.imageUrl;
        } else {
          setErrors({ submit: 'Gagal mengunggah gambar' });
          setLoading(false);
          return;
        }
      }

      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: date || new Date().toISOString().split('T')[0],
          title,
          location,
          content,
          imageUrl
        })
      });

      if (res.ok) {
        navigate('/admin/kegiatan');
      } else {
        setErrors({ submit: 'Gagal menyimpan kegiatan' });
      }
    } catch (err) {
      setErrors({ submit: 'Terjadi kesalahan sistem' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/kegiatan')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Kegiatan Baru</h1>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-gray-700">Tanggal <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={date}
                onChange={e => { setDate(e.target.value); if (errors.date) setErrors({...errors, date: ''}); }}
                className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.date ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />
              {errors.date && <span className="text-red-500 text-xs font-bold">{errors.date}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-gray-700">Judul Kegiatan <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={title}
                onChange={e => { setTitle(e.target.value); if (errors.title) setErrors({...errors, title: ''}); }}
                placeholder="Ex. Latihan Rutin Bulanan"
                className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />
              {errors.title && <span className="text-red-500 text-xs font-bold">{errors.title}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-gray-700">Lokasi <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={location}
              onChange={e => { setLocation(e.target.value); if (errors.location) setErrors({...errors, location: ''}); }}
              placeholder="Ex. Kantor Pusat, Jl. Jend. Sudirman"
              className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.location ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
            />
            {errors.location && <span className="text-red-500 text-xs font-bold">{errors.location}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-gray-700">Isi Konten <span className="text-red-500">*</span></label>
            <textarea 
              rows={6}
              value={content}
              onChange={e => { setContent(e.target.value); if (errors.content) setErrors({...errors, content: ''}); }}
              placeholder="Tuliskan detail kegiatan di sini..."
              className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none ${errors.content ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
            />
            {errors.content && <span className="text-red-500 text-xs font-bold">{errors.content}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-gray-700">Gambar Dokumentasi</label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <div className="flex-1">
                <input 
                  type="file" 
                  id="imageUpload"
                  className="hidden" 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                    } else {
                      setImage(null);
                    }
                  }}
                />
                <div className="flex items-center gap-3">
                  <label 
                    htmlFor="imageUpload" 
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shadow-sm"
                  >
                    Pilih File
                  </label>
                  <span className="text-sm text-gray-500 truncate max-w-[200px]">
                    {image ? image.name : 'Tidak ada gambar'}
                  </span>
                </div>
              </div>
              
              {imagePreview ? (
                <div className="relative shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg pointer-events-none"></div>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 text-gray-400">
                  <ImageIcon className="w-8 h-8 opacity-50" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => navigate('/admin/kegiatan')}
              className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md shadow-blue-500/20"
            >
              {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
