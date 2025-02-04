import React from 'react';
import { Suspense } from 'react';
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid';
import Thumbnail from '@modules/products/components/thumbnail';
import { Text } from '@medusajs/ui';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import axios from 'axios';
import { SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { getProductsByStoreName } from '@lib/data';

type Props = {
    storeName: string;
};

const ProductCollections = ({ storeName }: Props) => {

    const { data, error, isLoading } = useQuery({
        queryKey: ['products', { vendor: storeName }], // ✅ Ensure correct queryKey structure
        queryFn: async () => {
            try {
                return await getProductsByStoreName(storeName);
            } catch (err) {
                console.error('Error fetching products:', err);
                return null; // ✅ Return null explicitly if an error occurs
            }
        },
        enabled: !!storeName, // ✅ Ensures the query only runs when storeName is defined
    });


    const { authData, preferred_currency_code } = useCustomerAuthStore();
    //console.log('user preferred currency code: ', preferred_currency_code);

    if (isLoading) {
        return null; // Suspense will handle the loading fallback.
    }

    const err: any = error;
    if (err) return <div>Error: {err?.message}</div>;

    const products = data?.data;

    // console.log(products);

    return (
        <div className="text-white">
            <Suspense fallback={<SkeletonProductGrid />}>
                {data && (
                    <div>
                        <div className="mb-8 text-2xl-semi">
                            <h1>{products.title}</h1>
                        </div>
                        <SimpleGrid
                            justifyItems="center"
                            minChildWidth={{
                                base: '100%',
                                sm: '50%',
                                lg: '25%',
                            }}
                            spacing="20px"
                        >
                            {products.map((product: any) => {
                                let preferredPrice =
                                    authData.status == 'authenticated' &&
                                    preferred_currency_code &&
                                    product.variants[0].prices.find(
                                        (a: any) =>
                                            a.currency_code ==
                                            preferred_currency_code,
                                    );
                                return (
                                    <LocalizedClientLink
                                        key={product.id}
                                        href={`/products/${product.handle}`}
                                        className="group"
                                    >
                                        <div key={product.id}>
                                            <Thumbnail
                                                thumbnail={product.thumbnail}
                                                size="small"
                                            />
                                            <div className="flex txt-compact-medium mt-4 ">
                                                {/*<Text className="text-ui-fg-subtle font-bold text-white ">*/}
                                                {/*    <u>{product.title}</u>*/}
                                                {/*    <br />*/}

                                                {authData.status ==
                                                'authenticated' &&
                                                preferred_currency_code &&
                                                preferredPrice ? (
                                                    <>
                                                        {' '}
                                                        {formatCryptoPrice(
                                                            preferredPrice.amount,
                                                            preferred_currency_code,
                                                        )}{' '}
                                                        {preferredPrice.currency_code.toUpperCase()}
                                                    </>
                                                ) : (
                                                    <>
                                                        {product.variants[0].prices.map(
                                                            (price: any) => {
                                                                return (
                                                                    <>
                                                                        {formatCryptoPrice(
                                                                            price.amount,
                                                                            price.currency_code,
                                                                        )}{' '}
                                                                        {price.currency_code.toUpperCase()}
                                                                        <br />
                                                                        {'  '}
                                                                    </>
                                                                );
                                                            },
                                                        )}
                                                    </>
                                                )}
                                                <div className="flex items-center gap-x-2 "></div>
                                            </div>
                                        </div>
                                    </LocalizedClientLink>
                                );
                            })}
                        </SimpleGrid>
                    </div>
                )}
            </Suspense>
        </div>
    );
};

export default ProductCollections;
