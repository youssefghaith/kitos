import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Palette, Ruler } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1574643156929-51fa098b0394?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury pool table"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Craft Your Perfect Table
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Premium pool tables and marble tables designed to elevate your
              space. Customize every detail to match your vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/customize"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Start Customizing
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/gallery"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose KITOS?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine traditional craftsmanship with modern design to create
              tables that are both beautiful and functional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Handcrafted using the finest materials to ensure durability and
                elegance.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full mb-4">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Full Customization
              </h3>
              <p className="text-gray-600">
                Choose from various sizes, materials, colors, and finishes to
                create your dream table.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full mb-4">
                <Ruler className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Crafting</h3>
              <p className="text-gray-600">
                Every table is precision-engineered by skilled artisans with
                years of experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Types Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Collections
            </h2>
            <p className="text-lg text-gray-600">
              Explore our premium table collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pool Tables */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1626265423142-fb459302d640?q=80&w=2070&auto=format&fit=crop"
                  alt="Pool table"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <h3 className="text-2xl font-bold text-white p-6">Pool Tables</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Professional-grade pool tables with premium felt and solid
                  wood construction. Perfect for game rooms and entertainment
                  spaces.
                </p>
                <Link
                  href="/customize/pool"
                  className="inline-flex items-center text-gray-900 font-semibold hover:underline"
                >
                  Customize Your Pool Table
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Marble Tables */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2070&auto=format&fit=crop"
                  alt="Marble table"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <h3 className="text-2xl font-bold text-white p-6">Marble Tables</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Elegant marble tables that combine luxury with functionality.
                  Ideal for dining rooms and sophisticated living spaces.
                </p>
                <Link
                  href="/customize/marble"
                  className="inline-flex items-center text-gray-900 font-semibold hover:underline"
                >
                  Customize Your Marble Table
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Dream Table?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start designing your custom table today and bring your vision to
            life.
          </p>
          <Link
            href="/customize"
            className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
