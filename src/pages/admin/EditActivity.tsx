import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

export function AdminEditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/activities/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setDate(data.date);
        setTitle(data.title);
        setLocation(data.location);
        setContent(data.content);
        setExistingImageUrl(data.image_url || '');
      })
      .catch(err => {
        console.error(err);
        navigate('/kekarjaya-admin-panel/kegiatan');
      });
  }, [id, navigate]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    let imageUrl = existingImageUrl;
    
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
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
      } catch (err) {
        console.error('Image upload failed', err);
        setErrors({ submit: 'Terjadi kesalahan saat mengunggah gambar' });
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ date, title, location, content, imageUrl })
      });

      if (res.ok) {
        navigate('/kekarjaya-admin-panel/kegiatan');
      } else {
        setErrors({ submit: 'Gagal menyimpan perubahan' });
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Terjadi kesalahan sistem' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/kekarjaya-admin-panel/kegiatan')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Ubah Kegiatan</h1>
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
              className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none ${errors.content ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
            />
            {errors.content && <span className="text-red-500 text-xs font-bold">{errors.content}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-gray-700">Ganti Gambar Dokumentasi (Opsional)</label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
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
                    Pilih File Baru
                  </label>
                  <span className="text-sm text-gray-500 truncate max-w-[200px]">
                    {image ? image.name : 'Gunakan gambar saat ini'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4 shrink-0 overflow-x-auto pb-2 md:pb-0">
                {existingImageUrl && !image && (
                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase text-gray-500 mb-1 absolute -top-5 left-0">Saat Ini</p>
                    <img src={existingImageUrl} alt="Current" className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  </div>
                )}
                {imagePreview && (
                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase text-blue-600 mb-1 absolute -top-5 left-0">Baru</p>
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-blue-200 shadow-sm ring-2 ring-blue-500" />
                  </div>
                )}
                {!existingImageUrl && !imagePreview && (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-6 h-6 opacity-50" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => navigate('/kekarjaya-admin-panel/kegiatan')}
              className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md shadow-blue-500/20"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
