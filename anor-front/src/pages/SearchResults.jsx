import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // O'zbekistonning barcha viloyatlari
  const uzbLocations = [
    "Toshkent shahri", "Toshkent viloyati", "Andijon", "Buxoro", 
    "Farg'ona", "Jizzax", "Xorazm", "Namangan", 
    "Navoiy", "Qashqadaryo", "Samarqand", "Sirdaryo", 
    "Surxondaryo", "Qoraqalpog'iston Respublikasi"
  ];

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: '',
    stock: 'all', // all, available, out_of_stock
  });
  
  useEffect(() => {
    fetchProducts();
  }, [searchQuery]); // Faqat qidiruv so'zi o'zgarganda API-ga chiqamiz
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // 1. API dan qidiruv bo'yicha barcha mahsulotlarni olamiz
      const params = new URLSearchParams();
      params.append('search', searchQuery);
      
      const response = await api.get(`/products?${params.toString()}`);
      const allFoundProducts = response.data.data || [];
      
      // 2. FRONTEND FILTRLASH (Eng aniq ishlaydigan usul)
      const filtered = allFoundProducts.filter(product => {
        // Narx bo'yicha tekshirish
        const matchMinPrice = !filters.minPrice || product.price >= Number(filters.minPrice);
        const matchMaxPrice = !filters.maxPrice || product.price <= Number(filters.maxPrice);
        
        // Viloyat bo'yicha tekshirish
        const matchLocation = !filters.location || product.location === filters.location;
        
        // STOCK MUAMMOSI YECHIMI:
        let matchStock = true;
        if (filters.stock === 'available') {
          matchStock = product.stock > 0; // Faqat zaxirada borlar
        } else if (filters.stock === 'out_of_stock') {
          matchStock = product.stock <= 0; // Faqat tugaganlar
        }
        
        return matchMinPrice && matchMaxPrice && matchLocation && matchStock;
      });

      setProducts(filtered);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyFilters = () => {
    fetchProducts();
  };
  
  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      location: '',
      stock: 'all',
    });
    // Tozalagandan keyin darhol hamma mahsulotni ko'rsatish uchun
    fetchProducts(); 
  };
  
  return (
    <div className="min-h-screen bg-accent-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Qidiruv natijalari: "{searchQuery}"
          </h1>
          <p className="text-gray-600">
            {products.length} ta mahsulot topildi
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filtrlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Min Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Minimal narx</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800"
              />
            </div>
            
            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Maksimal narx</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="1000000"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800"
              />
            </div>
            
            {/* Location - TO'LIQ VILOYATLAR */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Joylashuv</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800"
              >
                <option value="">Barchasi</option>
                {uzbLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            {/* Stock - TO'G'RI MANTIQ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stok holati</label>
              <select
                name="stock"
                value={filters.stock}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800"
              >
                <option value="all">Barchasi</option>
                <option value="available">Mavjud</option>
                <option value="out_of_stock">Tugagan</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={applyFilters}
              className="flex-1 bg-primary-800 text-white py-2.5 rounded-xl font-semibold hover:bg-primary-900 transition"
            >
              Filtrlash
            </button>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Tozalash
            </button>
          </div>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-800 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Hech narsa topilmadi</h3>
            <p className="text-gray-600 mb-6">"{searchQuery}" bo'yicha mahsulotlar topilmadi</p>
            <Link to="/" className="inline-block bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition">
              Bosh sahifaga qaytish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={product.id} className="animate-slide-in" style={{animationDelay: `${index * 0.05}s`}}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;