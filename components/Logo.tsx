export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center w-10 h-10 bg-gray-900 rounded-lg">
        <span className="text-white font-bold text-xl">K</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">KITOS</span>
    </div>
  );
}
