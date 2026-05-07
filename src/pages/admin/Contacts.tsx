import { useEffect, useState, useMemo } from 'react';
import { Search, Calendar, FilterX } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  ip?: string;
  created_at: string;
}

export function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter States
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contacts', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (!res.ok) {
        throw new Error('Gagal mengambil data pesan masuk. Status: ' + res.status);
      }
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat memuat pesan. Pastikan Anda memiliki akses yang sesuai.');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase());
      
      const matchDate = dateFilter === '' || c.created_at.startsWith(dateFilter);
                          
      return matchSearch && matchDate;
    });
  }, [contacts, search, dateFilter]);

  const clearFilters = () => {
    setSearch('');
    setDateFilter('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pesan Masuk</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      {!error && (
        <>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari nama atau email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            
            <div className="relative w-full md:w-auto">
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            
            {(search || dateFilter) && (
              <button 
                onClick={clearFilters}
                className="w-full md:w-auto px-4 py-2 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors border border-red-100"
              >
                <FilterX className="w-5 h-5" /> Reset
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 font-bold text-sm text-gray-600">Tanggal</th>
                  <th className="py-4 px-6 font-bold text-sm text-gray-600">IP Address</th>
                  <th className="py-4 px-6 font-bold text-sm text-gray-600">Nama</th>
                  <th className="py-4 px-6 font-bold text-sm text-gray-600">Email</th>
                  <th className="py-4 px-6 font-bold text-sm text-gray-600">Pesan</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">Memuat data...</td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      {contacts.length === 0 ? 'Belum ada pesan masuk.' : 'Tidak ada pesan yang cocok dengan filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map(contact => (
                    <tr key={contact.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(contact.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap font-mono">{contact.ip || '-'}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">{contact.name}</td>
                      <td className="py-4 px-6 text-sm text-blue-600 whitespace-nowrap">
                        <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700 min-w-[300px]">{contact.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
