interface PoolTableVisualProps {
  size: string;
  woodType: string;
  feltColor: string;
  legStyle: string;
}

const feltColors: { [key: string]: string } = {
  green: "#0a5f38",
  blue: "#1e40af",
  red: "#991b1b",
  black: "#1f2937",
  burgundy: "#7c2d12",
};

const woodColors: { [key: string]: string } = {
  oak: "#b8956a",
  walnut: "#5d4037",
  mahogany: "#833d3d",
  cherry: "#a0522d",
};

export default function PoolTableVisual({
  size,
  woodType,
  feltColor,
  legStyle,
}: PoolTableVisualProps) {
  const tableWidth = size === "7ft" ? 280 : size === "8ft" ? 320 : 360;
  const tableHeight = tableWidth * 0.5;

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg p-8">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        style={{ maxWidth: "500px" }}
      >
        {/* Shadow */}
        <ellipse
          cx="200"
          cy="260"
          rx={tableWidth / 2 + 20}
          ry="15"
          fill="rgba(0,0,0,0.2)"
        />

        {/* Table legs */}
        {legStyle === "classic" && (
          <>
            <rect
              x="80"
              y="180"
              width="15"
              height="80"
              fill={woodColors[woodType]}
            />
            <rect
              x="305"
              y="180"
              width="15"
              height="80"
              fill={woodColors[woodType]}
            />
            <rect
              x="80"
              y="180"
              width="15"
              height="80"
              fill={woodColors[woodType]}
              transform="translate(225, 0)"
            />
            <rect
              x="305"
              y="180"
              width="15"
              height="80"
              fill={woodColors[woodType]}
              transform="translate(-225, 0)"
            />
          </>
        )}

        {legStyle === "modern" && (
          <>
            <polygon
              points="85,180 95,180 90,260"
              fill={woodColors[woodType]}
            />
            <polygon
              points="305,180 315,180 310,260"
              fill={woodColors[woodType]}
            />
            <polygon
              points="85,180 95,180 90,260"
              transform="translate(225, 0)"
              fill={woodColors[woodType]}
            />
            <polygon
              points="305,180 315,180 310,260"
              transform="translate(-225, 0)"
              fill={woodColors[woodType]}
            />
          </>
        )}

        {legStyle === "ornate" && (
          <>
            <path
              d="M 87 180 Q 80 220 90 260"
              stroke={woodColors[woodType]}
              strokeWidth="12"
              fill="none"
            />
            <path
              d="M 312 180 Q 320 220 310 260"
              stroke={woodColors[woodType]}
              strokeWidth="12"
              fill="none"
            />
            <path
              d="M 87 180 Q 80 220 90 260"
              transform="translate(225, 0)"
              stroke={woodColors[woodType]}
              strokeWidth="12"
              fill="none"
            />
            <path
              d="M 312 180 Q 320 220 310 260"
              transform="translate(-225, 0)"
              stroke={woodColors[woodType]}
              strokeWidth="12"
              fill="none"
            />
          </>
        )}

        {/* Table frame (wood border) */}
        <rect
          x={(400 - tableWidth) / 2}
          y={(300 - tableHeight) / 2 - 30}
          width={tableWidth}
          height={tableHeight}
          fill={woodColors[woodType]}
          rx="8"
        />

        {/* Playing surface (felt) */}
        <rect
          x={(400 - tableWidth) / 2 + 15}
          y={(300 - tableHeight) / 2 - 30 + 15}
          width={tableWidth - 30}
          height={tableHeight - 30}
          fill={feltColors[feltColor]}
          rx="4"
        />

        {/* Pockets */}
        {[
          [(400 - tableWidth) / 2 + 20, (300 - tableHeight) / 2 - 30 + 20],
          [200, (300 - tableHeight) / 2 - 30 + 20],
          [
            (400 + tableWidth) / 2 - 20,
            (300 - tableHeight) / 2 - 30 + 20,
          ],
          [
            (400 - tableWidth) / 2 + 20,
            (300 + tableHeight) / 2 - 30 - 20,
          ],
          [200, (300 + tableHeight) / 2 - 30 - 20],
          [
            (400 + tableWidth) / 2 - 20,
            (300 + tableHeight) / 2 - 30 - 20,
          ],
        ].map((pos, i) => (
          <circle key={i} cx={pos[0]} cy={pos[1]} r="8" fill="#1a1a1a" />
        ))}

        {/* Size label */}
        <text
          x="200"
          y="35"
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
