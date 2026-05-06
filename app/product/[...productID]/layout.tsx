import type { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// In Next.js 15, params is a promise
type Props = {
  params: Promise<{ productID: string[] }> | { productID: string[] };
};

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  // Resolve params if it's a promise
  const params = await props.params;
  const id = params.productID?.[0];

  if (!id) {
    return {
      title: 'Product Not Found',
    };
  }

  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
    const product = await Product.findOne(query).lean();

    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }

    const title = `${product.name} | Silver Star`;
    const description = product.description || `Buy ${product.name} at Silver Star`;
    const images = product.images && product.images.length > 0 
      ? product.images.map((img: any) => img?.url || img) 
      : product.image ? [product.image] : [];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images,
      }
    };
  } catch (error) {
    console.error("Failed to generate metadata for product:", error);
    return {
      title: 'Product | Silver Star',
    };
  }
}

export default async function ProductLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ productID: string[] }> | { productID: string[] };
  }
) {
  const { children } = props;
  const params = await props.params;
  const id = params.productID?.[0];
  let jsonLd = null;

  if (id) {
    try {
      await connectDB();
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
      const product = await Product.findOne(query).lean();
      if (product) {
        const productUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/product/${id}`;
        const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`;
        
        jsonLd = [
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.images && product.images.length > 0 
              ? product.images.map((img: any) => img?.url || img) 
              : product.image ? [product.image] : [],
            description: product.description,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'INR',
              availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: productUrl,
            },
            aggregateRating: product.reviews > 0 ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviews,
            } : undefined,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: product.category,
                item: `${baseUrl}/shop/${product.category}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: product.name,
                item: productUrl,
              },
            ],
          }
        ];
      }
    } catch (e) {
      console.error("Schema generation error", e);
    }
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
