import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminAddActivity() {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      let imageUrl = null;

      // Upload image first if present
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
          setError('Failed to upload image');
          setLoading(false);
          return;
        }
      }

      // Save activity
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
        setError('Failed to save activity');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12 items-center w-full px-8 pb-12">
      <div className="w-full max-w-5xl flex justify-end mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Selamat Datang Admin</h1>
      </div>

      <div className="w-full max-w-5xl text-left mb-6">
         <h2 className="text-xl font-bold text-gray-900">Form Tambah Kegiatan</h2>
      </div>

      <div className="w-full max-w-5xl border border-gray-800 p-8 bg-white">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <label className="font-bold text-gray-900">Tanggal Berita</label>
            <div className="flex items-center gap-4">
              <input 
                type="date" 
                className="border-2 border-gray-800 p-2 focus:outline-none w-48"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
              />
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
             <label className="font-bold text-gray-900">Judul Berita</label>
             <input 
                type="text" 
                className="border-2 border-gray-800 p-2 focus:outline-none w-full"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
             <label className="font-bold text-gray-900">Tempat Kegiatan</label>
             <input 
                type="text" 
                className="border-2 border-gray-800 p-2 focus:outline-none w-full"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
          </div>

          <div className="grid grid-cols-[150px_1fr] items-start gap-4">
             <label className="font-bold text-gray-900 pt-2">Isi Kegiatan</label>
             <textarea 
                className="border-2 border-gray-800 p-3 h-64 focus:outline-none w-full resize-y"
                required
                value={content}
                onChange={e => setContent(e.target.value)}
              ></textarea>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
             <label className="font-bold text-gray-900">Upload Gambar</label>
             <div className="flex items-center gap-4">
               <input 
                 type="file" 
                 id="imageUpload"
                 className="hidden" 
                 accept="image/*"
                 onChange={e => {
                   if (e.target.files && e.target.files[0]) {
                     setImage(e.target.files[0]);
                   }
                 }}
               />
               <input 
                 type="text" 
                 readOnly 
                 value={image ? image.name : ''}
                 className="border-2 border-gray-800 p-2 focus:outline-none w-64 bg-gray-50"
               />
               <label htmlFor="imageUpload" className="border-2 border-gray-800 py-2 px-6 font-bold cursor-pointer hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-sm">
                 Browse
               </label>
             </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="border-2 border-gray-800 py-2 px-8 font-bold hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white disabled:opacity-50"
            >
              Simpan
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin/kegiatan')}
              className="border-2 border-gray-800 py-2 px-8 font-bold hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
