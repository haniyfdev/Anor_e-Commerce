import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // BANNER CAROUSEL STATE
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    '/banners/reklam1.jpg',
    '/banners/reklam2.jpg',
    '/banners/reklam3.jpg'
  ];

  // ✅ MUHIM - MAHSULOTLARNI YUKLASH!
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('📷 Banners:', banners);
    console.log('Current banner:', currentBanner);
  }, [currentBanner]);
    
  // AUTO-SLIDE BANNER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching data...');
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      
      console.log('✅ Products:', productsResponse.data);
      console.log('✅ Categories:', categoriesResponse.data);
      
      const productsData = productsResponse.data.data || [];
      setAllProducts(productsData);
      setProducts(productsData);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category?.id === categoryId);
      setProducts(filtered);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${searchQuery}`);
    }
  };

  const getCategoryImage = (categoryName) => {
    const images = {
      "meva": "https://cdn-icons-png.flaticon.com/512/3194/3194766.png",
      "sabzavot": "https://cdn-icons-png.flaticon.com/512/2329/2329903.png",
      "urug": "https://cdn-icons-png.flaticon.com/512/1042/1042462.png",
      "chorva": "https://cdn-icons-png.flaticon.com/512/2395/2395796.png",
      "texnika": "https://cdn-icons-png.flaticon.com/512/2111/2111113.png",
      "yem": "https://cdn-icons-png.flaticon.com/512/4243/4243681.png",
      "gullar": "https://cdn-icons-png.flaticon.com/512/869/869811.png",
    };
    const name = categoryName.toLowerCase();
    if (name.includes("urug")) return images["urug"];
    if (name.includes("yem")) return images["yem"];
    if (name.includes("gul")) return images["gullar"];
    return images[name] || "https://cdn-icons-png.flaticon.com/512/3081/3081840.png";
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

      {/* Transition Section */}
      <div className="h-44 bg-gradient-to-b from-primary-800 to-white relative">
        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 absolute inset-0 -top-10 z-10">
          <div className="flex flex-nowrap justify-center items-start gap-4 md:gap-6 py-2 overflow-x-visible">
            {/* BARCHASI */}
            <button onClick={() => handleCategoryClick(null)} className="flex flex-col items-center flex-shrink-0 group">
              <div className={`w-32 h-32 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl p-4 ${
                selectedCategory === null ? 'bg-primary-800 scale-105 ring-8 ring-white' : 'bg-white hover:bg-gray-50'
              }`}>
                <img src="https://cdn-icons-png.flaticon.com/512/3081/3081840.png" alt="all" className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2" />
                <span className={`text-[10px] md:text-[11px] font-black tracking-tighter text-center leading-none ${selectedCategory === null ? 'text-white' : 'text-gray-500'}`}>BARCHASI</span>
              </div>
            </button>
            
            {categories.map((category) => (
              <button key={category.id} onClick={() => handleCategoryClick(category.id)} className="flex flex-col items-center flex-shrink-0 group">
                <div className={`w-32 h-32 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl p-4 ${
                  selectedCategory === category.id ? 'bg-primary-800 scale-105 ring-8 ring-white' : 'bg-white hover:bg-gray-50'
                }`}>
                  <img src={getCategoryImage(category.name)} alt={category.name} className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2" />
                  <span className={`text-[10px] md:text-[11px] font-black tracking-tighter text-center leading-none uppercase ${selectedCategory === category.id ? 'text-white' : 'text-gray-500'}`}>
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* BANNER CAROUSEL */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
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
          
          {/* Navigation Arrows */}
          <button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Dots Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBanner ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;