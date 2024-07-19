'use client';
import {
    PricedProduct,
    PricedVariant,
} from '@medusajs/medusa/dist/types/pricing';
import { clx } from '@medusajs/ui';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TiStarOutline,
    TiStarFullOutline,
    TiStarHalfOutline,
} from 'react-icons/ti';
import { useRouter } from 'next/navigation';
import {
    formatCryptoPrice,
    getProductPrice,
} from '@lib/util/get-product-price';
import { RegionInfo } from 'types/global';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { averageRatings, reviewCounter } from '@lib/data';

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
                const response = await reviewCounter(product.id as string);
                // console.log(`response.data.count is ${response.data}`);
                setReviewCount(response); // Assuming the response contains the count directly
            } catch (error) {
                console.error('Failed to fetch review count:', error);
            }
        };

        const fetchAverageRating = async () => {
            try {
                const response = await averageRatings(product.id as string);
                // console.log(`response.data.average is ${response.data}`);
                setAverageRating(response); // Assuming the response contains the average directly
            } catch (error) {
                console.error('Failed to fetch average rating:', error);
            }
        };

        const getStoreName = async () => {
            try {
                const response = await axios.post(
                    `${BACKEND_URL}/custom/get-store`,
                    {
                        product_id: product.id,
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                console.log(`STORE NAME is ${response.data}`);
                setStoreName(response.data);
            } catch (error) {
                console.error('Failed to fetch store name:', error);
            }
        };

        getStoreName();
        fetchReviewCount();
        fetchAverageRating();
    }, [product.id]);

    const navigateToVendor = () => {
        router.push(`/us/vendor/${storeName}`);
    };

    let preferredPrice =
        authData.status == 'authenticated' &&
        preferred_currency_code &&
        selectedPrices.find((a) => a.currency_code == preferred_currency_code);

    if (!selectedPrices) {
        return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />;
    }

    const renderStars = (rating: any) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex">
                {Array(fullStars)
                    .fill(null)
                    .map((_, index) => (
                        <TiStarFullOutline
                            key={`full-${index}`}
                            className="text-yellow-500 text-2xl"
                        />
                    ))}
                {halfStar && (
                    <TiStarHalfOutline className="text-yellow-500 text-2xl" />
                )}
                {Array(emptyStars)
                    .fill(null)
                    .map((_, index) => (
                        <TiStarOutline
                            key={`empty-${index}`}
                            className="text-yellow-500 text-2xl"
                        />
                    ))}
            </div>
        );
    };

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
