const Hero = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left - Anor Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center animate-float">
                <span className="text-9xl">🍎</span>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-100 rounded-full opacity-50 animate-float" style={{animationDelay: '1s'}}></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary-200 rounded-full opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
          
          {/* Right - Text */}
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              O'zbekistonning #1 agrar bozori
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Yangi, sifatli va arzon mahsulotlar. To'g'ridan-to'g'ri dehqonlardan!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;