import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-24 relative bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-4">Informasi Kontak</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold uppercase mb-8 text-gray-900">
              Menjangkau <span className="text-blue-700">Kami</span>
            </h3>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-700">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold uppercase tracking-wider text-gray-900 mb-2">Kantor Pusat</h5>
                  <p className="text-gray-600 font-medium leading-relaxed max-w-sm">
                    PT. Kekar Jaya Security <br />
                    Jl. Salemba Tengah No.78, RT.4/RW.8, Paseban, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10440, Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-700">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold uppercase tracking-wider text-gray-900 mb-1">Telepon</h5>
                  <p className="text-gray-600 font-medium">(021) - 31923886</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-700">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold uppercase tracking-wider text-gray-900 mb-1">Email</h5>
                  <p className="text-gray-600 font-medium">info@kekarjaya.co.id</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-center"
          >
            <h4 className="text-2xl font-extrabold uppercase mb-8 text-gray-900">
               Tinggalkan Pesan
            </h4>
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Nama Lengkap</label>
                <input type="text" className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Masukkan nama Anda" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Alamat Email</label>
                <input type="email" className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="nama@perusahaan.com" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Pesan</label>
                <textarea rows={4} className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" placeholder="Tuliskan kebutuhan Anda..." />
              </div>
              <button className="bg-blue-700 text-white font-bold uppercase tracking-widest p-4 rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-700/20">
                Kirim Pesan <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
