import React from 'react';
import { Suspense } from 'react';
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid';
import Thumbnail from '@modules/products/components/thumbnail';
import { Text } from '@medusajs/ui';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import axios from 'axios';
import { SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
//import PreviewPrice from '@modules/products/components/product-preview/price';
//import { ProductPreviewType } from 'types/global';
//import { getProductPrice } from '@lib/util/get-product-price';
//import { useProducts } from 'medusa-react';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
// TODO: Refactor goals to use <Suspense .. /> to wrap collection && <SkeletonProductGrid /> for loading state

type Props = {
    vendorName: string;
};

const ProductCollections = ({ vendorName }: Props) => {
    const { data, error, isLoading } = useQuery(
        ['products', { vendor: vendorName }],
        () =>
            axios.get(
                `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/products?store_name=${vendorName}`
            )
    );

    const { authData, preferred_currency_code } = useCustomerAuthStore();

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
                                            preferred_currency_code
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
                                                            preferred_currency_code
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
                                                                            price.currency_code
                                                                        )}{' '}
                                                                        {price.currency_code.toUpperCase()}
                                                                        <br />
                                                                        {'  '}
                                                                    </>
                                                                );
                                                            }
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
