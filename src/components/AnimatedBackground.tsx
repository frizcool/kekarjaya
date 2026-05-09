import { motion } from 'motion/react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-slate-50">
      <motion.div 
        animate={{ 
          x: [0, 40, -20, 0], 
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          x: [0, -30, 40, 0], 
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-indigo-400/20 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          x: [0, 50, -50, 0], 
          y: [0, 20, 60, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute top-[30%] right-[30%] w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[100px]"
      />
    </div>
  );
}
