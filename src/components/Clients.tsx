import { motion } from 'motion/react';

export function Clients() {
  const clients = [
    "Bank Nasional", "Pusat Perbelanjaan", "Kawasan Industri", "Rumah Sakit Internasional",
    "Gedung Perkantoran", "Kompleks Perumahan", "Instansi Pemerintah"
  ];

  return (
    <section className="py-12 border-y border-gray-200 relative z-10 overflow-hidden bg-white">
      {/* Gradients to mask edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />
      
      <div className="flex w-[200%] md:w-max">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          className="flex items-center space-x-12 px-6"
        >
          {/* Output clients multiple times for smooth continuous loop regardless of screen size */}
          {[...clients, ...clients, ...clients, ...clients].map((client, idx) => (
            <div key={idx} className="flex items-center gap-3 text-gray-400 font-bold text-sm uppercase tracking-widest whitespace-nowrap">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
               {client}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
