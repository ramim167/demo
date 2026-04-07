import { CollectionRouteView } from "@/components/collection-route-view";

export default async function CollectionPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CollectionRouteView slug={slug} />;
}
