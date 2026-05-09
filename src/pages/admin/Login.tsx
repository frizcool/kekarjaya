import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, User, Lock, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/kekarjaya-admin-panel/kegiatan');
      } else {
        setError(data.error || 'Autentikasi gagal. Periksa username dan password.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Kesalahan jaringan. Tidak dapat terhubung ke server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden p-6 w-full">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-32 z-0 hidden lg:block border-l border-blue-100/50 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-gray-100"
      >
        {/* Left Side: Branding */}
        <div className="lg:w-5/12 bg-blue-700 text-white p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-7 h-7 text-blue-700" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">KJS ADMIN</span>
            </div>
            
            <h1 className="text-4xl font-extrabold leading-[1.1] mb-6">
              Sistem<br/> Manajemen<br/> <span className="text-blue-200">Terpadu.</span>
            </h1>
            <p className="text-blue-100 font-medium leading-relaxed max-w-sm">
              Akses khusus untuk administrator operasional PT Kekar Jaya Security. Lindungi data dan kelola informasi publik melalui jalur aman.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 lg:mt-0 pt-12 border-t border-blue-600/50">
             <div className="flex items-center gap-4 text-sm font-medium">
               <div className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-400" /> Dilindungi</div>
               <div className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-400" /> Aktif</div>
             </div>
             <p className="mt-4 text-xs text-blue-200 leading-relaxed font-mono tracking-wider opacity-80">
               &copy; {new Date().getFullYear()} PT KEKAR JAYA UTAMA.<br/> SELURUH HAK CIPTA DILINDUNGI.
             </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Selamat Datang</h2>
              <p className="text-gray-500 font-medium text-sm">Silakan masuk dengan kredensial administrator.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-start gap-3 shadow-sm"
              >
                <div className="mt-0.5"><Shield className="w-4 h-4" /></div>
                <p>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Username</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Masukkan username" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:border-blue-600 checked:bg-blue-600 transition-colors cursor-pointer"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Ingat Saya</span>
                </label>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white rounded-xl py-4 font-bold tracking-widest uppercase hover:bg-blue-800 active:bg-blue-900 transition-all shadow-lg shadow-blue-700/30 disabled:opacity-70 disabled:cursor-not-allowed group mt-8"
              >
                {isLoading ? (
                  <>
                    <Activity className="w-5 h-5 animate-pulse" />
                    Verifikasi...
                  </>
                ) : (
                  <>
                    Masuk <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
