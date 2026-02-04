import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import MyProducts from './pages/MyProducts';
import AddProduct from './pages/AddProduct';
import CategoryProducts from './pages/CategoryProducts';
import Favorites from './pages/Favorites';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults'; 


function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/category/:id" element={<CategoryProducts />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchResults />} /> {/* YANGI! */}
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">404 - Sahifa topilmadi</h1></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;