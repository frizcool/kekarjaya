import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Settings, Save, Image as ImageIcon, Loader2, Home, Info, Briefcase, Phone, Upload } from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({
    hero_title: 'Sistem Manajemen Terpadu',
    hero_subtitle: 'Keamanan adalah Prioritas Kami',
    about_text: 'PT Kekar Jaya Security adalah perusahaan penyedia jasa pengamanan...',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState<'beranda' | 'tentang' | 'layanan' | 'karir' | 'kontak'>('beranda');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat pengaturan. Status: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => {
        console.error(err);
        setMessage({ type: 'error', text: 'Gagal memuat pengaturan dari server.' });
      });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file: File, key: string) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      if (res.ok) {
        const { imageUrl } = await res.json();
        setSettings(prev => ({ ...prev, [key]: imageUrl }));
      } else {
        setMessage({ type: 'error', text: 'Gagal mengunggah gambar' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan. Pastikan Anda memiliki akses yang benar.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem saat menyimpan pengaturan.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderImageSetting = (label: string, key: string) => (
    <div className="flex flex-col gap-2">
      <label className="font-bold text-sm text-gray-700">{label}</label>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
        <div className="flex-1">
          <input 
            type="file" 
            id={`upload-${key}`}
            className="hidden" 
            accept="image/*"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0], key);
              }
            }}
          />
          <div className="flex items-center gap-3">
            <label 
              htmlFor={`upload-${key}`} 
              className={`px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shadow-sm flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Pilih Gambar
            </label>
            <span className="text-sm text-gray-500">Maks. 2MB</span>
          </div>
        </div>
        <div className="shrink-0">
          {settings[key] ? (
            <img src={settings[key]} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm bg-white" />
          ) : (
             <div className="w-24 h-24 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
               <ImageIcon className="w-6 h-6 opacity-50" />
             </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInputSetting = (label: string, key: string, multiline = false) => (
    <div className="flex flex-col gap-2">
      <label className="font-bold text-sm text-gray-700">{label}</label>
      {multiline ? (
        <textarea 
          name={key}
          value={settings[key] || ''}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
        />
      ) : (
        <input 
          type="text" 
          name={key}
          value={settings[key] || ''}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
          <Settings className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
      </div>
      
      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-bold border ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex flex-wrap overflow-x-auto border-b border-gray-100 bg-gray-50">
          <button type="button" onClick={() => setActiveTab('beranda')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'beranda' ? 'text-blue-700 bg-white border-t-2 border-blue-700' : 'text-gray-500 hover:text-gray-900 border-t-2 border-transparent'}`}><Home className="w-4 h-4" /> Beranda</button>
          <button type="button" onClick={() => setActiveTab('tentang')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'tentang' ? 'text-blue-700 bg-white border-t-2 border-blue-700' : 'text-gray-500 hover:text-gray-900 border-t-2 border-transparent'}`}><Info className="w-4 h-4" /> Tentang Kami</button>
          <button type="button" onClick={() => setActiveTab('layanan')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'layanan' ? 'text-blue-700 bg-white border-t-2 border-blue-700' : 'text-gray-500 hover:text-gray-900 border-t-2 border-transparent'}`}><Settings className="w-4 h-4" /> Produk & Jasa</button>
          <button type="button" onClick={() => setActiveTab('karir')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'karir' ? 'text-blue-700 bg-white border-t-2 border-blue-700' : 'text-gray-500 hover:text-gray-900 border-t-2 border-transparent'}`}><Briefcase className="w-4 h-4" /> Peluang Karir</button>
          <button type="button" onClick={() => setActiveTab('kontak')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'kontak' ? 'text-blue-700 bg-white border-t-2 border-blue-700' : 'text-gray-500 hover:text-gray-900 border-t-2 border-transparent'}`}><Phone className="w-4 h-4" /> Hubungi Kami</button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {activeTab === 'beranda' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Konten Beranda</h2>
              {renderInputSetting('Sub-Judul Hero', 'hero_subtitle')}
              {renderInputSetting('Judul Hero', 'hero_title', true)}
              {renderInputSetting('Teks Pendek', 'hero_desc', true)}
              {renderImageSetting('Gambar Hero', 'hero_image')}
            </div>
          )}

          {activeTab === 'tentang' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Konten Tentang Kami</h2>
              {renderInputSetting('Sub-Judul', 'about_subtitle')}
              {renderInputSetting('Judul Utama', 'about_title')}
              {renderInputSetting('Deskripsi Singkat', 'about_text', true)}
              {renderInputSetting('Judul Bagian 2', 'about_section2_title')}
              {renderInputSetting('Deskripsi Bagian 2 (Paragraf 1)', 'about_section2_text1', true)}
              {renderInputSetting('Deskripsi Bagian 2 (Paragraf 2)', 'about_section2_text2', true)}
              {renderImageSetting('Gambar Tentang Kami', 'about_image')}
            </div>
          )}

          {activeTab === 'layanan' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Konten Produk & Jasa</h2>
              {renderInputSetting('Sub-Judul', 'services_subtitle')}
              {renderInputSetting('Judul', 'services_title')}
              <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-xl border border-gray-200">Catatan: Item layanan dapat diubah secara langsung melalui kode untuk saat ini.</p>
            </div>
          )}

          {activeTab === 'karir' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Konten Peluang Karir</h2>
              {renderInputSetting('Judul Karir', 'career_title')}
              {renderInputSetting('Deskripsi Karir', 'career_text', true)}
              {renderImageSetting('Gambar Karir', 'career_image')}
            </div>
          )}

          {activeTab === 'kontak' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Konten Hubungi Kami</h2>
              {renderInputSetting('Judul Kontak', 'contact_title')}
              {renderInputSetting('Deskripsi Kontak', 'contact_text', true)}
            </div>
          )}

          <div className="pt-8 mt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading || isUploading}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
