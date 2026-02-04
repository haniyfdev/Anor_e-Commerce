import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false); // YANGI!
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
      
      const loginFormData = new URLSearchParams();
      loginFormData.append('username', formData.email);
      loginFormData.append('password', formData.password);
      
      const response = await api.post('/auth/login', loginFormData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      
      localStorage.setItem('token', response.data.access_token);
      
      const userResponse = await api.get('/auth/me');
      localStorage.setItem('userName', userResponse.data.name);
      
      navigate('/');
      window.location.reload();
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Login xato!');
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
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Xush kelibsiz!</h2>
          <p className="text-gray-600">Hisobingizga kiring</p>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email manzil
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
            
            {/* Password - YANGILANGAN! */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-800 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-800 text-white py-3.5 rounded-full font-semibold hover:bg-primary-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kirish...' : 'Kirish'}
            </button>
          </form>
          
          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Hisobingiz yo'qmi?{' '}
              <Link to="/register" className="text-primary-800 font-semibold hover:underline">
                Ro'yxatdan o'ting
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

export default Login;