import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const UserProfile = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  
  const regions = [
    'Toshkent', 'Toshkent city', 'Andijon', "Farg'ona", 'Namangan',
    'Sirdaryo', 'Jizzax', 'Samarqand', 'Buxoro', 'Navoiy',
    'Qashqadaryo', 'Surxondaryo', 'Xorazm', "Qoraqalpog'iston",
  ];

  // PAGE LOAD BO'LGANDA
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  // PROFILNI YUKLASH
  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('📥 Fetching profile...');
      
      const response = await api.get('/auth/me');
      console.log('✅ Profile data:', response.data);
      
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        location: response.data.location || ''
      });
      
    } catch (error) {
      console.error('❌ Profile fetch error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // FORM INPUTLARNI O'ZGARTIRISH
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // PROFILNI YANGILASH (SAVE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('💾 Updating profile...');
      
      const response = await api.put('/auth/update', formData);
      console.log('✅ Profile updated:', response.data);
      
      localStorage.setItem('userName', formData.name);
      setUser({ ...user, ...formData });
      setIsEditing(false);
      
      alert('✅ Profil yangilandi!');
      
    } catch (error) {
      console.error('❌ Update error:', error);
      alert('❌ ' + (error.response?.data?.detail || 'Yangilashda xato'));
    }
  };
  
  // AVATAR YUKLASH
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Faqat rasm fayllari
    if (!file.type.startsWith('image/')) {
      alert('❌ Faqat rasm yuklash mumkin!');
      return;
    }
    
    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Rasm hajmi 5MB dan katta bo\'lmasligi kerak!');
      return;
    }
    
    try {
      setUploading(true);
      console.log('📤 Uploading avatar...');
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post(`/auth/${user.id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('✅ Avatar uploaded:', response.data);
      alert('✅ Avatar yangilandi!');
      
      // Profilni yangilash
      await fetchProfile();
      
    } catch (error) {
      console.error('❌ Avatar upload error:', error);
      console.error('Error details:', error.response?.data);
      alert('❌ ' + (error.response?.data?.detail || 'Avatar yuklanmadi!'));
    } finally {
      setUploading(false);
    }
  };
  
  // AVATARNI O'CHIRISH
  const handleAvatarDelete = async () => {
    if (!user.avatar || !user.avatar.id) {
      alert('❌ Avatar yo\'q!');
      return;
    }
    
    if (!window.confirm('Avatarni o\'chirmoqchimisiz?')) {
      return;
    }
    
    try {
      console.log('🗑️ Deleting avatar ID:', user.avatar.id);
      
      await api.delete(`/avatar/${user.avatar.id}`);
      
      console.log('✅ Avatar deleted');
      alert('✅ Avatar o\'chirildi!');
      
      // Profilni yangilash
      await fetchProfile();
      
    } catch (error) {
      console.error('❌ Delete error:', error);
      console.error('Error details:', error.response?.data);
      alert('❌ ' + (error.response?.data?.detail || 'O\'chirishda xato'));
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-accent-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-800 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // USER YO'Q
  if (!user) {
    return (
      <div className="min-h-screen bg-accent-light flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Foydalanuvchi topilmadi
          </h3>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition mt-4"
          >
            Qayta kirish
          </button>
        </div>
      </div>
    );
  }
  
  // AVATAR URL
  const avatarUrl = user.avatar?.image_url 
    ? `http://localhost:8000${user.avatar.image_url}` 
    : null;

  return (
    <div className="min-h-screen bg-accent-light py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* HEADER CARD - AVATAR BILAN */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* AVATAR SECTION */}
            <div className="relative group flex-shrink-0">
              <div className="relative">
                {/* Avatar Image yoki Harf */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=8B1538&color=fff&bold=true`;
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-primary-800 text-5xl font-bold shadow-2xl border-4 border-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Online Indicator - TELEGRAM STYLE */}
                <div className="absolute bottom-2 right-2">
                  <div className="relative">
                    <div className="w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                
                {/* Upload Button Overlay - HOVER */}
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className="text-white text-center">
                      {uploading ? (
                        <div className="animate-spin w-10 h-10 border-3 border-white border-t-transparent rounded-full mx-auto"></div>
                      ) : (
                        <>
                          <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-sm font-bold">
                            {avatarUrl ? 'O\'zgartirish' : 'Yuklash'}
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Delete Avatar Button */}
              {avatarUrl && (
                <button
                  onClick={handleAvatarDelete}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg whitespace-nowrap"
                >
                  O'chirish
                </button>
              )}
            </div>
            
            {/* USER INFO */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-3">{user.name}</h1>
              <div className="space-y-2">
                <p className="text-white/90 flex items-center justify-center md:justify-start">
                  <span className="mr-2">📧</span>
                  {user.email}
                </p>
                <p className="text-white/90 flex items-center justify-center md:justify-start">
                  <span className="mr-2">📱</span>
                  {user.phone}
                </p>
                {user.location && (
                  <p className="text-white/90 flex items-center justify-center md:justify-start">
                    <span className="mr-2">📍</span>
                    {user.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE FORM CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profil ma'lumotlari</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary-800 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-900 transition shadow-md hover:shadow-lg"
              >
                Tahrirlash
              </button>
            )}
          </div>

          {isEditing ? (
            // EDIT MODE - FORM
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ism *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                  placeholder="Ismingiz"
                />
              </div>

              {/* Email - DISABLED */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ Email o'zgartirib bo'lmaydi
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                  placeholder="+998901234567"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Joylashuv
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
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

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      phone: user.phone || '',
                      location: user.location || ''
                    });
                  }}
                  className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-800 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-900 transition shadow-lg"
                >
                  Saqlash
                </button>
              </div>
            </form>
          ) : (
            // VIEW MODE - READ ONLY
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Ism</p>
                  <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Email</p>
                  <p className="font-bold text-gray-800 text-lg truncate">{user.email}</p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Telefon</p>
                  <p className="font-bold text-gray-800 text-lg">{user.phone}</p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Joylashuv</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {user.location || (
                      <span className="text-gray-400 text-base font-normal">Belgilanmagan</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

