export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12 bg-white relative z-10">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">K</div>
          <span className="font-extrabold text-lg tracking-tight uppercase text-gray-900">
            Kekar Jaya
          </span>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
             Security & Infrastructure
          </div>
          <div className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} PT KEKAR JAYA UTAMA. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
