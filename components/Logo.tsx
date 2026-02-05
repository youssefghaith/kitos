import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10 md:w-12 md:h-12">
        <Image
          src="/kitos-logo.jpg"
          alt="KITOS logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="text-xl md:text-2xl font-semibold tracking-[0.12em] text-gray-900 uppercase">
        KITOS
      </span>
    </div>
  );
}
