import { motion } from 'motion/react';
import { Target, Users, ShieldAlert, Award, ChevronRight } from 'lucide-react';

export function About() {
  const stats = [
    { label: "Tahun Berdiri", value: "2006", icon: <Target className="w-6 h-6 text-blue-600" /> },
    { label: "Tenaga Terlatih", value: "1000+", icon: <Users className="w-6 h-6 text-blue-600" /> },
    { label: "Sistem Aktif", value: "24/7", icon: <ShieldAlert className="w-6 h-6 text-blue-600" /> },
    { label: "Klien Institusi", value: "150+", icon: <Award className="w-6 h-6 text-blue-600" /> },
  ];

  return (
    <section id="about" className="py-24 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-4">Mengenal KJS</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight text-gray-900">
            Selektif. <span className="text-blue-700">Terlatih.</span> Profesional.
          </h3>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed font-medium">
            Semenjak didirikan pada tahun 2006, KEKAR JAYA SECURITY telah bekerja sama dengan berbagai entitas untuk menyediakan perlindungan terbaik. Kami mengedepankan sikap profesional, berpengalaman, dan integritas yang tinggi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {stat.icon}
              </div>
              <span className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-2xl">
             <img src="https://images.unsplash.com/photo-1596701062973-2d2bc7e4c278?q=80&w=1200&auto=format&fit=crop" alt="Security Control Room" className="w-full h-auto object-cover min-h-[400px]" />
          </div>
          <div className="order-1 lg:order-2 flex flex-col items-start">
             <h4 className="text-2xl font-extrabold uppercase text-gray-900 mb-4">Pengembangan Kualitas Berkelanjutan</h4>
             <p className="text-gray-600 leading-relaxed font-medium mb-6">
               Kami sangat selektif dalam rekrutmen tenaga kerja. Semua personel kami wajib mengikuti pelatihan intensif di bawah instruktur berpengalaman, dengan kurikulum standar pengamanan yang tersertifikasi. 
             </p>
             <p className="text-gray-600 leading-relaxed font-medium mb-8">
               Pengawasan kualitas adalah komitmen utama kami. Kami melakukan audit secara reguler untuk menjamin seluruh prosedur (SOP) dilakukan sesuai protokol demi kepuasan klien.
             </p>
             <a href="#services" className="font-bold text-blue-700 uppercase tracking-widest border-b-2 border-blue-700 pb-1 hover:text-blue-800 flex items-center gap-2">
               Lihat Layanan Kami <ChevronRight className="w-4 h-4" />
             </a>
          </div>
        </div>
      </div>
    </section>
  );
}
