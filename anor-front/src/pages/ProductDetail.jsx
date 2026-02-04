import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);
  
  useEffect(() => {
    if (product) {
      fetchSimilarProducts();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      try {
        response = await api.get(`/view_product/${id}`);
      } catch (viewError) {
        response = await api.get(`/products/${id}`);
      }
      
      setProduct(response.data);
      
    } catch (err) {
      console.error('❌ Error loading product:', err);
      setError(err.response?.data?.detail || 'E\'lon topilmadi');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSimilarProducts = async () => {
    try {
      setSimilarLoading(true);
      const response = await api.get(`/products/${id}/similar`);
      setSimilarProducts(response.data || []);
    } catch (err) {
      console.error('⚠️ Similar products not loaded:', err);
      setSimilarProducts([]);
    } finally {
      setSimilarLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-800 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-light to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center transform hover:scale-105 transition-transform">
          <div className="text-7xl mb-6 animate-bounce">😕</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">E'lon topilmadi</h3>
          <p className="text-gray-600 mb-8">Kechirasiz, bu e'lon mavjud emas</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-900 transition shadow-lg hover:shadow-xl"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  // Syntax tuzatildi: lstrip('/') o'rniga replace(/^\/+/, '') qo'shildi
  const images = product.images && product.images.length > 0
    ? product.images.map(img => `http://localhost:8000/${img.image_url.replace(/^\/+/, '')}`)
    : ['https://via.placeholder.com/600x600?text=Rasm+yo\'q'];
  
  const seller = product.seller || product.user || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button - Enhanced */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 group flex items-center space-x-2 text-primary-800 hover:text-primary-900 font-semibold bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <svg 
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Orqaga</span>
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Images Section - Left Column */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <div className="aspect-square relative group">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=Rasm+yo\'q';
                  }}
                />
                
                {/* Image Counter Badge */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-2xl overflow-hidden border-3 transition-all transform hover:scale-105 ${
                      selectedImage === index
                        ? 'border-primary-800 ring-4 ring-primary-200 scale-105'
                        : 'border-gray-200 hover:border-primary-400'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Rasm ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=No';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right Column */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-primary-50 text-primary-800 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm">
                <span className="mr-2">📦</span>
                {product.category.name}
              </div>
            )}

            {/* Title */}
            <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Price Card - Premium Design */}
            <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 shadow-2xl overflow-hidden group hover:shadow-3xl transition-shadow">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>
              
              <div className="relative">
                <p className="text-white/90 text-sm font-semibold mb-3 uppercase tracking-wider">Narxi</p>
                <div className="flex items-baseline">
                  <span className="text-6xl font-black text-white tracking-tight">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-2xl text-white/90 ml-3 font-bold">so'm</span>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-gray-600 text-sm font-semibold mb-3">Joylashuv</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  📍
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {product.location}
                </p>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-200 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">📝</span>
                Tavsif
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Seller Info Card - PREMIUM WITH AVATAR */}
            {seller && (
              <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-3xl p-8 border-2 border-blue-200 shadow-xl overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
                
                <div className="relative">
                  <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <span className="text-3xl mr-3">👤</span>
                    Sotuvchi
                  </h3>

                  {/* Seller Profile */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <div className="flex items-center mb-6">
                      {/* Avatar with Online Indicator */}
                      <div className="relative mr-5 flex-shrink-0">
                        {seller.avatar?.image_url ? (
                          <img
                            src={`http://localhost:8000/${seller.avatar.image_url.replace(/^\/+/, '')}`}
                            alt={seller.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-blue-100"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}&size=80&background=3B82F6&color=fff&bold=true`;
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-xl border-4 border-white ring-4 ring-blue-100">
                            {seller.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        
                        {/* Online Indicator */}
                        <div className="absolute bottom-1 right-1">
                          <div className="relative">
                            <div className="w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                          </div>
                        </div>
                      </div>

                      {/* Seller Info */}
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-gray-900 mb-1">
                          {seller.name || 'Foydalanuvchi'}
                        </h4>
                        <p className="text-sm text-green-600 font-bold flex items-center mb-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                          Onlayn
                        </p>
                        {seller.location && (
                          <p className="text-gray-600 flex items-center text-sm">
                            <span className="mr-1.5">📍</span>
                            {seller.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="space-y-3">
                      {/* Phone Button */}
                      {seller.phone && (
                        <a 
                          href={`tel:${seller.phone}`}
                          className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl transition-all group border-2 border-green-200 shadow-sm hover:shadow-md"
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                            📱
                          </div>
                          <div className="flex-1 ml-4">
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Telefon</p>
                            <p className="text-lg font-black text-green-700 group-hover:text-green-800 transition">
                              {seller.phone}
                            </p>
                          </div>
                          <svg className="w-6 h-6 text-green-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}

                      {/* Email Button */}
                      {seller.email && (
                        <a 
                          href={`mailto:${seller.email}`}
                          className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl transition-all group border-2 border-blue-200 shadow-sm hover:shadow-md"
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                            📧
                          </div>
                          <div className="flex-1 ml-4 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Email</p>
                            <p className="text-sm font-bold text-blue-700 group-hover:text-blue-800 truncate transition">
                              {seller.email}
                            </p>
                          </div>
                          <svg className="w-6 h-6 text-blue-600 transform group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action Button */}
            {seller && seller.phone && (
              <a 
                href={`tel:${seller.phone}`}
                className="block w-full relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-white text-center py-5 rounded-full font-black text-xl shadow-2xl group-hover:shadow-3xl transition-all">
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-3xl animate-bounce">📞</span>
                    <span>Sotuvchiga qo'ng'iroq qilish</span>
                  </span>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="relative">
            {/* Divider with Icon */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <div className="mx-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white p-4 rounded-2xl shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-gray-900 mb-3">
                O'xshash e'lonlar
              </h2>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-primary-800">{product.location}</span> shahrida, 
                <span className="font-semibold text-primary-800"> {product.category?.name}</span> kategoriyasida
              </p>
            </div>

            {/* Similar Products Grid */}
            {similarLoading ? (
              <div className="flex justify-center py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-800 border-t-transparent"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-primary-400 opacity-20"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <div 
                    key={similarProduct.id} 
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <ProductCard product={similarProduct} />
                  </div>
                ))}
              </div>
            )}

            {/* View More Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => navigate(`/?category=${product.category?.id || ''}`)}
                className="inline-flex items-center space-x-3 bg-white text-primary-800 border-2 border-primary-800 px-8 py-4 rounded-full font-bold hover:bg-primary-800 hover:text-white transition-all shadow-lg hover:shadow-xl group"
              >
                <span>Barcha e'lonlarni ko'rish</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;