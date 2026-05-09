import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Beranda', path: '/' },
    { name: 'Produk & Jasa', path: '/#services' },
    { name: 'Tentang Kami', path: '/#about' },
    { name: 'Klien Kami', path: '/#clients' },
    { name: 'Hubungi Kami', path: '/#contact' },
    { name: 'Peluang Karir', path: '/#careers' },
    { name: 'Kegiatan', path: '/kegiatan' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl text-blue-600 tracking-tight">KJS</Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link, idx) => {
            const isActive = 
              (link.name === 'Kegiatan' && location.pathname.startsWith('/kegiatan')) ||
              (link.name === 'Beranda' && location.pathname === '/');

            return (
              <a 
                key={idx} 
                href={link.path}
                className={`hover:text-blue-600 transition-colors ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                    : 'text-gray-600'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        <div className="md:hidden flex items-center">
          <button className="text-gray-900 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-100/50 p-4 absolute top-16 left-0 w-full shadow-lg">
          <div className="flex flex-col gap-4 text-center">
            {links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.path}
                className="text-gray-600 hover:text-blue-600 font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
