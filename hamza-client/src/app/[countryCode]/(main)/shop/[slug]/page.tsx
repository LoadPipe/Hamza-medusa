'use client';

import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';
import ProductCollections from '@modules/collections/product_collection_filter';
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid';

export default function Page({ params }: { params: { slug: string } }) {
    const displaySlug = capitalizeSlug(params.slug);

    return (
        <div className="bg-black text-white flex flex-col py-12">
            <h1 className="text-3xl font-bold mb-4 text-center">
                {displaySlug} {/* Display the capitalized slug */}
            </h1>
            <div>
                <ProductCollections storeName={displaySlug} />{' '}
                {/* Pass the capitalized slug */}
            </div>
        </div>
    );
}

// Function to capitalize each word in the slug
function capitalizeSlug(slug: string) {
    // Decode URI components before processing
    const decodedSlug = decodeURIComponent(slug);
    return decodedSlug
        .replace(/\+/g, ' ')
        .split(/[\s-]+/) // Split on any sequence of spaces or dashes
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
}
