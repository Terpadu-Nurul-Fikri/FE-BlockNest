import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

// Import Ikon
import { FaSearch, FaShoppingCart, FaBars, FaStar, FaRegHeart } from 'react-icons/fa';
import { FiUser, FiArrowRight, FiFilter } from 'react-icons/fi';

export default function AdvancedMinimalistUI() {
  const [activeTab, setActiveTab] = useState('Semua');

  // Data Kategori Tab
  const categories = ['Semua', 'Furnitur', 'Lampu', 'Dekorasi', 'Dapur', 'Kerja'];

  // Data Dummy Produk yang Lebih Lengkap
  const products = [
    { id: 1, name: 'Lounge Chair Wood', price: 'Rp 1.250.000', rating: 4.8, sold: '1.2k', img: 'https://placehold.co/500x600/f3f4f6/333333?text=Chair' },
    { id: 2, name: 'Nordic Table Lamp', price: 'Rp 320.000', rating: 4.9, sold: '850', img: 'https://placehold.co/500x600/f3f4f6/333333?text=Lamp' },
    { id: 3, name: 'Ceramic Vase Set', price: 'Rp 150.000', rating: 4.7, sold: '430', img: 'https://placehold.co/500x600/f3f4f6/333333?text=Vase' },
    { id: 4, name: 'Oak Wall Shelf', price: 'Rp 400.000', rating: 4.5, sold: '210', img: 'https://placehold.co/500x600/f3f4f6/333333?text=Shelf' },
    { id: 5, name: 'Minimalist Desk', price: 'Rp 1.800.000', rating: 5.0, sold: '90', img: 'https://placehold.co/500x600/f3f4f6/333333?text=Desk' },
    { id: 6, name: 'Cotton Throw Blanket', price: 'Rp 250.000', rating: 4.6, sold: '560', img: 'https://placehold.co/500x600/f3f4f6/333333?text=Blanket' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* --- 1. NAVBAR (Backdrop Blur & Ultra Minimal) --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <FaBars className="text-lg cursor-pointer text-gray-900 hover:opacity-70 transition" />
          <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase">Minima.</h1>
        </div>
        
        {/* Search Desktop */}
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 w-2/5 focus-within:border-black transition-colors">
          <FaSearch className="text-gray-400 text-sm" />
          <input 
            type="text" 
            placeholder="Ketik untuk mencari..." 
            className="bg-transparent border-none outline-none ml-3 w-full text-sm placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-5">
          <FiUser className="text-xl cursor-pointer hover:opacity-70 transition hidden md:block" />
          <FaRegHeart className="text-xl cursor-pointer hover:opacity-70 transition hidden md:block" />
          <div className="relative cursor-pointer group">
            <FaShoppingCart className="text-xl group-hover:opacity-70 transition" />
            <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-6 px-4 md:px-8 space-y-12 pb-20">
        
        {/* --- 2. HERO CAROUSEL (Full Bleed Image Style) --- */}
        <section className="rounded-2xl overflow-hidden bg-gray-50">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="w-full h-[300px] md:h-[450px]"
          >
            <SwiperSlide>
              <div className="relative w-full h-full bg-[#E5E5E5] flex flex-col justify-center px-8 md:px-16">
                <p className="text-sm font-semibold tracking-widest text-gray-500 mb-2 uppercase">Koleksi Baru</p>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 w-3/4 md:w-1/2 leading-tight">Estetika Skandinavia.</h2>
                <button className="bg-black text-white px-6 py-3 rounded-full w-max text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2">
                  Belanja Sekarang <FiArrowRight />
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full bg-[#F3EBE3] flex flex-col justify-center px-8 md:px-16">
                <p className="text-sm font-semibold tracking-widest text-gray-500 mb-2 uppercase">Diskon Terbatas</p>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 w-3/4 md:w-1/2 leading-tight">Potongan 50% Furnitur.</h2>
                <button className="bg-black text-white px-6 py-3 rounded-full w-max text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2">
                  Lihat Promo <FiArrowRight />
                </button>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* --- 3. KATEGORI TABS (Scrollable Pills) --- */}
        <section className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide w-full">
            <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition">
              <FiFilter /> Filter
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2 flex-shrink-0"></div>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeTab === cat 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* --- 4. FLASH SALE ROW --- */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-bold">Penawaran Kilat</h3>
              <p className="text-gray-500 text-sm mt-1">Berakhir dalam <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">03:45:12</span></p>
            </div>
            <a href="#" className="text-sm font-medium border-b border-black pb-0.5 hover:opacity-70">Lihat Semua</a>
          </div>
          
          <Swiper
            modules={[FreeMode]}
            freeMode={true}
            slidesPerView={2.2}
            spaceBetween={16}
            breakpoints={{
              768: { slidesPerView: 3.5, spaceBetween: 24 },
              1024: { slidesPerView: 4.5, spaceBetween: 24 },
            }}
            className="w-full"
          >
             {products.slice(0, 4).map((product) => (
              <SwiperSlide key={`flash-${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-3">
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">-20%</span>
                    <img src={product.img} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-bold text-red-500">{product.price}</p>
                    <p className="text-xs text-gray-400 line-through">Rp 2.000.000</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* --- 5. MAIN PRODUCT GRID (Complex Hover & Details) --- */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Pilihan Untukmu</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                {/* Image Container with Hover Action */}
                <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-4">
                  <button className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                    <FaRegHeart />
                  </button>
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Add to Cart Overlay (Muncul dari bawah) */}
                  <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-black/90 backdrop-blur-sm text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black flex items-center justify-center gap-2">
                      <FaShoppingCart /> Tambah
                    </button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 leading-tight mb-1 group-hover:underline decoration-1 underline-offset-2">{product.name}</h4>
                    <p className="text-gray-900 font-semibold">{product.price}</p>
                  </div>
                </div>
                {/* Rating & Sold */}
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <FaStar className="text-yellow-400 text-[10px]" />
                  <span className="font-medium text-gray-700">{product.rating}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span>
                  <span>Terjual {product.sold}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* --- 6. SIMPLE FOOTER --- */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase">Minima.</h1>
          <p className="text-sm text-gray-500">© 2026 Minima Store. Desain Minimalis, Hidup Maksimal.</p>
        </div>
      </footer>
    </div>
  );
}