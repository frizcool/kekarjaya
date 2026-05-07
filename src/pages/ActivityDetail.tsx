import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

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
        alert('Tautan halaman ini telah disalin!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!activity) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        {activity.image_url ? (
          <img 
            src={activity.image_url} 
            alt={activity.title} 
            className="w-full h-auto max-h-[500px] object-cover border-2 border-gray-800 mb-6"
          />
        ) : (
          <div className="w-full h-[400px] bg-gray-200 border-2 border-gray-800 flex items-center justify-center text-gray-400 mb-6">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        )}
        
        <div className="text-center mb-10">
          <p className="text-gray-600 mb-2">
            {format(new Date(activity.date), 'dd MMMM yyyy', { locale: localeId })}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{activity.title}</h1>
          <p className="text-xl text-gray-700">{activity.location}</p>
        </div>

        <div className="prose max-w-none text-gray-800 leading-relaxed mb-10 whitespace-pre-wrap">
          {activity.content}
        </div>

        <div className="flex items-center gap-6">
          <button 
            className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
            onClick={handleLike}
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span className="font-bold">{likes}</span>
          </button>
          <button 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors"
            onClick={handleShare}
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 1.98-1.74l1.38-9a2 2 0 0 0-2-2.26H14zM7 21H3V9h4v12z"/></svg>
            <span className="font-bold">{shares}</span>
          </button>
        </div>
      </div>

      <div className="lg:col-span-1 flex flex-col gap-8">
        <div className="border border-gray-800 p-6">
          <h3 className="font-bold text-lg mb-4 text-center border-b border-gray-800 pb-2 -mt-4 bg-white inline-block px-4 relative -top-3 transform translate-y-2">Hubungi Kami</h3>
          <h4 className="font-bold text-gray-900 mb-3 block">PT. Kekar Jaya Security</h4>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Jl. Salemba Tengah No.78,<br />
            RT.4/RW.8, Paseban, Kec.<br />
            Senen, Kota Jakarta Pusat,<br /><br />
            Daerah Khusus Ibukota<br />
            Jakarta 10440, Indonesia
          </p>
          <div className="flex gap-2">
            <button className="flex-1 bg-white border border-gray-800 py-2 text-xs font-bold hover:bg-gray-50">Telepon Kami</button>
            <button className="flex-1 bg-white border border-gray-800 py-2 text-xs font-bold hover:bg-gray-50">Email Kami</button>
          </div>
        </div>

        <div className="border border-gray-800 p-6">
          <h3 className="font-bold text-lg mb-4 text-center border-b border-gray-800 pb-2 -mt-4 bg-white inline-block px-4 relative -top-3 transform translate-y-2">Info Terbaru</h3>
          <div className="flex flex-col gap-6">
            {recent.map(item => (
              <Link to={`/kegiatan/${item.id}`} key={item.id} className="flex flex-col gap-2 group">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover border border-gray-800" />
                ) : (
                  <div className="w-full h-32 border border-gray-800 flex items-center justify-center bg-gray-100">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">{format(new Date(item.date), 'dd MMMM yyyy', { locale: localeId })}</p>
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2">{item.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
