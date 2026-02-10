import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
    
    fetchData();
  }, [navigate]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [userResponse, productsResponse] = await Promise.all([
        api.get('/auth/me'),
        api.get('/products/my')
      ]);
      
      setUser(userResponse.data);
      setProducts(productsResponse.data);
      
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
    if (!window.confirm('Bu mahsulotni o\'chirishni xohlaysizmi?')) {
      return;
    }
    
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      alert('Mahsulot o\'chirildi!');
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
  
  // Bu funksiya ishlatilmaydi endi
  const handleSaveEdit = () => {
    // Sahifa avtomatik reload bo'ladi
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
  
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  
  return (
    <div className="min-h-screen bg-accent-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* User Info */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-primary-800 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600">{user?.phone}</p>
              {user?.location && (
                <p className="text-gray-600">📍 {user.location}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="text-4xl mb-2">📦</div>
            <div className="text-3xl font-bold text-gray-800">{totalProducts}</div>
            <div className="text-gray-600">Jami mahsulotlar</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">{availableProducts}</div>
            <div className="text-gray-600">Stokda mavjud</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="text-4xl mb-2">❌</div>
            <div className="text-3xl font-bold text-red-600">{outOfStock}</div>
            <div className="text-gray-600">Tugagan</div>
          </div>
        </div>
        
        {/* Products */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Mening mahsulotlarim</h2>
            <Link
              to="/add-product"
              className="bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition"
            >
              + Yangi mahsulot
            </Link>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Hali mahsulotlar yo'q
              </h3>
              <p className="text-gray-600 mb-6">Birinchi mahsulotingizni qo'shing!</p>
              <Link
                to="/add-product"
                className="inline-block bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition"
              >
                Mahsulot qo'shish
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
                          src={`https://anor-e-commerce.onrender.com${product.images[0].image_url.startsWith('/') ? '' : '/'}${product.images[0].image_url}`}
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
                      <div className="flex items-center space-x-3">
                        <p className="text-sm text-gray-600">
                          Stok: <span className="font-semibold">{product.stock}</span> ta
                        </p>
                        {product.stock > 0 ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            ✓ Mavjud
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                            ✗ Tugagan
                          </span>
                        )}
                      </div>
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
        />
      )}
    </div>
  );
};

// EDIT MODAL COMPONENT - ODDIY VA ISHLAYDIGAN!
const EditProductModal = ({ product, onClose }) => {
  const regions = [
    'Toshkent', 'Toshkent city', 'Andijon', "Farg'ona", 'Namangan',
    'Sirdaryo', 'Jizzax', 'Samarqand', 'Buxoro', 'Navoiy',
    'Qashqadaryo', 'Surxondaryo', 'Xorazm', "Qoraqalpog'iston",
  ];
  
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price !== undefined ? String(product.price) : '0',
    stock: product?.stock !== undefined ? String(product.stock) : '0',
    location: product?.location || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const priceValue = parseInt(formData.price);
      const stockValue = parseInt(formData.stock);
      
      if (isNaN(priceValue) || priceValue < 0) {
        setError('Narx noto\'g\'ri!');
        setLoading(false);
        return;
      }
      
      if (isNaN(stockValue) || stockValue < 0) {
        setError('Stok noto\'g\'ri!');
        setLoading(false);
        return;
      }
      
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: priceValue,
        stock: stockValue,
        location: formData.location,
      };
      
      await api.patch(`/products/${product.id}`, updateData);
      
      alert('✅ Mahsulot yangilandi!');
      
      // ODDIY YECHIM: Sahifani reload qil
      window.location.reload();
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.detail || 'Tahrirlashda xato!');
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in">
        <div className="sticky top-0 bg-primary-800 text-white p-6 rounded-t-3xl z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Mahsulotni tahrirlash</h2>
              <p className="text-primary-100 text-sm mt-1">{product?.title || 'Mahsulot'}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mahsulot nomi *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                placeholder="Mahsulot nomi"
              />
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tavsif *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition resize-none"
                placeholder="Mahsulot haqida batafsil..."
              />
            </div>
            
            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Narx (so'm) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                  placeholder="5000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stok (dona) *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                  placeholder="100"
                />
                <p className="text-xs text-gray-500 mt-2 flex items-start space-x-1">
                  <span>💡</span>
                  <span>Stok = Omborda qancha mahsulot bor</span>
                </p>
              </div>
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Joylashuv *
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
              >
                <option value="">Tanlang</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Category note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                <strong>ℹ️ Eslatma:</strong> Kategoriyani o'zgartirish mumkin emas. 
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Hozirgi kategoriya: <strong>{product?.category?.name || 'N/A'}</strong>
              </p>
            </div>
            
            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-800 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saqlanmoqda...</span>
                  </span>
                ) : (
                  '✓ Saqlash'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;