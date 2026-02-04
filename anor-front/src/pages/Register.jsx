import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const regions = [
    'Toshkent', 'Toshkent city', 'Andijon', "Farg'ona", 'Namangan',
    'Sirdaryo', 'Jizzax', 'Samarqand', 'Buxoro', 'Navoiy',
    'Qashqadaryo', 'Surxondaryo', 'Xorazm', "Qoraqalpog'iston",
  ];
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Parollar mos kelmaydi!');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        location: formData.location || null,
      });
      
      const loginFormData = new URLSearchParams();
      loginFormData.append('username', formData.email);
      loginFormData.append('password', formData.password);
      
      const loginResponse = await api.post('/auth/login', loginFormData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      
      localStorage.setItem('token', loginResponse.data.access_token);
      localStorage.setItem('userName', formData.name);
      
      navigate('/');
      window.location.reload();
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Ro\'yxatdan o\'tishda xato!');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-accent-light flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center">
              <span className="text-3xl">🍎</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-primary-800">ANOR</h1>
              <p className="text-xs text-gray-600 tracking-widest">MARKET</p>
            </div>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Ro'yxatdan o'tish</h2>
          <p className="text-gray-600">Yangi hisob yarating</p>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To'liq ism *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                placeholder="Ism Familiya"
              />
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                placeholder="email@example.com"
              />
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
                placeholder="+998 90 123 45 67"
              />
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Viloyat
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
              >
                <option value="">Tanlang</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Parol *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                placeholder="••••••••"
              />
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Parolni tasdiqlang *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                placeholder="••••••••"
              />
            </div>
            
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-800 text-white py-3.5 rounded-full font-semibold hover:bg-primary-900 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Ro\'yxatdan o\'tish...' : 'Ro\'yxatdan o\'tish'}
            </button>
          </form>
          
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Hisobingiz bormi?{' '}
              <Link to="/login" className="text-primary-800 font-semibold hover:underline">
                Kirish
              </Link>
            </p>
          </div>
        </div>
        
        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-primary-800">
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;