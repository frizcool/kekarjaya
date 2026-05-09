import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Users, MessageSquare, Menu, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // auto close on mobile after navigation
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setShowLogoutConfirm(false);
    navigate('/kekarjaya-admin-panel');
  };

  const navItems = [
    { name: 'Dashboard', path: '/kekarjaya-admin-panel/dashboard', icon: LayoutDashboard },
    { name: 'Kegiatan', path: '/kekarjaya-admin-panel/kegiatan', icon: FileText },
    { name: 'Klien Kami', path: '/kekarjaya-admin-panel/klien', icon: Users },
    { name: 'Pesan Masuk', path: '/kekarjaya-admin-panel/kontak', icon: MessageSquare },
    { name: 'Pengaturan', path: '/kekarjaya-admin-panel/pengaturan', icon: Settings },
    { name: 'Profil', path: '/kekarjaya-admin-panel/profil', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header / Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-20 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold font-mono">KJS</span>
          </div>
          <span className="font-extrabold tracking-tight text-gray-900">AdminPanel</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-40 lg:z-10 shadow-xl lg:shadow-sm mt-16 lg:mt-0"
          >
            <div className="p-6 border-b border-gray-100 hidden lg:flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold font-mono">KJS</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">AdminPanel</span>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 p-8 pt-24 lg:pt-8 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Header Toggle for Desktop */}
          <div className="hidden lg:flex items-center mb-8 gap-4">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg shadow-sm"
             >
               <Menu className="w-5 h-5" />
             </button>
             <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Menu Navigasi</h2>
          </div>
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Keluar</h3>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin keluar dari halaman admin?</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
