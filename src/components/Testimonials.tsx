import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
       name: "Budi Santoso",
       role: "Direktur Operasional, Bank Nasional",
       content: "Kekar Jaya Security telah memberikan perlindungan tanpa kompromi untuk seluruh cabang bank kami. Responsif dan sangat profesional dalam berbagai situasi sulit.",
       initial: "B"
    },
    {
       name: "Anita Wijaya",
       role: "Property Manager, Kawasan Industri",
       content: "Kami sangat bergantung pada KJS untuk keamanan kawasan 24/7. Personil mereka selalu sigap dan sistem yang diimplementasikan sangat mutakhir.",
       initial: "A"
    },
    {
       name: "Hendra Gunawan",
       role: "Ketua RT, Kompleks Perumahan Elit",
       content: "Sejak bergabung dengan KJS, keamanan warga sangat terjamin. Pendekatan humanis namun tegas membuat kami nyaman dan aman setiap saat.",
       initial: "H"
    }
  ];

  return (
    <section className="py-24 relative bg-blue-700 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800 -skew-x-12 translate-x-32 z-0 hidden lg:block opacity-30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16 text-white">
          <h2 className="inline-block px-3 py-1 bg-blue-800 border border-blue-600 rounded-full text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-4">Ulasan Klien</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold uppercase">
            Apa Kata Mereka?
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testi, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1, duration: 0.5 }}
               className="bg-white p-8 rounded-2xl shadow-xl flex flex-col group relative"
             >
                <Quote className="w-10 h-10 text-blue-100 absolute top-6 right-6 opacity-30 group-hover:text-blue-200 transition-colors" />
                <p className="text-gray-600 font-medium leading-relaxed italic mb-8 relative z-10">
                  "{testi.content}"
                </p>
                <div className="mt-auto flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xl rounded-full flex items-center justify-center shrink-0">
                     {testi.initial}
                   </div>
                   <div>
                     <h4 className="font-extrabold text-gray-900 leading-none mb-1">{testi.name}</h4>
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{testi.role}</p>
                   </div>
                </div>
             </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
