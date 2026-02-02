import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Table Type
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the type of table you'd like to customize and we'll guide
            you through creating your perfect piece.
          </p>
        </div>

        {/* Product Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Pool Table */}
          <Link
            href="/customize/pool"
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-80">
              <Image
                src="https://images.unsplash.com/photo-1626265423142-fb459302d640?q=80&w=2070&auto=format&fit=crop"
                alt="Pool table"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Pool Tables</h2>
                <p className="text-gray-200 mb-4">
                  Professional-grade tables for the ultimate gaming experience
                </p>
                <div className="flex items-center text-white font-semibold group-hover:gap-3 gap-2 transition-all">
                  Customize Now
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t-4 border-green-600">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Multiple sizes available
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Premium wood finishes
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Professional felt colors
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Custom leg styles
                </li>
              </ul>
            </div>
          </Link>

          {/* Marble Table */}
          <Link
            href="/customize/marble"
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-80">
              <Image
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2070&auto=format&fit=crop"
                alt="Marble table"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Marble Tables</h2>
                <p className="text-gray-200 mb-4">
                  Elegant designs that elevate any space
                </p>
                <div className="flex items-center text-white font-semibold group-hover:gap-3 gap-2 transition-all">
                  Customize Now
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t-4 border-gray-600">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-gray-600 mr-2">✓</span>
                  Various marble types
                </li>
                <li className="flex items-center">
                  <span className="text-gray-600 mr-2">✓</span>
                  Custom dimensions
                </li>
                <li className="flex items-center">
                  <span className="text-gray-600 mr-2">✓</span>
                  Multiple finishes
                </li>
                <li className="flex items-center">
                  <span className="text-gray-600 mr-2">✓</span>
                  Designer leg options
                </li>
              </ul>
            </div>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Not sure which one to choose?
          </p>
          <Link
            href="/contact"
            className="text-gray-900 font-semibold hover:underline"
          >
            Contact us for personalized recommendations
          </Link>
        </div>
      </div>
    </div>
  );
}
