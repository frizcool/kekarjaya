import { motion } from 'motion/react';
import { Shield, Camera, Scale, ChevronRight } from 'lucide-react';

export function Services() {
  const services = [
    {
      id: "outsourcing",
      title: "Penyedia Tenaga Kerja",
      icon: <Shield className="w-12 h-12 mb-6 text-blue-700" />,
      items: ["Security Guards", "Cleaning Service", "Karyawan Ritel", "Petugas Parkir"],
      className: "md:col-span-2 md:row-span-2 bg-white",
      desc: "Menyediakan personil unggul yang dilatih dengan disiplin ketat untuk menjaga kondusifitas lingkungan Anda."
    },
    {
      id: "procuring",
      title: "Sistem Keamanan",
      icon: <Camera className="w-10 h-10 mb-4 text-blue-100" />,
      items: ["Sistem CCTV", "Metal Detector", "Access Control"],
      className: "bg-blue-700 text-white border-transparent",
      desc: "Instalasi perangkat keamanan teknologi tinggi."
    },
    {
      id: "law",
      title: "Konsultan Hukum",
      icon: <Scale className="w-10 h-10 mb-4 text-indigo-700" />,
      items: ["Legal Consultant", "Property Rights", "Attorney"],
      className: "bg-indigo-50 border-indigo-100",
      desc: "Perlindungan hukum untuk aktivitas bisnis Anda."
    }
  ];

  return (
    <section id="services" className="py-24 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="inline-block px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-4">Lini Bisnis</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold uppercase text-gray-900">
            Total Security <span className="text-blue-700">Solution</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {services.map((svc, idx) => {
            const isDark = svc.className.includes('bg-blue-700');
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`rounded-2xl p-8 flex flex-col group cursor-pointer overflow-hidden border ${isDark ? 'shadow-xl shadow-blue-700/30' : 'border-gray-200 shadow-lg shadow-gray-100/50'} relative ${svc.className}`}
              >
                
                <div className="relative z-10 flex-1 flex flex-col">
                  {svc.icon}
                  <h4 className={`text-2xl font-extrabold uppercase mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{svc.title}</h4>
                  <p className={`text-sm font-medium mb-6 ${isDark ? 'text-blue-100' : 'text-gray-600'}`}>{svc.desc}</p>
                  
                  <ul className="space-y-3 mt-auto">
                    {svc.items.map((item, i) => (
                      <li key={i} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${isDark ? 'text-white' : 'text-gray-600'}`}>
                        <ChevronRight className={`w-4 h-4 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  );
}
