import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    loadFavorites();
  }, []);
  
  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };
  
  return (
    <div className="min-h-screen bg-accent-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Saralangan</h1>
          <p className="text-gray-600">Sizga yoqqan e'lonlar</p>
        </div>
        
        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">💚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Hali saralangan e'lonlar yo'q
            </h3>
            <p className="text-gray-600 mb-6">
              Mahsulot cardlaridagi yurak tugmasini bosing
            </p>
            <Link
              to="/"
              className="inline-block bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition"
            >
              E'lonlarni ko'rish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;