import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ServerCrash, Home, RefreshCw } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-2xl px-6 py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-red-100"
        >
          <ServerCrash className="w-12 h-12" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-8xl font-extrabold text-gray-900 tracking-tight"
        >
          500
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-3xl font-bold text-gray-800"
        >
          Kesalahan Internal Server
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-lg text-gray-600 max-w-lg"
        >
          Terjadi kesalahan pada sistem kami. Tim teknis kami sedang berupaya memperbaikinya secepat mungkin. Maaf atas ketidaknyamanan ini.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Coba Lagi
          </button>
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
          >
            <Home className="w-5 h-5" />
            Beranda
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
