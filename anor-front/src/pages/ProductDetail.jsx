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
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error('❌ Error loading product:', err);
      setError(err.response?.data?.detail || "E'lon topilmadi");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSimilarProducts = async () => {
    try {
      setSimilarLoading(true);
      const response = await api.get(`/products/${id}/similar`);
      console.log("✅ Kelgan ma'lumotlar:", response.data);
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

  const images = product.images && product.images.length > 0
    ? product.images.map(img => `https://anor-e-commerce.onrender.com/${img.image_url.replace(/^\/+/, '')}`)
    : ['https://via.placeholder.com/600x600?text=Rasm+yo\'q'];
  
  const seller = product.seller || product.user || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
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
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 mb-16">
          {/* Images Section */}
          <div className="space-y-4">
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
                
                <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>
            </div>

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

          {/* Product Info */}
          <div className="space-y-4">
            {product.category && (
              <div className="inline-flex items-center bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-xs font-semibold">
                {product.category.name}
              </div>
            )}

            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 font-medium mb-1">NARXI</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-gray-900">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-lg text-gray-600 ml-2 font-semibold">so'm</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <span className="text-xl mr-3">📍</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Joylashuv</p>
                  <p className="text-lg font-bold text-gray-900">{product.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">📝</span>
                Tavsif
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {seller && (
              <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👤</span>
                  Sotuvchi
                </h3>

                <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                  <div className="flex items-center mb-4">
                    <div className="relative mr-4 flex-shrink-0">
                      {seller.avatar?.image_url ? (
                        <img
                          src={`https://anor-e-commerce.onrender.com/${seller.avatar.image_url.replace(/^\/+/, '')}`}
                          alt={seller.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}&size=56&background=3B82F6&color=fff&bold=true`;
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white">
                          {seller.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">
                        {seller.name || 'Foydalanuvchi'}
                      </h4>
                      <p className="text-xs text-green-600 font-semibold">Onlayn</p>
                      {seller.location && (
                        <p className="text-xs text-gray-500 mt-0.5">📍 {seller.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {seller.phone && (
                      <a 
                        href={`tel:${seller.phone}`}
                        className="flex items-center justify-between bg-green-50 hover:bg-green-100 rounded-xl px-4 py-3 transition-all group border border-green-200"
                      >
                        <div className="flex items-center flex-1">
                          <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
                            📱
                          </div>
                          <div className="ml-3">
                            <p className="text-[10px] text-gray-500 font-semibold uppercase">Telefon</p>
                            <p className="text-sm font-bold text-green-700">
                              {seller.phone}
                            </p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-green-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}

                    {seller.email && (
                      <a 
                        href={`mailto:${seller.email}`}
                        className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 rounded-xl px-4 py-3 transition-all group border border-blue-200"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
                            📧
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <p className="text-[10px] text-gray-500 font-semibold uppercase">Email</p>
                            <p className="text-sm font-bold text-blue-700 truncate">
                              {seller.email}
                            </p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-blue-600 transform group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {seller && seller.phone && (
              <a 
                href={`tel:${seller.phone}`}
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span className="text-xl">📞</span>
                  <span>Sotuvchiga qo'ng'iroq qilish</span>
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="relative">
          <div className="flex items-center justify-center mb-12">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="mx-6 bg-primary-700 text-white p-3 rounded-xl shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              O'xshash e'lonlar
            </h2>
          </div>

          {similarLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-800 border-t-transparent"></div>
            </div>
          ) : similarProducts.length > 0 ? (
            <>
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

              <div className="text-center mt-12">
                <button
                  onClick={() => navigate(`/?category=${product.category?.id || ''}`)}
                  className="inline-flex items-center space-x-3 bg-white text-primary-800 border-2 border-primary-800 px-8 py-3 rounded-full font-bold hover:bg-primary-800 hover:text-white transition-all shadow-md hover:shadow-lg group"
                >
                  <span>Barcha e'lonlarni ko'rish</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">O'xshash e'lonlar topilmadi</h3>
              <p className="text-gray-600 mb-6">
                Bu kategoriyada boshqa e'lonlar yo'q
              </p>
              <button
                onClick={() => navigate(`/?category=${product.category?.id || ''}`)}
                className="inline-flex items-center space-x-3 bg-primary-800 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-900 transition-all shadow-md hover:shadow-lg group"
              >
                <span>Barcha e'lonlarni ko'rish</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;