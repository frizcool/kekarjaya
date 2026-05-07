import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { MapPin, Phone, Mail, ArrowRight, Calendar, Heart, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Activity {
  id: number;
  date: string;
  title: string;
  location: string;
  content: string;
  image_url: string;
  likes_count: number;
  shares_count: number;
}

export function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [recent, setRecent] = useState<Activity[]>([]);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll position when loading a new detail
    
    fetch('/api/activities')
      .then(res => res.json())
      .then((data: Activity[]) => {
        const found = data.find(item => item.id.toString() === id);
        if (found) {
          setActivity(found);
          setLikes(found.likes_count || 0);
          setShares(found.shares_count || 0);
        }
        setRecent(data.filter(item => item.id.toString() !== id).slice(0, 4));
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/activities/${id}/like`, { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    try {
      const res = await fetch(`/api/activities/${id}/share`, { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        setShares(data.shares);
        navigator.clipboard.writeText(window.location.href);
        alert('Tautan halaman ini telah disalin!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!activity) {
    return (
      <div className="py-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 max-w-7xl mx-auto pb-24">
      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col"
      >
        <Link 
          to="/kegiatan"
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-700 mb-8 w-fit transition-colors"
        >
          <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Kembali ke Daftar Kegiatan
        </Link>

        {activity.image_url ? (
          <div className="w-full rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 mb-10">
            <img 
              src={activity.image_url} 
              alt={activity.title} 
              className="w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-[400px] bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-10">
            <Calendar className="w-20 h-20 opacity-50" />
          </div>
        )}
        
        <div className="mb-10 flex flex-col items-start">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
              {!isNaN(new Date(activity.date).getTime()) 
                ? format(new Date(activity.date), 'dd MMMM yyyy', { locale: localeId }) 
                : 'Tanggal tidak valid'}
            </p>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {activity.location}
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">{activity.title}</h1>
        </div>

        <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-medium whitespace-pre-wrap mb-12">
          {activity.content}
        </div>

        <div className="flex items-center gap-4 pt-8 border-t border-gray-100">
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-xl font-bold transition-colors"
            onClick={handleLike}
          >
            <Heart className="w-5 h-5 fill-current" />
            <span>{likes} Suka</span>
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 rounded-xl font-bold transition-colors"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            <span>{shares} Bagikan</span>
          </button>
        </div>
      </motion.div>

      {/* Sidebar */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col gap-8"
      >
        {/* Contact Card */}
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <h3 className="font-extrabold text-xl text-gray-900 mb-6 uppercase tracking-tight">Hubungi Kami</h3>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">Kantor Pusat</span>
              <h4 className="font-bold text-gray-900">PT. Kekar Jaya Security</h4>
              <p className="text-sm text-gray-600 font-medium leading-relaxed mt-1">
                Jl. Salemba Tengah No.78,<br />
                RT.4/RW.8, Paseban, Kec.<br />
                Senen, Kota Jakarta Pusat,<br />
                Daerah Khusus Ibukota<br />
                Jakarta 10440, Indonesia
              </p>
            </div>
            
            <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
              <a href="tel:02131923886" className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors">
                <Phone className="w-4 h-4" /> (021) - 31923886
              </a>
              <a href="mailto:info@kekarjaya.co.id" className="flex items-center justify-center gap-2 bg-blue-700 border border-blue-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-700/20">
                <Mail className="w-4 h-4" /> Email Kami
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
          <h3 className="font-extrabold text-xl text-gray-900 mb-6 uppercase tracking-tight">Info Terbaru</h3>
          <div className="flex flex-col gap-6">
            {recent.map(item => (
              <Link to={`/kegiatan/${item.id}`} key={item.id} className="flex gap-4 group items-center">
                {item.image_url ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl border border-gray-100 flex items-center justify-center bg-gray-50 shrink-0">
                    <Calendar className="w-6 h-6 text-gray-300" />
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                    {!isNaN(new Date(item.date).getTime()) 
                      ? format(new Date(item.date), 'dd MMM yyyy', { locale: localeId }) 
                      : 'Tanggal tidak valid'}
                  </p>
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-700 line-clamp-2 leading-snug">{item.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
