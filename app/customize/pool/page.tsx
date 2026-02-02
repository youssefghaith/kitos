"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import PoolTable3D from "@/components/PoolTable3D";

const sizes = [
  { value: "7ft", label: "7 ft", price: 2000 },
  { value: "8ft", label: "8 ft", price: 2500 },
  { value: "9ft", label: "9 ft", price: 3000 },
];

const materials = [
  { value: "wood", label: "Wood", price: 0 },
  { value: "marble", label: "Marble", price: 2000 },
];

const woodTypes = [
  { value: "oak", label: "Oak", price: 0 },
  { value: "walnut", label: "Walnut", price: 300 },
  { value: "mahogany", label: "Mahogany", price: 400 },
  { value: "cherry", label: "Cherry", price: 350 },
];

const marbleTypes = [
  { value: "carrara", label: "Carrara White", price: 0 },
  { value: "calacatta", label: "Calacatta Gold", price: 800 },
  { value: "nero", label: "Nero Marquina", price: 600 },
  { value: "emperador", label: "Emperador Brown", price: 500 },
];

const clothMaterials = [
  { value: "worsted", label: "Worsted Cloth", price: 0, description: "Professional tournament grade" },
  { value: "woolen", label: "Woolen Cloth", price: -200, description: "Classic recreational" },
  { value: "speed", label: "Speed Cloth", price: 300, description: "Fast tournament play" },
];

const clothColors = [
  { value: "green", label: "Tournament Green", color: "#0a5f38" },
  { value: "blue", label: "Electric Blue", color: "#1e40af" },
  { value: "red", label: "Championship Red", color: "#991b1b" },
  { value: "black", label: "Midnight Black", color: "#1f2937" },
  { value: "burgundy", label: "Burgundy", color: "#7c2d12" },
  { value: "camel", label: "Camel", color: "#c19a6b" },
];

const legStyles = [
  { value: "classic", label: "Classic", price: 0 },
  { value: "modern", label: "Modern", price: 200 },
  { value: "ornate", label: "Ornate", price: 400 },
];

const accessories = [
  { value: "diningTop", label: "Dining Table Conversion Top", price: 800 },
  { value: "chairs", label: "Matching Dining Chairs (Set of 6)", price: 1200 },
  { value: "cueRack", label: "Wall-Mounted Cue Rack", price: 150 },
  { value: "lighting", label: "Overhead Table Lighting", price: 400 },
  { value: "cover", label: "Premium Table Cover", price: 100 },
  { value: "cueSet", label: "Professional Cue Set (4 cues)", price: 300 },
  { value: "ballSet", label: "Premium Ball Set", price: 200 },
];

