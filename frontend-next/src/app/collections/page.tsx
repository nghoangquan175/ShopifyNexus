import CollectionClient from "./[handle]/CollectionClient";
import { shopifyGetProducts, mapShopifyCollectionProduct } from "./[handle]/page";

export default async function CollectionsIndexPage() {
  let products: any[] = [];
  const allProducts = await shopifyGetProducts();
  if (allProducts) {
    products = allProducts.edges.map((edge: any) =>
      mapShopifyCollectionProduct(edge.node)
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full">
      <CollectionClient
        handle="all"
        initialProducts={products}
        initialTitle="All Collections"
        initialDescription="Explore all premium gears, equipment and custom accessories."
      />
    </div>
  );
}
