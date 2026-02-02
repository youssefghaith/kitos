import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    type: "Pool Table",
    title: "Classic Oak Pool Table",
    image: "https://images.unsplash.com/photo-1626265423142-fb459302d640?q=80&w=2070&auto=format&fit=crop",
    description: "8ft professional pool table with green felt",
  },
  {
    id: 2,
    type: "Marble Table",
    title: "Carrara Marble Dining Table",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2070&auto=format&fit=crop",
    description: "Elegant white marble with pedestal base",
  },
  {
    id: 3,
    type: "Pool Table",
    title: "Walnut Pool Table",
    image: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?q=80&w=2070&auto=format&fit=crop",
    description: "Luxury 9ft table with burgundy felt",
  },
  {
    id: 4,
    type: "Marble Table",
    title: "Nero Marquina Table",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=2070&auto=format&fit=crop",
    description: "Stunning black marble table for 8 seats",
  },
  {
    id: 5,
    type: "Pool Table",
    title: "Cherry Wood Pool Table",
    image: "https://images.unsplash.com/photo-1606932880811-69fd17c5c0dc?q=80&w=2070&auto=format&fit=crop",
    description: "Modern design with blue felt",
  },
  {
    id: 6,
    type: "Marble Table",
    title: "Calacatta Gold Table",
    image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=2070&auto=format&fit=crop",
    description: "Premium gold-veined marble dining table",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of completed projects and get inspired for
            your own custom table
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Yours?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start customizing your perfect table today and join our collection
            of satisfied customers
          </p>
          <Link
            href="/customize"
            className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Start Customizing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
