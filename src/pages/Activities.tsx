import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Search, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

interface Activity {
  id: number;
  date: string;
  title: string;
  location: string;
  content: string;
  image_url: string;
}

export function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const itemsPerPage = 5;

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch('/api/activities')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat data kegiatan. Silakan coba beberapa saat lagi.');
        return res.json();
      })
      .then(data => {
        setActivities(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Terjadi kesalahan sistem saat memuat data.');
        setIsLoading(false);
      });
  }, []);

  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    const query = searchQuery.toLowerCase();
    return activities.filter(
      a => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query)
    );
  }, [activities, searchQuery]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const currentItems = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-8">
      <SEO title="Daftar Kegiatan" description="Lihat berbagai kegiatan dan laporan terbaru dari PT Kekar Jaya Security." />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">Daftar Kegiatan</h1>
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berita atau kegiatan..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-900"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col md:flex-row gap-6 border border-gray-100 p-4 rounded-2xl bg-white shadow-sm animate-pulse">
              <div className="w-full md:w-72 h-48 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <div className="w-32 h-4 bg-gray-200 rounded mb-4" />
                  <div className="w-3/4 h-8 bg-gray-200 rounded mb-4" />
                  <div className="w-full h-4 bg-gray-200 rounded mb-2" />
                  <div className="w-5/6 h-4 bg-gray-200 rounded" />
                </div>
                <div className="w-32 h-6 bg-gray-200 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="font-bold text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors shadow-md shadow-red-500/20"
          >
            Coba Lagi
          </button>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 p-16 rounded-2xl text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 text-xl font-bold">Belum ada kegiatan yang ditemukan.</p>
          {searchQuery && <p className="text-gray-500 mt-2 font-medium">Coba gunakan kata kunci pencarian yang lain.</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {currentItems.map(activity => (
            <div key={activity.id} className="flex flex-col md:flex-row gap-6 p-4 border border-gray-100 rounded-2xl bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              {activity.image_url ? (
                <div className="w-full md:w-72 h-48 rounded-xl overflow-hidden shadow-sm shrink-0">
                  <img 
                    src={activity.image_url} 
                    alt={activity.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full md:w-72 h-48 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 shrink-0">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              )}
              <div className="flex-1 flex flex-col justify-start pt-1">
                <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2 bg-blue-50 px-2 py-1 inline-block rounded w-fit">
                  {!isNaN(new Date(activity.date).getTime()) 
                    ? format(new Date(activity.date), 'dd MMMM yyyy', { locale: id }) 
                    : 'Tanggal tidak valid'}
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">
                  <Link to={`/kegiatan/${activity.id}`}>{activity.title}</Link>
                </h2>
                <p className="text-gray-600 line-clamp-3 font-medium mb-4">
                  {activity.content}
                </p>
                <div className="mt-auto">
                  <Link 
                    to={`/kegiatan/${activity.id}`}
                    className="text-sm font-bold text-gray-900 uppercase tracking-widest hover:text-blue-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Selengkapnya <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 py-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sebelumnya
          </button>
          
          <div className="flex gap-1 mx-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              if (
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg border-2 ${
                      currentPage === page 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'border-transparent bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                    } flex items-center justify-center font-bold tracking-tight transition-all`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}
