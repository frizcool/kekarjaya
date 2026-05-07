import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Plus, Search, Calendar, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface Activity {
  id: number;
  date: string;
  title: string;
  location: string;
  content: string;
  image_url: string;
}

export function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchActivities();
  }, [navigate]);

  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/activities');
      if (!res.ok) throw new Error('Gagal mengambil data kegiatan');
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat memuat kegiatan.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setActivityToDelete(id);
  };

  const confirmDelete = async () => {
    if (activityToDelete === null) return;
    try {
      setError('');
      const res = await fetch(`/api/activities/${activityToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!res.ok) throw new Error('Gagal menghapus kegiatan');
      fetchActivities();
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat menghapus kegiatan. Pastikan Anda memiliki akses yang sesuai.');
    } finally {
      setActivityToDelete(null);
    }
  };

  const filtered = activities.filter(a => {
    const matchesSearch = a.title?.toLowerCase().includes(search.toLowerCase()) || false;
    const dateObj = new Date(a.date);
    const isValidDate = !isNaN(dateObj.getTime());
    
    if (!isValidDate) return matchesSearch;

    const matchesMonth = filterMonth ? dateObj.getMonth() + 1 === parseInt(filterMonth) : true;
    const matchesYear = filterYear ? dateObj.getFullYear() === parseInt(filterYear) : true;
    return matchesSearch && matchesMonth && matchesYear;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterMonth, filterYear]);

  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const availableYears: number[] = Array.from<number>(new Set<number>(
    activities
      .map(a => new Date(a.date).getFullYear())
      .filter(y => !isNaN(y))
  )).sort((a: number, b: number) => b - a);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Kegiatan</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/admin/kegiatan/tambah" 
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
          >
            <Plus className="w-5 h-5" />
            Tambah Kegiatan
          </Link>
        </motion.div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari judul kegiatan..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            value={filterMonth} 
            onChange={e => setFilterMonth(e.target.value)}
            className="border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 font-medium cursor-pointer"
          >
            <option value="">Semua Bulan</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{format(new Date(2000, m - 1), 'MMMM', { locale: localeId })}</option>
            ))}
          </select>

          <select 
            value={filterYear} 
            onChange={e => setFilterYear(e.target.value)}
            className="border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 font-medium cursor-pointer"
          >
            <option value="">Semua Tahun</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Memuat data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center">
            <Calendar className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Tidak ada kegiatan yang ditemukan.</p>
          </div>
        ) : (
          currentItems.map(activity => (
            <div key={activity.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
              {activity.image_url ? (
                <img 
                  src={activity.image_url} 
                  alt={activity.title} 
                  className="w-full md:w-64 h-40 object-cover rounded-xl shrink-0"
                />
              ) : (
                <div className="w-full md:w-64 h-40 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                  <Calendar className="w-10 h-10 opacity-50" />
                </div>
              )}
              <div className="flex-1 flex flex-col pt-1">
                <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-max mb-2">
                  {!isNaN(new Date(activity.date).getTime()) 
                    ? format(new Date(activity.date), 'dd MMMM yyyy', { locale: localeId }) 
                    : 'Tanggal tidak valid'}
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h2>
                <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed mb-4">
                  {activity.content}
                </p>
                
                <div className="flex items-center gap-3 mt-auto">
                  <Link 
                    to={`/admin/kegiatan/ubah/${activity.id}`}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    Ubah
                  </Link>
                  <button 
                    onClick={() => handleDelete(activity.id)}
                    className="px-4 py-2 border border-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {activityToDelete !== null && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Kegiatan</h3>
            <p className="text-gray-600 mb-6 font-medium text-sm leading-relaxed">
              Apakah Anda yakin ingin menghapus kegiatan ini? Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button 
                onClick={() => setActivityToDelete(null)}
                className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-50 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-600/20"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
