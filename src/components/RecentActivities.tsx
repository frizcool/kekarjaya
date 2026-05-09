import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface Activity {
  id: number;
  date: string;
  title: string;
  content: string;
  image_url: string;
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/activities')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setActivities(data.slice(0, 3)); // Get top 3
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (activities.length === 0) return null;

  return (
    <section className="py-24 relative border-t border-gray-100/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="inline-block px-3 py-1 bg-blue-100/80 backdrop-blur-sm rounded-md text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-4 border border-blue-200/50">
              Update Terbaru
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold uppercase text-gray-900 tracking-tight">
              Kegiatan Kami.
            </h3>
          </div>
          <Link 
            to="/kegiatan"
            className="flex items-center gap-2 font-bold text-blue-700 hover:text-blue-800 transition-colors uppercase tracking-widest text-sm"
          >
            Lihat Semua <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {activities.map((activity, idx) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-white/50 flex flex-col group hover:shadow-lg hover:border-blue-100 transition-all"
            >
              {activity.image_url ? (
                <div className="h-48 overflow-hidden shrink-0">
                  <img 
                    src={activity.image_url} 
                    alt={activity.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                  <Calendar className="w-10 h-10 opacity-50" />
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {!isNaN(new Date(activity.date).getTime()) 
                    ? format(new Date(activity.date), 'dd MMMM yyyy', { locale: id }) 
                    : 'Tanggal tidak valid'}
                </p>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {activity.title}
                </h4>
                <p className="text-gray-600 line-clamp-3 text-sm mb-6 flex-1">
                  {activity.content}
                </p>
                <Link 
                  to={`/kegiatan/${activity.id}`}
                  className="inline-flex items-center text-sm font-bold text-blue-700 uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                >
                  Selengkapnya <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
