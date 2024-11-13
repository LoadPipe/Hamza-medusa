'use client';
import {
    PricedProduct,
    PricedVariant,
} from '@medusajs/medusa/dist/types/pricing';
import { clx } from '@medusajs/ui';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { RegionInfo } from '@/types/global';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { getAverageRatings, getReviewCount, getStore } from '@lib/data';
import { renderStars } from '../review-stars';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export default function ProductPrice({
    product,
    variant,
    region,
}: {
    product: PricedProduct;
    variant?: PricedVariant;
    region: RegionInfo;
}) {
    const { preferred_currency_code, authData } = useCustomerAuthStore();
    //console.log('user preferred currency code: ', preferred_currency_code);

    const selectedPrices = variant
        ? variant.prices
        : product.variants[0].prices;
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [storeName, setStoreName] = useState('');
    const router = useRouter();

    // console.log(`Product is ${product.id}`);
    useEffect(() => {
        const fetchReviewCount = async () => {
            try {
                const response = await getReviewCount(product.id as string);
                // console.log(`response.data.count is ${response.data}`);
                setReviewCount(response); // Assuming the response contains the count directly
            } catch (error) {
                console.error('Failed to fetch review count:', error);
            }
        };

        const fetchAverageRating = async () => {
            try {
                const response = await getAverageRatings(product.id as string);
                // console.log(`response.data.average is ${response.data}`);
                setAverageRating(response); // Assuming the response contains the average directly
            } catch (error) {
                console.error('Failed to fetch average rating:', error);
            }
        };

        const getStoreName = async () => {
            try {
                const response = await getStore(product.id as string);
                console.log(`STORE NAME is ${response}`);
                setStoreName(response);
            } catch (error) {
                console.error('Failed to fetch store name:', error);
            }
        };

        getStoreName();
        fetchReviewCount();
        fetchAverageRating();
    }, [product.id]);

    const navigateToVendor = () => {
        router.push(
            `/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/vendor/${storeName}`
        );
    };

    let preferredPrice =
        authData.status == 'authenticated' &&
        preferred_currency_code &&
        selectedPrices.find((a) => a.currency_code == preferred_currency_code);

    if (!selectedPrices) {
        return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />;
    }

    return (
        <div className="flex flex-col space-y-1 text-ui-fg-base text-white">
            <div>
                <h3>Product Reviews: {reviewCount} Ratings</h3>
                {averageRating > 0 && (
                    <p className="text-white self-center">
                        Average Rating: {renderStars(averageRating)}
                    </p>
                )}
                <h3
                    onClick={navigateToVendor}
                    tabIndex={0} // This makes the element focusable
                >
                    Vendor:{' '}
                    <span className="text-blue-500 ext-blue-500 hover:text-blue-700 focus:text-blue-700 cursor-pointer">
                        {storeName}
                    </span>
                </h3>{' '}
            </div>
            {preferredPrice ? (
                <span className={clx('text-xl-semi')}>
                    {formatCryptoPrice(
                        preferredPrice.amount,
                        preferredPrice.currency_code
                    )}{' '}
                    {preferredPrice.currency_code.toUpperCase()}
                </span>
            ) : (
                <>
                    {selectedPrices.map((price) => {
                        return (
                            <span
                                key={price.currency_code}
                                className={clx('text-xl-semi')}
                            >
                                {formatCryptoPrice(
                                    price.amount,
                                    price.currency_code
                                )}{' '}
                                {price.currency_code.toUpperCase()}
                            </span>
                        );
                    })}
                </>
            )}
        </div>
    );
}
