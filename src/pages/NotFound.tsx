import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-2xl px-6 py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-blue-100"
        >
          <ShieldAlert className="w-12 h-12" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-8xl font-extrabold text-gray-900 tracking-tight"
        >
          404
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-3xl font-bold text-gray-800"
        >
          Halaman Tidak Ditemukan
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-lg text-gray-600 max-w-lg"
        >
          Maaf, halaman yang Anda cari tidak ada. Halaman mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
          >
            <Home className="w-5 h-5" />
            Beranda
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
