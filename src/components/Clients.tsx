import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface Client {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  order_index: number;
}

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setClients(data);
        }
      })
      .catch(err => console.error("Error fetching clients:", err));
  }, []);

  const defaultClients = [
    "Bank Nasional", "Pusat Perbelanjaan", "Kawasan Industri", "Rumah Sakit Internasional",
    "Gedung Perkantoran", "Kompleks Perumahan", "Instansi Pemerintah"
  ];

  return (
    <section id="clients" className="py-24 border-y border-gray-200/50 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3"
        >
          Klien & Mitra
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight"
        >
          Telah Dipercaya Oleh
        </motion.h2>
      </div>

      {clients.length > 0 ? (
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {clients.map((client, index) => (
              <motion.div 
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * (index % 5) }}
                className="flex flex-col items-center max-w-[150px] group"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 flex items-center justify-center p-4 mb-4 transition-transform group-hover:-translate-y-2 duration-300">
                  {client.image_url ? (
                    <img 
                      src={client.image_url} 
                      alt={client.name} 
                      className="max-w-full max-h-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-2xl uppercase">
                      {client.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-bold text-gray-900 text-center">{client.name}</h3>
                {client.description && (
                  <p className="text-xs text-gray-500 text-center mt-1">{client.description}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="relative">
          {/* Fallback to marquee if no clients in DB */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white/40 to-transparent z-10" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/40 to-transparent z-10" />
          
          <div className="flex w-[200%] md:w-max mt-8">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
              className="flex items-center space-x-12 px-6"
            >
              {[...defaultClients, ...defaultClients, ...defaultClients, ...defaultClients].map((client, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-400 font-bold text-sm uppercase tracking-widest whitespace-nowrap">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                   {client}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}
