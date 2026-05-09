import { motion, useScroll, useTransform } from 'motion/react';
import { ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useRef } from 'react';

export function Hero() {
  const { settings } = useSettings();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const title = settings.hero_title || "Standar Baru Pengamanan Modern.";
  const subtitle = settings.hero_subtitle || "Keamanan adalah Prioritas Kami";
  const desc = settings.hero_desc || "Kami mendedikasikan diri untuk merancang, mengimplementasikan, dan mengelola solusi keamanan fisik terpadu bagi aset berharga Anda.";
  const image = settings.hero_image || "https://images.unsplash.com/photo-1541888086053-96b653b6f264?q=80&w=1200&auto=format&fit=crop";

  return (
    <section id="home" ref={ref} className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-left flex flex-col items-start pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-md text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-6 border border-blue-100"
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ShieldCheck className="w-4 h-4" />
            </motion.div>
            <span>{subtitle}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold uppercase leading-[1.1] text-gray-900 tracking-tight whitespace-pre-wrap"
          >
            {title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-gray-600 leading-relaxed font-medium whitespace-pre-wrap"
          >
            {desc}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8 w-full"
          >
            <a href="#services" className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 text-white font-bold rounded-md shadow-xl shadow-blue-700/20 hover:bg-blue-800 transition-colors uppercase tracking-wider text-sm">
              Layanan Kami <ChevronRight className="w-5 h-5" />
            </a>
            <a href="#about" className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-700 text-blue-700 font-bold rounded-md hover:bg-blue-50 transition-colors uppercase tracking-wider text-sm">
              Tentang Kami
            </a>
            <a href="#contact" className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-md hover:border-gray-300 hover:text-gray-900 transition-colors uppercase tracking-wider text-sm">
              Hubungi Kami
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex items-center gap-6 text-sm font-bold text-gray-500"
          >
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Tersertifikasi</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Operasional 24/7</div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative w-full max-w-lg lg:max-w-none"
        >
          {/* Security Guard Image / Modern office */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
            <motion.img 
              src={image} 
              alt="Security Professional" 
              style={{ y }}
              className="absolute top-[-10%] left-0 w-full h-[120%] object-cover"
            />
            {/* Overlay stats */}
            <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur shadow-lg rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                1k+
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 leading-none mb-1">Tenaga Aktif</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tersebar di Indonesia</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