export default function PoolTableCustomizer() {
  const [material, setMaterial] = useState("wood");
  const [size, setSize] = useState("8ft");
  const [woodType, setWoodType] = useState("oak");
  const [marbleType, setMarbleType] = useState("carrara");
  const [clothMaterial, setClothMaterial] = useState("worsted");
  const [clothColor, setClothColor] = useState("green");
  const [legStyle, setLegStyle] = useState("classic");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  const calculatePrice = () => {
    const materialPrice = materials.find((m) => m.value === material)?.price || 0;
    const sizePrice = sizes.find((s) => s.value === size)?.price || 0;
    const surfacePrice = material === "wood" 
      ? (woodTypes.find((w) => w.value === woodType)?.price || 0)
      : (marbleTypes.find((m) => m.value === marbleType)?.price || 0);
    const clothMaterialPrice = clothMaterials.find((c) => c.value === clothMaterial)?.price || 0;
    const legPrice = legStyles.find((l) => l.value === legStyle)?.price || 0;
    const accessoriesPrice = selectedAccessories.reduce((total, acc) => {
      const accessory = accessories.find((a) => a.value === acc);
      return total + (accessory?.price || 0);
    }, 0);

    return materialPrice + sizePrice + surfacePrice + clothMaterialPrice + legPrice + accessoriesPrice;
  };

  const toggleAccessory = (value: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const getWhatsAppMessage = () => {
    const price = calculatePrice();
    const accessoriesList = selectedAccessories
      .map((acc) => accessories.find((a) => a.value === acc)?.label)
      .join(", ");

    const surfaceType = material === "wood"
      ? `Wood Type: ${woodTypes.find((w) => w.value === woodType)?.label}`
      : `Marble Type: ${marbleTypes.find((m) => m.value === marbleType)?.label}`;

    return encodeURIComponent(
      `Hi! I'd like to request a quote for a custom pool table:\n\n` +
        `Material: ${materials.find((m) => m.value === material)?.label}\n` +
        `Size: ${sizes.find((s) => s.value === size)?.label}\n` +
        `${surfaceType}\n` +
        `Cloth Material: ${clothMaterials.find((c) => c.value === clothMaterial)?.label}\n` +
        `Cloth Color: ${clothColors.find((f) => f.value === clothColor)?.label}\n` +
        `Leg Style: ${legStyles.find((l) => l.value === legStyle)?.label}\n` +
        `Accessories: ${accessoriesList || "None"}\n\n` +
        `Estimated Price: $${price.toLocaleString()}\n\n` +
        `Please provide more details about pricing and delivery.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/customize"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to selection
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Customize Your Pool Table
          </h1>
          <p className="text-gray-600">
            Design your perfect pool table with our interactive customizer
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 lg:sticky lg:top-24 h-fit">
            <h2 className="text-xl font-semibold mb-4">3D Live Preview</h2>
            <p className="text-sm text-gray-600 mb-3">Drag to rotate • Scroll to zoom • Right-click to pan</p>
            <div className="aspect-[4/3]">
              <PoolTable3D
                size={size}
                material={material}
                woodType={woodType}
                marbleType={marbleType}
                clothColor={clothColor}
                legStyle={legStyle}
              />
            </div>
            
            {/* Price */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">
                  Estimated Price
                </span>
                <span className="text-3xl font-bold text-gray-900">
                  ${calculatePrice().toLocaleString()}
                </span>
              </div>
              <a
                href={`https://wa.me/1234567890?text=${getWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Request Quote via WhatsApp
              </a>
            </div>
          </div>

          {/* Options Section */}
          <div className="space-y-6">
            {/* Material Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Table Material</h3>
              <div className="grid grid-cols-2 gap-3">
                {materials.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMaterial(m.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      material === m.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold">{m.label}</div>
                    <div className="text-sm text-gray-600">
                      {m.price === 0 ? "Base Price" : `+$${m.price.toLocaleString()}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Table Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSize(s.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      size === s.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold">{s.label}</div>
                    <div className="text-sm text-gray-600">
                      +${s.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Surface Type Selection - Wood or Marble */}
            {material === "wood" ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Wood Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {woodTypes.map((w) => (
                    <button
                      key={w.value}
                      onClick={() => setWoodType(w.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        woodType === w.value
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold">{w.label}</div>
                      <div className="text-sm text-gray-600">
                        {w.price === 0 ? "Included" : `+$${w.price}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Marble Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {marbleTypes.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMarbleType(m.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        marbleType === m.value
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold">{m.label}</div>
                      <div className="text-sm text-gray-600">
                        {m.price === 0 ? "Included" : `+$${m.price}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cloth Material Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Billiard Cloth Material</h3>
              <div className="space-y-3">
                {clothMaterials.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setClothMaterial(c.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      clothMaterial === c.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{c.label}</div>
                        <div className="text-sm text-gray-500">{c.description}</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {c.price === 0 ? "Included" : c.price > 0 ? `+$${c.price}` : `$${c.price}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cloth Color Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Cloth Color</h3>
              <div className="grid grid-cols-3 gap-3">
                {clothColors.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setClothColor(f.value)}
                    className={`p-3 rounded-lg border-4 transition-all ${
                      clothColor === f.value
                        ? "border-gray-900"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div 
                      className="w-full h-12 rounded mb-2"
                      style={{ backgroundColor: f.color }}
                    />
                    <div className="text-xs font-medium text-center">{f.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Leg Style Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Leg Style</h3>
              <div className="grid grid-cols-3 gap-3">
                {legStyles.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLegStyle(l.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      legStyle === l.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold">{l.label}</div>
                    <div className="text-sm text-gray-600">
                      {l.price === 0 ? "Included" : `+$${l.price}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Accessories (Optional)
              </h3>
              <div className="space-y-3">
                {accessories.map((a) => (
                  <label
                    key={a.value}
                    className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAccessories.includes(a.value)}
                        onChange={() => toggleAccessory(a.value)}
                        className="mr-3 h-5 w-5"
                      />
                      <span className="font-medium">{a.label}</span>
                    </div>
                    <span className="text-gray-600">+${a.price}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
