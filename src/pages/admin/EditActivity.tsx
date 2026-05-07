import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function AdminEditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

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
        navigate('/admin/kegiatan');
      });
  }, [id, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
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
        }
      } catch (err) {
        console.error('Image upload failed', err);
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
        navigate('/admin/kegiatan');
      } else {
        console.error('Failed to update activity');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12 pb-24">
      <div className="w-full max-w-4xl mx-auto px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Ubah Kegiatan</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 border-2 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Tanggal</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border-2 border-gray-800 p-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Judul</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border-2 border-gray-800 p-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Lokasi</label>
            <input 
              type="text" 
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="border-2 border-gray-800 p-2 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Isi Konten</label>
            <textarea 
              required
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="border-2 border-gray-800 p-2 focus:outline-none resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Gambar Utama (Opsional: Kosongkan jika tidak ingin mengubah)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
              className="border-2 border-gray-800 p-2 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700 cursor-pointer"
            />
            {existingImageUrl && !image && (
              <p className="text-sm text-blue-600 mt-2">Gambar saat ini: {existingImageUrl.split('/').pop()}</p>
            )}
            {image && <p className="text-sm text-green-600 mt-2">Gambar baru akan diupload.</p>}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button 
              type="button" 
              onClick={() => navigate('/admin/kegiatan')}
              className="px-6 py-2 border-2 border-gray-800 font-bold hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-6 py-2 border-2 border-gray-800 font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
