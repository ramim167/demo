import { ProductRouteView } from "@/components/product-route-view";

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProductRouteView slug={slug} />;
}
