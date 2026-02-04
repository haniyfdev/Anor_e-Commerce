import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    checkFavorite();
  }, [product.id]);
  
  const checkFavorite = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      const favorites = JSON.parse(saved);
      setIsFavorite(favorites.some(p => p.id === product.id));
    }
  };
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const saved = localStorage.getItem('favorites');
    let favorites = saved ? JSON.parse(saved) : [];
    
    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter(p => p.id !== product.id);
      setIsFavorite(false);
    } else {
      // Add to favorites
      favorites.push(product);
      setIsFavorite(true);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Dispatch event for other components
    window.dispatchEvent(new Event('favoritesChanged'));
  };
  
  const imageUrl = product.images && product.images.length > 0
    ? `http://localhost:8000/${product.images[0].image_url}`
    : 'https://via.placeholder.com/300x200?text=No+Image';
  
  return (
    <div className="product-card bg-white rounded-3xl shadow-md overflow-hidden relative">
      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
      >
        {isFavorite ? (
          <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
      </button>
      
      <Link to={`/product/${product.id}`}>
        {/* Image */}
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-2xl font-bold text-gray-800">
              {product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">so'm</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="mr-1">📍</span>
            <span className="truncate">{product.location}</span>
          </div>
          
          {/* Category */}
          <div className="mt-3">
            <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full truncate max-w-full">
              {product.category?.name || 'Kategoriya'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;