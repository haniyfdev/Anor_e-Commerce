import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import EditProductModal from '../components/EditProductModal';

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchProducts();
  }, [navigate]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/my');
      setProducts(response.data);
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (productId) => {
    if (!window.confirm('Bu e\'lonni o\'chirishni xohlaysizmi?')) {
      return;
    }
    
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      alert('E\'lon o\'chirildi!');
    } catch (error) {
      alert('Xato: ' + (error.response?.data?.detail || 'O\'chirishda xato'));
    }
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };
  
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };
  
  const handleSaveSuccess = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    window.location.reload();
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
  
  return (
    <div className="min-h-screen bg-accent-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mening e'lonlarim</h1>
          <p className="text-gray-600">Barcha e'lonlaringizni boshqaring</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="text-4xl mb-2">📦</div>
            <div className="text-3xl font-bold text-gray-800">{products.length}</div>
            <div className="text-gray-600">Jami e'lonlar</div>
          </div>
        </div>
        
        {/* Products */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">E'lonlar</h2>
            <Link
              to="/add-product"
              className="bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition"
            >
              + Yangi e'lon
            </Link>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Hali e'lonlar yo'q
              </h3>
              <p className="text-gray-600 mb-6">Birinchi e'loningizni qo'shing!</p>
              <Link
                to="/add-product"
                className="inline-block bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition"
              >
                E'lon qo'shish
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`http://localhost:8000/${product.images[0].image_url}`}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📦
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{product.title}</h3>
                      <p className="text-lg font-bold text-gray-700 mb-1">
                        {product.price.toLocaleString()} so'm
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {product.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition text-sm font-medium"
                    >
                      Ko'rish
                    </Link>
                    
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition text-sm font-medium"
                    >
                      Tahrirlash
                    </button>
                    
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition text-sm font-medium"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default MyProducts;