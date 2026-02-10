import { useState, useEffect } from 'react';
import api from '../api/axios';

const EditProductModal = ({ product, onClose, onSave }) => {
  const regions = [
    'Toshkent', 'Toshkent city', 'Andijon', "Farg'ona", 'Namangan',
    'Sirdaryo', 'Jizzax', 'Samarqand', 'Buxoro', 'Navoiy',
    'Qashqadaryo', 'Surxondaryo', 'Xorazm', "Qoraqalpog'iston",
  ];

  // Modal ochilganda asosiy sahifa scroll bo'lmasligi uchun
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price !== undefined ? String(product.price) : '0',
    location: product?.location || '',
  });

  const [images, setImages] = useState(product?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Rasmni o'chirish funksiyasi (Toliq saqlandi)
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Bu rasmni o'chirishni xohlaysizmi?")) {
      return;
    }
    
    try {
      await api.delete(`/images/${imageId}`);
      setImages(images.filter(img => img.id !== imageId));
      alert("✅ Rasm o'chirildi!");
    } catch (err) {
      alert("❌ Rasmni o'chirishda xato: " + (err.response?.data?.detail || 'Xato'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const priceValue = parseInt(formData.price);
      
      if (isNaN(priceValue) || priceValue < 0) {
        setError("Narx noto'g'ri!");
        setLoading(false);
        return;
      }
      
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: priceValue,
        location: formData.location,
      };
      
      await api.patch(`/products/${product.id}`, updateData);
      
      alert("✅ E'lon yangilandi!");
      onSave();
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.detail || 'Tahrirlashda xato!');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in">
      {/* MODAL KONTEYNERI - OCH KO'K RAMKA */}
      <div className="bg-[#f0f9ff] border-4 border-blue-200 rounded-[40px] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        
        {/* HEADER - KO'K RANGDA */}
        <div className="bg-blue-600 text-white p-7 flex justify-between items-center shadow-lg relative">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">E'lonni tahrirlash</h2>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">
              Mahsulotni tahrirlash rejimi
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-white/10"
          >
            <span className="text-2xl font-light">✕</span>
          </button>
        </div>

        {/* FORM QISMI - SCROLLBARSiz */}
        <div className="p-8 overflow-y-auto no-scrollbar space-y-6 flex-1">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-4 mb-6 animate-shake">
              <p className="text-red-700 text-sm font-bold">❌ {error}</p>
            </div>
          )}

          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-blue-400 tracking-widest ml-1 italic">E'lon nomi *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-white border-2 border-blue-50 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-gray-800 shadow-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-blue-400 tracking-widest ml-1 italic">Tavsif *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-5 py-4 bg-white border-2 border-blue-50 rounded-2xl focus:border-blue-500 outline-none transition-all font-medium text-gray-700 resize-none shadow-sm"
              />
            </div>

            {/* Price & Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-blue-400 tracking-widest ml-1 italic">Narx (so'm) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white border-2 border-blue-50 rounded-2xl focus:border-blue-500 outline-none transition-all font-black text-blue-600 text-xl shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-blue-400 tracking-widest ml-1 italic">Joylashuv *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white border-2 border-blue-50 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-gray-800 shadow-sm appearance-none"
                >
                  <option value="">Tanlang</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images Grid */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-blue-400 tracking-widest ml-1 italic">Mavjud rasmlar ({images.length} ta)</label>
              
              {images.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative aspect-square group">
                      <img
                        src={`https://anor-e-commerce.onrender.com/${image.image_url}`}
                        alt="Product"
                        className="w-full h-full object-cover rounded-2xl border-2 border-white shadow-md group-hover:border-blue-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 active:scale-90"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center">
                  <p className="text-blue-300 font-bold italic">Rasmlar mavjud emas</p>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="bg-blue-100/50 rounded-2xl p-4 border border-blue-200">
              <p className="text-blue-700 text-xs font-bold italic">
                ℹ️ Kategoriyani o'zgartirish uchun e'lonni o'chirib qaytadan joylang.
              </p>
            </div>
          </form>
        </div>

        {/* FOOTER - BEKOR QILISH VA YASHIL TUGMA */}
        <div className="p-6 bg-white border-t-2 border-blue-50 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-black uppercase italic text-gray-400 hover:bg-gray-50 transition-all tracking-widest text-sm"
          >
            Bekor qilish
          </button>
          <button
            form="edit-form"
            type="submit"
            disabled={loading}
            className="flex-[1.5] bg-[#10b981] text-white py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-[#059669] shadow-xl shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saqlanmoqda...
              </span>
            ) : (
              "✓ Saqlash"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;