import { useEffect, useState } from 'react';
import { Users, FileText, MessageSquare } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({ activities: 0, contacts: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesRes, contactsRes] = await Promise.all([
          fetch('/api/activities'),
          fetch('/api/contacts', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
          })
        ]);
        
        if (activitiesRes.ok && contactsRes.ok) {
          const activities = await activitiesRes.json();
          const contacts = await contactsRes.json();
          setStats({ activities: activities.length, contacts: contacts.length });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Kegiatan</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activities}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pesan Masuk</p>
            <p className="text-2xl font-bold text-gray-900">{stats.contacts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pengunjung Bulan Ini</p>
            <p className="text-2xl font-bold text-gray-900">42,105</p>
          </div>
        </div>
      </div>
    </div>
  );
}
