import { Instagram, Facebook, Send, Youtube, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white border-t border-white/10">
      {/* py-6 — bu o'rtacha balandlik (na juda katta, na juda kichik) */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-between items-center gap-6">
          
          {/* Chap tomon: Brend */}
          <div className="flex-1 min-w-[180px]">
            <a href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              Anor Market
            </a>
            <p className="text-xs mt-1 opacity-60 italic">Sizning ishonchli hamkoringiz</p>
          </div>

          {/* Markaz: Ijtimoiy tarmoqlar */}
          <div className="flex flex-col items-center space-y-2.5">
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">Biz ijtimoiy tarmoqlarda kuzating</span>
            <div className="flex items-center space-x-5">
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transform hover:scale-110 transition-all">
                <Send size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transform hover:scale-110 transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transform hover:scale-110 transition-all">
                <Facebook size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transform hover:scale-110 transition-all">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* O'ng tomon: Aloqa */}
          <div className="flex-1 min-w-[180px] flex flex-col items-end space-y-2">
            <a href="mailto:info@anor.uz" className="flex items-center space-x-2 group">
              <span className="text-sm group-hover:underline opacity-90">info@anor.uz</span>
              <span className="bg-white/5 p-1 rounded-full text-[12px]">✉️</span>
            </a>
            <a href="tel:+998901234567" className="flex items-center space-x-2 group">
              <span className="text-sm group-hover:underline opacity-90">+998 90 123 45 67</span>
              <span className="bg-white/5 p-1 rounded-full text-[12px]">📱</span>
            </a>
          </div>
        </div>

        {/* Pastki qism: mt-6 va pt-5 — me'yordagi chegara */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] opacity-50 tracking-wide">
          <p>© 2026 ANOR MARKET. BARCHA HUQUQLAR HIMOYALANGAN.</p>
          <div className="flex items-center space-x-1">
            <span>MADE WITH</span>
            <span className="text-red-500">❤️</span>
            <span>IN BEKOBOD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;