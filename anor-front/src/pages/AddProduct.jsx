import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    location: '',
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const regions = [
    'Toshkent', 'Toshkent city', 'Andijon', "Farg'ona", 'Namangan',
    'Sirdaryo', 'Jizzax', 'Samarqand', 'Buxoro', 'Navoiy',
    'Qashqadaryo', 'Surxondaryo', 'Xorazm', "Qoraqalpog'iston",
  ];
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchCategories();
  }, [navigate]);
  
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category_id') {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert('Maksimal 5ta rasm yuklash mumkin!');
      return;
    }
    
    setImages([...images, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // STOCK BUTUNLAY O'CHIRILGAN!
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        category_id: formData.category_id,
        location: formData.location,
      };
      
      console.log('📤 Sending:', productData);
      
      const response = await api.post('/products/', productData);
      console.log('✅ Response:', response.data);
      
      const productId = response.data.id;
      
      // Upload images
      if (images.length > 0) {
        for (const image of images) {
          const imageFormData = new FormData();
          imageFormData.append('photo', image);
          
          await api.post(`/images/${productId}`, imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
      }
      
      alert('✅ E\'lon qo\'shildi!');
      navigate('/my-products/');
      
    } catch (err) {
      console.error('❌ Error:', err);
      console.error('Error response:', err.response);
      
      let errorMessage = 'E\'lon qo\'shishda xato!';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        
        if (Array.isArray(detail)) {
          errorMessage = detail.map(e => `${e.loc?.join('.')}: ${e.msg}`).join('\n');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-accent-light py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Yangi e'lon qo'shish</h1>
          <p className="text-gray-600">Barcha maydonlarni to'ldiring</p>
        </div>
        
        {/* Form */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E'lon nomi *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                placeholder="Masalan: Yangi traktor"
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
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition resize-none"
                placeholder="Mahsulot haqida batafsil ma'lumot... Agar miqdor muhim bo'lsa, bu yerda yozing (masalan: 100 kg, 50 metr)"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-start space-x-1">
                <span>💡</span>
                <span>Agar miqdor/hajm muhim bo'lsa, tavsifda yozing (masalan: "100 kg olma sotiladi")</span>
              </p>
            </div>
            
            {/* Price */}
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
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                placeholder="50000"
              />
            </div>
            
            {/* Category & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategoriya *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                >
                  <option value="">Tanlang</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
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
            </div>
            
            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rasmlar (Maksimal 5ta)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-800 transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-6xl mb-3">📷</div>
                  <p className="text-gray-700 font-medium mb-1">Rasm yuklash</p>
                  <p className="text-sm text-gray-500">PNG, JPG (max. 5MB)</p>
                </label>
              </div>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-800 text-white py-3.5 rounded-full font-semibold hover:bg-primary-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'E\'lon qo\'shilmoqda...' : 'E\'lon qo\'shish'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;