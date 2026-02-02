interface MarbleTableVisualProps {
  size: string;
  marbleType: string;
  legStyle: string;
}

const marblePatterns: { [key: string]: { base: string; accent: string } } = {
  carrara: { base: "#f8f9fa", accent: "#adb5bd" },
  calacatta: { base: "#ffffff", accent: "#d4af37" },
  nero: { base: "#2d3748", accent: "#4a5568" },
  emperador: { base: "#8b7355", accent: "#654321" },
  verde: { base: "#2f5233", accent: "#4a7c59" },
};

const legColors: { [key: string]: string } = {
  chrome: "#c0c0c0",
  gold: "#d4af37",
  black: "#1a1a1a",
  wood: "#8b7355",
};

export default function MarbleTableVisual({
  size,
  marbleType,
  legStyle,
}: MarbleTableVisualProps) {
  const tableWidth =
    size === "small" ? 280 : size === "medium" ? 340 : 400;
  const tableHeight = size === "small" ? 160 : size === "medium" ? 200 : 240;

  const marble = marblePatterns[marbleType];

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg p-8">
      <svg
        viewBox="0 0 450 350"
        className="w-full h-full"
        style={{ maxWidth: "550px" }}
      >
        {/* Shadow */}
        <ellipse
          cx="225"
          cy="300"
          rx={tableWidth / 2 + 30}
          ry="20"
          fill="rgba(0,0,0,0.15)"
        />

        {/* Table legs */}
        {legStyle === "pedestal" && (
          <>
            <ellipse
              cx="225"
              cy="270"
              rx="50"
              ry="15"
              fill={legColors.chrome}
            />
            <rect
              x="210"
              y="200"
              width="30"
              height="70"
              fill={legColors.chrome}
            />
            <ellipse
              cx="225"
              cy="200"
              rx="35"
              ry="12"
              fill={legColors.chrome}
            />
          </>
        )}

        {legStyle === "four-leg" && (
          <>
            {/* Four corner legs */}
            <rect
              x={(450 - tableWidth) / 2 + 20}
              y="200"
              width="12"
              height="100"
              fill={legColors.chrome}
            />
            <rect
              x={(450 + tableWidth) / 2 - 32}
              y="200"
              width="12"
              height="100"
              fill={legColors.chrome}
            />
            <rect
              x={(450 - tableWidth) / 2 + 20}
              y="200"
              width="12"
              height="100"
              fill={legColors.chrome}
              transform={`translate(0, ${-(tableHeight - 40)})`}
            />
            <rect
              x={(450 + tableWidth) / 2 - 32}
              y="200"
              width="12"
              height="100"
              fill={legColors.chrome}
              transform={`translate(0, ${-(tableHeight - 40)})`}
            />
          </>
        )}

        {legStyle === "geometric" && (
          <>
            {/* Modern geometric base */}
            <polygon
              points={`${225 - 60},270 ${225 + 60},270 ${225 + 40},300 ${225 - 40},300`}
              fill={legColors.gold}
            />
            <rect
              x="200"
              y="200"
              width="50"
              height="70"
              fill={legColors.gold}
            />
            <polygon
              points={`${225 - 35},200 ${225 + 35},200 ${225 + 25},220 ${225 - 25},220`}
              fill={legColors.gold}
            />
          </>
        )}

        {/* Table top - marble surface */}
        <defs>
          <pattern
            id={`marble-${marbleType}`}
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill={marble.base} />
            <path
              d="M 0 20 Q 25 15 50 20 T 100 20"
              stroke={marble.accent}
              strokeWidth="0.5"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 0 50 Q 30 45 60 50 T 100 50"
              stroke={marble.accent}
              strokeWidth="0.8"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 0 80 Q 20 75 40 80 T 100 80"
              stroke={marble.accent}
              strokeWidth="0.6"
              fill="none"
              opacity="0.35"
            />
          </pattern>

          {/* Gradient for depth */}
          <linearGradient id="tableGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Main table surface */}
        <ellipse
          cx="225"
          cy={(350 - tableHeight) / 2 + 80}
          rx={tableWidth / 2}
          ry={tableHeight / 2}
          fill={`url(#marble-${marbleType})`}
        />

        {/* Shine/gradient overlay */}
        <ellipse
          cx="225"
          cy={(350 - tableHeight) / 2 + 80}
          rx={tableWidth / 2}
          ry={tableHeight / 2}
          fill="url(#tableGradient)"
        />

        {/* Edge highlight */}
        <ellipse
          cx="225"
          cy={(350 - tableHeight) / 2 + 80}
          rx={tableWidth / 2 - 3}
          ry={tableHeight / 2 - 3}
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.3"
        />

        {/* Table thickness/edge */}
        <ellipse
          cx="225"
          cy={(350 - tableHeight) / 2 + 95}
          rx={tableWidth / 2}
          ry={tableHeight / 2}
          fill={marble.base}
          opacity="0.8"
        />

        {/* Size label */}
        <text
          x="225"
          y="40"
          textAnchor="middle"
          fill="#666"
          fontSize="14"
          fontWeight="bold"
        >
          {size.toUpperCase()} TABLE
        </text>
      </svg>
    </div>
  );
}
