import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Home = () => {
  // Select top 4 products for featured section
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-brand-bg to-[#F9C8C8] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 z-10"
          >
            <div className="inline-block px-4 py-1 bg-brand-primary/10 rounded-full text-brand-primary font-semibold text-sm mb-2">
              Authentic Tamil Nadu Snacks & Sweets
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-brand-primary leading-tight">
              Relive The Taste of <span className="text-brand-secondary">Tamil Nadu</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-text/80 italic font-medium max-w-lg">
              "Handmade with heritage and heart. Our snacks & sweets are a timeless art!"
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg transform -rotate-2 inline-block text-center w-fit">
                UP TO <span className="text-3xl">50%</span> OFF
              </div>
              <Link to="/menu" className="bg-brand-primary hover:bg-brand-text text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all hover:shadow-xl flex items-center justify-center gap-2 w-fit">
                Place Order <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop"
                alt="Sweets Platter"
                className="rounded-2xl shadow-xl object-cover h-64 w-full transform translate-y-8 hover:-translate-y-2 transition-transform duration-500"
              />
              <img
                src="https://images.unsplash.com/photo-1605197584547-c93aa1cd3d52?q=80&w=1000&auto=format&fit=crop"
                alt="Murukku"
                className="rounded-2xl shadow-xl object-cover h-64 w-full hover:-translate-y-2 transition-transform duration-500"
              />
              <img
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop"
                alt="Laddoo"
                className="rounded-2xl shadow-xl object-cover h-64 w-full transform -translate-y-8 hover:-translate-y-12 transition-transform duration-500 col-span-2 mx-auto w-3/4"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Moved right after Hero */}
      <section id="about" className="py-20 px-4 bg-brand-light relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-12 flex justify-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-text border-4 border-brand-primary/30 rounded-[50%] px-12 py-4 inline-block relative">
              About Us
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand-primary rounded-full"></span>
              <span className="absolute -bottom-2 -left-2 w-4 h-4 bg-brand-primary rounded-full"></span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center text-left">
            <div className="space-y-6 text-brand-text/90 leading-relaxed">
              <p className="text-lg">
                Welcome to <span className="font-bold text-brand-primary">Noble Bites</span> – your one-stop destination for authentic Tamil Nadu snacks and sweets. Rooted in tradition and crafted with love, we bring the timeless flavors of our heritage straight to your plate.
              </p>
              <p>
                From crispy murukkus to melt-in-mouth adhirasams, every bite is a celebration of our culture, made using age-old recipes and the finest ingredients. Whether you're craving something spicy, sweet, or both — we serve it fresh, just like how grandma made it!
              </p>
              <div className="bg-white/50 p-6 rounded-xl border-l-4 border-brand-primary italic">
                <p className="font-heading text-xl text-brand-primary mb-2">
                  "உணவே மருந்து" (Food is medicine)
                </p>
                <p className="text-sm">
                  In Tamil tradition, food is art — and every sweet or snack we serve reflects that purity. True flavor speaks of home.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary rounded-full opacity-10 blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=1000&auto=format&fit=crop"
                alt="Traditional Serving"
                className="rounded-full w-full max-w-md mx-auto shadow-2xl border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-brand-primary mb-4">Featured Delicacies</h2>
            <p className="text-brand-text/70 max-w-2xl mx-auto">
              Our most loved sweets and snacks, prepared fresh daily using traditional recipes passed down through generations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/menu" className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-primary font-bold py-3 px-8 rounded-full hover:bg-brand-primary hover:text-white transition-all">
              View Full Menu <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
