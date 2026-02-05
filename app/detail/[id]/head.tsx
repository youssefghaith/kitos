import { MARBLE_TABLE_1 } from "@/lib/tableData";

export default function Head({ params }: { params: { id: string } }) {
  const config = MARBLE_TABLE_1; // single model for now
  const title = `${config.title} | KITOS`;
  const description = config.description;
  const og = config.fallbackSrc || "/gallery/pool-table-1.png";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={og} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}