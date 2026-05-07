import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

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
  const [currentPage, setCurrentPage] = useState(1);
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

  const fetchActivities = () => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error(err));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return;

    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (res.ok) {
        fetchActivities();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = activities.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  // if searching causes page to be out of bounds, reset to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12">
      <div className="w-full max-w-7xl mx-auto px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-10">Selamat Datang Admin</h1>
        
        <div className="flex items-center gap-6 mb-10">
          <Link 
            to="/admin/kegiatan/tambah" 
            className="border-2 border-gray-800 py-2 px-6 font-bold hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
          >
            Tambah Kegiatan
          </Link>
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="search" 
              className="border-2 border-gray-800 rounded-full py-1.5 pl-10 pr-4 focus:outline-none w-64 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {filtered.length === 0 ? (
            <p className="text-gray-500 py-8 text-center bg-white border border-gray-200">Tidak ada data.</p>
          ) : (
            currentItems.map(activity => (
              <div key={activity.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-400 pb-8 last:border-0 relative group">
                {activity.image_url ? (
                  <img 
                    src={activity.image_url} 
                    alt={activity.title} 
                    className="w-full md:w-[350px] h-56 object-cover border-2 border-gray-800"
                  />
                ) : (
                  <div className="w-full md:w-[350px] h-56 bg-gray-200 border-2 border-gray-800 flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-start pt-2">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {format(new Date(activity.date), 'dd MMMM yyyy', { locale: localeId })}
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{activity.title}</h2>
                  <p className="text-gray-700 line-clamp-3 leading-relaxed mb-6">
                    {activity.content}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <Link 
                      to={`/admin/kegiatan/ubah/${activity.id}`}
                      className="border-2 border-gray-800 py-1 px-6 font-bold hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-sm"
                    >
                      Ubah
                    </Link>
                    <button 
                      onClick={() => handleDelete(activity.id)}
                      className="border-2 border-gray-800 py-1 px-6 font-bold hover:bg-red-50 hover:text-red-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4 pb-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center font-bold ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
