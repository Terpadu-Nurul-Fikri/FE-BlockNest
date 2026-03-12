import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  slug?: string;
}

interface FeaturedProductsSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export default function FeaturedProductsSection({
  title,
  subtitle,
  products,
  viewAllHref = "/products",
}: Readonly<FeaturedProductsSectionProps>) {
  return (
    <section
      aria-label={title}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28"
    >
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-stone-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-stone-500 text-sm mt-2 max-w-md">{subtitle}</p>
          )}
        </div>
        <a
          href={viewAllHref}
          className="text-sm text-stone-500 border-b border-stone-300 pb-0.5 hover:text-stone-900 hover:border-stone-700 transition-colors duration-200 self-start sm:self-auto whitespace-nowrap"
        >
          View all collection →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            imageUrl={product.imageUrl}
            imageAlt={product.imageAlt}
            rating={product.rating}
            reviewCount={product.reviewCount}
            isNew={product.isNew}
            slug={product.slug}
          />
        ))}
      </div>
    </section>
  );
}
