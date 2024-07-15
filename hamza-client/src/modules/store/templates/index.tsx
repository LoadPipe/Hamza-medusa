import { Suspense } from 'react';

import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid';
import RefinementList from '@modules/store/components/refinement-list';
// Removed SortOptions import since it's no longer used here
// import { SortOptions } from "@modules/store/components/refinement-list/sort-products";

import PaginatedProducts from './paginated-products';

const StoreTemplate = ({
    // Removed sortBy from the props since we won't be using it
    page,
    countryCode,
}: {
    page?: string;
    countryCode: string;
}) => {
    const pageNumber = page ? parseInt(page, 10) : 1;

    /*If RefinementList component is still necessary for other filters, keep it. Otherwise, consider removing or adjusting it as well.
             Since we're not using sortBy, we might not need to pass it to RefinementList */
    return (
        <div className="flex flex-col w-full small:flex-row small:items-start py-6 content-container bg-[var(--chakra-colors-black)]">
            {/*<RefinementList />*/}
            <div className="w-full">
                <div className="mb-8 text-2xl-semi">
                    <h1 className="text-white">All products</h1>
                </div>
                <Suspense fallback={<SkeletonProductGrid />}>
                    <PaginatedProducts
                        // Removed the sortBy prop entirely
                        page={pageNumber}
                        countryCode={countryCode}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default StoreTemplate;
