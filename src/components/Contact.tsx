import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { settings } = useSettings();
  const contactTitle = settings.contact_title || "Menjangkau Kami";
  const contactText = settings.contact_text || "Silakan hubungi kami untuk mendiskusikan kebutuhan layanan pengamanan Anda. Tim kami siap membantu.";

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setCaptchaA(Math.floor(Math.random() * 10) + 1);
    setCaptchaB(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer('');
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Client side validasi
    if (!name.trim() || !email.trim() || !message.trim() || !captchaAnswer.trim()) {
      setError('Mohon lengkapi semua bidang yang diwajibkan.');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Format email tidak valid.');
      return;
    }
    
    const parsedAns = parseInt(captchaAnswer);
    if (isNaN(parsedAns) || parsedAns !== captchaA + captchaB) {
      setError('Jawaban captcha salah.');
      generateCaptcha();
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name, 
          email, 
          message,
          captchaAnswer: parsedAns,
          captchaExpected: captchaA + captchaB
        })
      });

      if (res.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        generateCaptcha();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal mengirim pesan. Silakan coba lagi.');
        generateCaptcha();
      }
    } catch (err) {
      setError('Terjadi kesalahan. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-4">Informasi Kontak</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold uppercase mb-6 text-gray-900">
              {contactTitle.split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 1 ? 'text-blue-700' : ''}>{word} </span>
              ))}
            </h3>
            
            <p className="text-gray-600 mb-10 leading-relaxed font-medium whitespace-pre-wrap">
              {contactText}
            </p>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 text-blue-700">
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
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 text-blue-700">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold uppercase tracking-wider text-gray-900 mb-1">Telepon</h5>
                  <p className="text-gray-600 font-medium">(021) - 31923886</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 text-blue-700">
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
            className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-white/50 flex flex-col justify-center"
          >
            <h4 className="text-2xl font-extrabold uppercase mb-8 text-gray-900">
               Tinggalkan Pesan
            </h4>
            
            {success && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 className="mb-6 p-6 bg-green-50 text-green-700 font-medium border border-green-200 rounded-xl flex flex-col items-center justify-center text-center gap-3"
               >
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
                   className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                 >
                   <CheckCircle2 className="w-6 h-6 text-green-600" />
                 </motion.div>
                 Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.
               </motion.div>
            )}
            
            {error && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mb-6 p-4 bg-red-50 text-red-700 font-medium border border-red-200 rounded-lg flex items-center gap-3"
               >
                 <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                 {error}
               </motion.div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                  placeholder="Masukkan nama Anda" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Alamat Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                  placeholder="nama@perusahaan.com" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Pesan</label>
                <textarea 
                  rows={4} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" 
                  placeholder="Tuliskan kebutuhan Anda..." 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-gray-400" /> Verifikasi Keamanan
                </label>
                <div className="flex gap-4 items-center">
                  <span className="bg-gray-100 border border-gray-200 text-gray-900 font-bold px-4 py-4 rounded-md tracking-widest flex items-center justify-center min-w-[100px]">
                    {captchaA} + {captchaB} = ?
                  </span>
                  <input 
                    type="text" 
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value.replace(/\D/g, ''))} // only digits
                    className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all flex-1" 
                    placeholder="Jawaban..." 
                    maxLength={3}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-700 text-white font-bold uppercase tracking-widest p-4 rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-700/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Kirim Pesan <Send className="w-4 h-4" /></>}
              </button>
            </form>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
