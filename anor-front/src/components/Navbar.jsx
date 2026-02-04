import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    checkAuth();
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    setIsLoggedIn(!!token);
    setUserName(name || 'User');
  };
  
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await api.get('/auth/me');
      setUserName(response.data.name);
      
      // Avatar URL
      if (response.data.avatar?.image_url) {
        setUserAvatar(`http://localhost:8000${response.data.avatar.image_url}`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    setUserAvatar(null);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="bg-primary-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">🍎</span>
            </div>
            <div>
              <span className="text-white text-xl font-black tracking-tight">ANOR</span>
              <span className="block text-white/70 text-xs font-medium -mt-1">MARKET</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition font-medium"
            >
              Bosh sahifa
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition group"
                >
                  {/* Avatar with Online Indicator */}
                  <div className="relative">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=32&background=fff&color=8B1538&bold=true`;
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-800 font-bold text-sm border-2 border-white">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Online Indicator - Small */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-primary-800"></div>
                  </div>
                  
                  <span className="text-white font-medium hidden sm:block">{userName}</span>
                  
                  <svg 
                    className={`w-4 h-4 text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-2 animate-fade-in border border-gray-100">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt={userName}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=48&background=8B1538&color=fff&bold=true`;
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-lg">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          
                          {/* Online Indicator */}
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{userName}</p>
                          <p className="text-xs text-green-600 font-medium">● Onlayn</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition"
                    >
                      <span className="text-xl">👤</span>
                      <div>
                        <p className="font-medium text-gray-800">Mening profilim</p>
                        <p className="text-xs text-gray-500">Shaxsiy ma'lumotlar</p>
                      </div>
                    </Link>

                    <Link
                      to="/my-products"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition"
                    >
                      <span className="text-xl">📦</span>
                      <div>
                        <p className="font-medium text-gray-800">Mening e'lonlarim</p>
                        <p className="text-xs text-gray-500">E'lonlarni boshqarish</p>
                      </div>
                    </Link>
                    
                    <Link
                      to="/favorites"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition"
                    >
                      <span className="text-xl">💚</span>
                      <div>
                        <p className="font-medium text-gray-800">Saralangan</p>
                        <p className="text-xs text-gray-500">Yoqqan e'lonlar</p>
                      </div>
                    </Link>

                    <Link
                      to="/add-product"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition"
                    >
                      <span className="text-xl">➕</span>
                      <div>
                        <p className="font-medium text-gray-800">E'lon qo'shish</p>
                        <p className="text-xs text-gray-500">Yangi e'lon yaratish</p>
                      </div>
                    </Link>

                    <div className="border-t border-gray-100 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition text-red-600"
                    >
                      <span className="text-xl">🚪</span>
                      <div className="text-left">
                        <p className="font-medium">Chiqish</p>
                        <p className="text-xs text-red-500">Hisobdan chiqish</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-xl transition font-medium"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-800 hover:bg-gray-100 px-4 py-2 rounded-xl transition font-semibold"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

