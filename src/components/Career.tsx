import { motion } from 'motion/react';
import { Briefcase, ChevronRight } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export function Career() {
  const { settings } = useSettings();
  
  const title = settings.career_title || "Peluang Karir";
  const content = settings.career_text || "Bergabunglah dengan tim profesional kami. Kami selalu memberikan kesempatan bagi individu terampil dan berintegritas tinggi untuk berkembang bersama KJS dalam memberikan layanan pengamanan terbaik.";
  const image = settings.career_image || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200";

  return (
    <section id="career" className="py-24 relative border-t border-gray-100/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-widest mb-6">
              <Briefcase className="w-3 h-3" />
              <span>Bergabung Bersama Kami</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight text-gray-900 mb-6 tracking-tight">
              {title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 1 ? 'text-blue-700' : ''}>{word} </span>
              ))}
            </h3>
            
            <p className="text-gray-600 text-lg leading-relaxed font-medium mb-10 whitespace-pre-wrap">
              {content}
            </p>

            <a href="mailto:karir@kekarjaya.co.id" className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-xl shadow-xl shadow-gray-900/20 hover:bg-black transition-colors uppercase tracking-wider text-sm group">
              Kirim CV Anda <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-600 rounded-3xl translate-x-4 translate-y-4 -z-10 opacity-10"></div>
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white relative z-10 w-full h-[500px]">
              <img 
                src={image} 
                alt="Tim Berkualitas" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
