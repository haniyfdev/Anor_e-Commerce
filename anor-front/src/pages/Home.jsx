import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    '/banners/reklam1.jpg',
    '/banners/reklam2.jpg',
    '/banners/reklam3.jpg'
  ];

  useEffect(() => {
    fetchData(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    console.log('📷 Banners:', banners);
    console.log('Current banner:', currentBanner);
  }, [currentBanner]);
    
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/');
        setCategories(response.data || []);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchData = async (page = 1, categoryId = null) => {
    try {
      setLoading(true);
      console.log(`🔄 Fetching data: Page ${page}, Category ${categoryId}`);
      
      let url = `/products/?page=${page}&limit=${limit}`;
      if (categoryId) {
        url += `&category_id=${categoryId}`;
      }
      
      const response = await api.get(url);
      const responseData = response.data;
      const productsData = responseData.data || [];
      
      setProducts(productsData);
      setTotalPages(responseData.total_pages || 1);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${searchQuery}`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  const getCategoryImage = (category) => {
    if (category && category.image_url) {
      return `https://anor-e-commerce.onrender.com${category.image_url}`;
    }

    const images = {
      "meva": "/category_icon/meva.png",
      "sabzavot": "/category_icon/sabzavot.png",
      "urug' va don": "/category_icon/donurug.png",
      "chorva": "/category_icon/chorva.png",
      "texnika": "/category_icon/texnika.png",
      "ozuqa va dorilar": "/category_icon/ozuqadori.png",
      "ko'chat": "/category_icon/kochat.png",
      "gullar": "/category_icon/gul.png",
    };
    
    if (!category) return "/category_icon/barchasi.png";

    const name = category.name.toLowerCase();
    
    if (images[name]) return images[name];
    
    if (name.includes("urug")) return images["urug' va don"];
    if (name.includes("ozuqa")) return images["ozuqa va dorilar"];
    if (name.includes("ko'chat")) return images["ko'chat"];
    if (name.includes("gul")) return images["gullar"];
    
    return "/category_icon/barchasi.png";
  };
  
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };
  
  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-primary-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-black mb-4 tracking-tighter text-white italic">ANOR MARKETPLACE</h1>
            <p className="text-xl text-white/80 font-medium tracking-tight">O'zbekistonning eng yirik qishloq xo'jaligi bozori</p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative shadow-2xl rounded-full overflow-hidden border border-white/5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nima qidiramiz?"
              className="w-full px-8 py-5 text-gray-800 text-lg focus:outline-none bg-white"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 bg-primary-900 text-white px-10 font-bold hover:bg-black transition-all"
            >
              IZLASH
            </button>
          </form>
        </div>
      </div>

            {/* Transition Section with Categories */}
      <div className="h-52 bg-gradient-to-b from-primary-800 to-white relative">
        <div className="max-w-7xl mx-auto px-4 absolute inset-0 -top-10 z-10">
          <div className="flex flex-nowrap justify-center items-start gap-4 md:gap-6 py-2 overflow-x-visible">
            
            {/* BARCHASI tugmasi */}
            <button 
              onClick={() => handleCategoryClick(null)} 
              className="flex flex-col items-center flex-shrink-0 group"
            >
              {/* Dumaloq ramka - rasm KATTA zoom */}
              <div className={`w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl overflow-hidden ${
                selectedCategory === null ? 'bg-primary-800 scale-105 ring-8 ring-white' : 'bg-white hover:bg-gray-50'
              }`}>
                <img 
                  src="/category_icon/barchasi.png" 
                  alt="Barchasi" 
                  className="w-full h-full object-cover scale-[1.6]"
                  onError={(e) => {
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png';
                  }}
                />
              </div>
              {/* Text ramka ostida */}
              <span className={`mt-3 text-xs md:text-sm font-black tracking-tight text-center leading-none uppercase ${
                selectedCategory === null ? 'text-primary-800' : 'text-gray-600'
              }`}>
                BARCHASI
              </span>
            </button>
            
            {/* Kategoriya tugmalari */}
            {categories.map((category) => (
              <button 
                key={category.id} 
                onClick={() => handleCategoryClick(category.id)} 
                className="flex flex-col items-center flex-shrink-0 group"
              >
                {/* Dumaloq ramka - rasm KATTA zoom */}
                <div className={`w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl overflow-hidden ${
                  selectedCategory === category.id ? 'bg-primary-800 scale-105 ring-8 ring-white' : 'bg-white hover:bg-gray-50'
                }`}>
                  <img 
                    src={getCategoryImage(category)} 
                    alt={category.name} 
                    className="w-full h-full object-cover scale-[1.6]"
                    onError={(e) => {
                      e.target.src = 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png';
                    }}
                  />
                </div>
                {/* Text ramka ostida */}
                <span className={`mt-3 text-xs md:text-sm font-black tracking-tight text-center leading-none uppercase ${
                  selectedCategory === category.id ? 'text-primary-800' : 'text-gray-600'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* BANNER CAROUSEL */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          <div className="relative h-[400px] bg-gradient-to-r from-purple-600 to-blue-600">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/1200x400/7B3B8B/FFFFFF?text=ANOR+MARKET';
                  }}
                />
              </div>
            ))}
          </div>
          
          <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button key={index} onClick={() => setCurrentBanner(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentBanner ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16 bg-white">
        <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-6">
          <h2 className="text-4xl font-black text-gray-900 lowercase tracking-tighter">
            {selectedCategory === null ? 'barcha mahsulotlar' : categories.find(c => c.id === selectedCategory)?.name.toLowerCase()}
          </h2>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-full shadow-sm">
            {products.length} natija
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-800"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">E'lonlar topilmadi</h3>
            <p className="text-gray-600">Backend ishlamayapti yoki mahsulotlar yo'q</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-16">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-8 py-3 bg-gray-100 rounded-full font-black text-xs tracking-widest hover:bg-primary-800 hover:text-white transition-all disabled:opacity-30 uppercase"
                >
                  ORQAGA
                </button>
                
                <span className="text-sm font-black text-gray-400 tracking-tighter">
                  {currentPage} / {totalPages}
                </span>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-8 py-3 bg-gray-100 rounded-full font-black text-xs tracking-widest hover:bg-primary-800 hover:text-white transition-all disabled:opacity-30 uppercase"
                >
                  OLDINGA
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;