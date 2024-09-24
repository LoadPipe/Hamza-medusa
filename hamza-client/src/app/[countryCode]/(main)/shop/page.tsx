import { Metadata } from 'next';

import { SortOptions } from '@modules/shop/components/refinement-list/sort-products';
import ShopTemplate from 'modules/shop';
import { Box } from '@chakra-ui/react';

export const metadata: Metadata = {
    title: 'Store',
    description: 'Explore all of our products.',
};

type Params = {
    searchParams: {
        sortBy?: SortOptions;
        page?: string;
    };
    params: {
        countryCode: string;
    };
};

export default async function ShopPage({ searchParams, params }: Params) {
    const { sortBy, page } = searchParams;

    return (
        <Box
            style={{
                background:
                    'linear-gradient(to bottom, #020202 20vh, #2C272D 70vh)',
            }}
        >
            <ShopTemplate />{' '}
        </Box>
    );
}

// import { Metadata } from 'next';

// import { SortOptions } from '@modules/shop/components/refinement-list/sort-products';
// import StoreTemplate from '@modules/shop/templates';

// export const metadata: Metadata = {
//     title: 'Store',
//     description: 'Explore all of our products.',
// };

// type Params = {
//     searchParams: {
//         sortBy?: SortOptions;
//         page?: string;
//     };
//     params: {
//         countryCode: string;
//     };
// };

// export default async function StorePage({ searchParams, params }: Params) {
//     const { sortBy, page } = searchParams;

//     return (
//         <StoreTemplate
//             // sortBy={sortBy}
//             page={page}
//             countryCode={params.countryCode}
//         />
//     );
// }
