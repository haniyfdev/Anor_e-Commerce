import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CategoryProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, [id]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [categoryResponse, productsResponse] = await Promise.all([
        api.get(`/categories/${id}`),
        api.get(`/products/?category_id=${id}`)
      ]);
      
      setCategory(categoryResponse.data);
      setProducts(productsResponse.data.data || []);
      setError(null);
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-accent-light flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-800 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-accent-light flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Xato yuz berdi</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-accent-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-primary-800 hover:text-primary-900 font-medium"
          >
            ← Orqaga
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {category?.name}
          </h1>
          <p className="text-gray-600">
            {products.length} ta mahsulot topildi
          </p>
        </div>
        
        {/* Products */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Bu kategoriyada mahsulot yo'q
            </h3>
            <p className="text-gray-600 mb-6">
              Birinchi mahsulotni siz qo'shing!
            </p>
            <button
              onClick={() => navigate('/add-product')}
              className="bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition"
            >
              Mahsulot qo'shish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-in"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;