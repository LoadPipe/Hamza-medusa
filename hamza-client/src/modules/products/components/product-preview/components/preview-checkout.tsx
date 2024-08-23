'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Text, Button, Flex, Box, Heading, Divider } from '@chakra-ui/react';
import useProductPreview from '@store/product-preview/product-preview';
import CurrencyButtonPreview from './currency-buttons';
import QuantityButton from './quantity-button';
import { addToCart } from '@modules/cart/actions';
import { useParams, useRouter } from 'next/navigation';
import ReviewStar from '../../../../../../public/images/products/review-star.svg';
import Image from 'next/image';
import { Variant } from 'types/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import toast from 'react-hot-toast';
import OptionSelect from '../../option-select';
import { isEqual } from 'lodash';
import axios from 'axios';
import {
    TiStarFullOutline,
    TiStarHalfOutline,
    TiStarOutline,
} from 'react-icons/ti';
import CartPopup from '../../cart-popup';
import { averageRatings, reviewCounter } from '@lib/data';

const MEDUSA_SERVER_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

interface PreviewCheckoutProps {
    productId: string;
}

// TODO: REFACTOR THIS COMPONENT, POST DEMO - GN
const PreviewCheckout: React.FC<PreviewCheckoutProps> = ({ productId }) => {
    const currencies: { [key: string]: 'ETH' | 'USDC' | 'USDT' } = {
        ETH: 'ETH',
        USDT: 'USDT',
        USDC: 'USDC',
    };
    const [options, setOptions] = useState<Record<string, string>>({});
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const updateOptions = (update: Record<string, string>) => {
        // console.log('options are ', options);
        setOptions({ ...options, ...update });
    };
    let countryCode = useParams().countryCode as string;
    if (process.env.NEXT_PUBLIC_FORCE_US_COUNTRY)
        countryCode = process.env.NEXT_PUBLIC_FORCE_US_COUNTRY;

    const [isWhitelisted, setIsWhitelisted] = useState(false);

    const { productData, variantId, quantity, setVariantId } =
        useProductPreview();
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<null | Variant>(
        null
    );

    const [averageRating, setAverageRating] = useState<number>(0);
    const [reviewCount, setReviewCount] = useState<number>(0);

    const { preferred_currency_code } = useCustomerAuthStore();
    console.log('user preferred currency code: ', preferred_currency_code);

    const { whitelist_config, setWhitelistConfig, authData } =
        useCustomerAuthStore();
    const router = useRouter();

    // console.log(typeof productId, productId);

    useEffect(() => {
        const fetchProductReview = async () => {
            const averageRatingResponse = await averageRatings(productId);
            const reviewCountResponse = await reviewCounter(productId);

            setAverageRating(averageRatingResponse);
            setReviewCount(reviewCountResponse);
        };

        fetchProductReview();
        // console.log(
        //     `ReviewCount ${reviewCount} AverageRating ${averageRating}`
        // );
    }, [productId]);

    const variantRecord = useMemo(() => {
        const map: Record<string, Record<string, string>> = {};
        if (productData && productData.variants) {
            for (const variant of productData.variants) {
                if (!variant.options || !variant.id) continue;

                const temp: Record<string, string> = {};

                for (const option of variant.options) {
                    temp[option.option_id] = option.value;
                }

                map[variant.id] = temp;
            }

            return map;
        }
    }, [productData, variantId]);

    console.log(`Variant ID ${variantId}`);
    // console.log(
    //     `Product Data ${JSON.stringify(productData)} ${productData.variant}`
    // );

    useEffect(() => {
        let checkVariantId: string | undefined = undefined;
        if (variantRecord) {
            for (const key of Object.keys(variantRecord)) {
                if (isEqual(variantRecord[key], options)) {
                    checkVariantId = key;
                }
            }
        }
        if (checkVariantId) {
            setVariantId(checkVariantId);
        }
    }, [options]);

    useEffect(() => {
        if (productData && productData.variants) {
            if (!variantId) {
                console.log(`variantId is not set yet`);
                setVariantId(productData.variants[0].id);
            }
            let selectedProductVariant = productData.variants.find(
                (a: any) => a.id == productData.variants[0].id
                // (a: any) => a.id == variantId
            );
            console.log(`variantID is: ${variantId}`);
            if (!variantId) {
                setVariantId(selectedProductVariant.id);
            }
            console.log(`variantID is: ${variantId}`);

            setSelectedVariant(selectedProductVariant);
            const price =
                selectedProductVariant &&
                (selectedProductVariant.prices.find(
                    (p: any) =>
                        p.currency_code === (preferred_currency_code ?? 'usdc')
                ) ??
                    selectedProductVariant.prices[0]);
            // console.log(`price is being set to ${price}`);
            setSelectedPrice(price?.amount ?? 0);
            // console.log(productData);
        }
    }, [productData, variantId]);

    const handleAddToCart = async (showPopup: boolean = true) => {
        if (!selectedVariant) {
            console.error('Selected variant is null or undefined.');
            return;
        }

        try {
            await addToCart({
                variantId: selectedVariant.id!,
                quantity: quantity,
                countryCode: countryCode,
                currencyCode: 'eth',
            });

            if (showPopup) {
                setCartModalOpen(true);
                setTimeout(() => {
                    setCartModalOpen(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const whitelistedProductHandler = async () => {
        let res = await axios.get(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/custom/product/get-store?product_id=${productData.id}`
        );
        let data = res.data;
        // console.log(data);

        if (data.status == true) {
            console.log('white list config ', whitelist_config);
            const whitelistedProduct =
                whitelist_config.is_whitelisted &&
                    whitelist_config.whitelisted_stores.includes(data.data)
                    ? true
                    : false;

            // console.log('white listed product ', whitelistedProduct);

            setIsWhitelisted(whitelistedProduct);
        }
        return;
    };

    const inStock =
        selectedVariant && selectedVariant.inventory_quantity > 0
            ? true
            : false;

    useEffect(() => {
        if (
            authData.status == 'authenticated' &&
            selectedVariant &&
            selectedVariant.allow_backorder
        ) {
            // console.log('running whitelist product handler');
            whitelistedProductHandler();
        }
    }, [authData.status, productData, selectedVariant]);

    // Star Feature
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
        <Flex
            padding={{ base: '0', md: '2rem' }}
            borderRadius={{ base: '0px', md: '16px' }}
            maxW={{ base: '100%', md: '504px' }}
            width={'100%'}
            flexDirection={'column'}
            backgroundColor={{ base: 'transparent', md: '#121212' }}
            overflow={'hidden'}
        >
            <Flex gap="10px" flexDirection={'column'}>
                <Heading
                    display={{ base: 'block', md: 'none' }}
                    fontSize={'16px'}
                    color="white"
                >
                    {productData.title}
                </Heading>
                <Heading
                    display={{ base: 'none', md: 'block' }}
                    fontSize={'16px'}
                    color="primary.green.900"
                >
                    Listing Price
                </Heading>
                <Flex gap="10px" mb="-0.5rem">
                    <CurrencyButtonPreview
                        width="24px"
                        height="24px"
                        currencyName={currencies['USDC']}
                    />
                    <Heading
                        fontSize={{ base: '18px', md: '32px' }}
                        color="white"
                    >
                        {`${formatCryptoPrice(parseFloat(selectedPrice!), preferred_currency_code ?? 'usdc')} ${preferred_currency_code?.toUpperCase() ?? 'USDC'}`}
                    </Heading>
                    {/*<Text*/}
                    {/*    style={{ textDecoration: 'line-through' }}*/}
                    {/*    alignSelf={'center'}*/}
                    {/*    fontSize={{ base: '9px', md: '18px' }}*/}
                    {/*    display={{ base: 'none', md: 'block' }}*/}
                    {/*    color="#555555"*/}
                    {/*>*/}
                    {/*    {`${formatCryptoPrice(parseFloat(selectedPrice!), preferred_currency_code ?? 'usdc')}`}*/}
                    {/*</Text>*/}
                </Flex>

                <Heading
                    display={{ base: 'none', md: 'block' }}
                    as="h3"
                    variant="semibold"
                    fontSize={'18px'}
                    color="white"
                >
                    {`${formatCryptoPrice(parseFloat(selectedPrice!), preferred_currency_code ?? 'usdc')} ${preferred_currency_code?.toUpperCase() ?? 'USDC'}`}
                </Heading>
                {reviewCount > 0 ? (
                    <Flex gap="5px" height="20px">
                        <Flex flexDirection={'row'}>
                            <Flex flexDirection={'row'}>
                                {renderStars(averageRating)}
                            </Flex>
                            <Heading
                                ml="4px"
                                as="h4"
                                variant="semibold"
                                fontSize={'16px'}
                                color={'#555555'}
                                alignSelf={'center'}
                                mt="2px"
                            >
                                ({reviewCount} Reviews)
                            </Heading>
                        </Flex>
                    </Flex>
                ) : (
                    <Flex gap="5px" height="20px">
                        <Flex flexDirection={'row'}>
                            <Image src={ReviewStar} alt={'star'} />
                            <Image src={ReviewStar} alt={'star'} />
                            <Image src={ReviewStar} alt={'star'} />
                            <Image src={ReviewStar} alt={'star'} />
                            <Image src={ReviewStar} alt={'star'} />
                        </Flex>

                        <Flex flexDirection={'row'}>
                            <Heading
                                as="h4"
                                variant="semibold"
                                fontSize={'16px'}
                                color={'white'}
                                alignSelf={'center'}
                                mt="2px"
                            >
                                4.97
                            </Heading>
                            <Heading
                                ml="4px"
                                as="h4"
                                variant="semibold"
                                fontSize={'16px'}
                                color={'#555555'}
                                alignSelf={'center'}
                                mt="2px"
                            >
                                (0 Reviews)
                            </Heading>
                        </Flex>
                    </Flex>
                )}

                <Heading
                    display={{ base: 'none', md: 'flex' }}
                    as="h4"
                    fontSize="16px"
                    color="white"
                >
                    Also available in other currencies
                </Heading>
                <Flex display={{ base: 'none', md: 'flex' }} gap="10px">
                    {Object.keys(currencies)
                        .filter((key: string) => currencies[key] !== 'USDC')
                        .map((key) => (
                            <CurrencyButtonPreview
                                width="20px"
                                height="20px"
                                key={key}
                                currencyName={currencies[key]}
                            />
                        ))}
                </Flex>
            </Flex>
            <Divider
                color="#555555"
                display={{ base: 'block', md: 'none' }}
                mt="1rem"
            />
            {/* Varients */}
            <Flex width={'100%'} flexDirection={'column'} mt="1rem">
                <div>
                    {productData &&
                        productData.variants &&
                        productData.variants.length > 1 && (
                            <div className="flex flex-col gap-y-4">
                                {(productData.options || []).map(
                                    (option: any) => {
                                        return (
                                            <div key={option.id}>
                                                <OptionSelect
                                                    option={option}
                                                    current={options[option.id]}
                                                    updateOption={updateOptions}
                                                    title={option.title}
                                                />
                                            </div>
                                        );
                                    }
                                )}
                                <Divider />
                            </div>
                        )}
                </div>

                <QuantityButton />

                <Button
                    onClick={() => {
                        if (!inStock && isWhitelisted) {
                            handleAddToCart(false);
                            router.push('/checkout?step=address');

                            return;
                        }
                        if (inStock) {
                            handleAddToCart(false);
                            router.push('/checkout?step=address');

                            return;
                        }
                        if (!inStock && !isWhitelisted) {
                            toast.error('Out of stock');
                        }
                    }}
                    borderRadius={'56px'}
                    height={{ base: '40px', md: '75px' }}
                    width="100%"
                    backgroundColor={'primary.yellow.900'}
                    fontSize={{ base: '12px', md: '18px' }}
                >
                    Buy Now
                </Button>
                {!inStock && isWhitelisted && (
                    <span className="text-xs text-white px-4 py-2">
                        You can buy it as you are whitelisted customer
                    </span>
                )}

                <Button
                    disabled={!inStock && !isWhitelisted}
                    onClick={() => {
                        if (!inStock && isWhitelisted) {
                            handleAddToCart();
                            return;
                        }
                        if (inStock) {
                            handleAddToCart();
                            return;
                        }
                        if (!inStock && !isWhitelisted) {
                            toast.error('Out of stock');
                        }
                    }}
                    borderRadius={'56px'}
                    height={{ base: '40px', md: '75px' }}
                    borderWidth={'1px'}
                    color="primary.yellow.900"
                    borderColor={'primary.yellow.900'}
                    backgroundColor={'transparent'}
                    mt="1rem"
                    data-cy="add-to-cart-button"
                    fontSize={{ base: '12px', md: '18px' }}
                    _hover={{
                        color: 'black',
                        bg: 'white',
                        borderColor: 'white',
                    }}
                >
                    {!inStock && isWhitelisted
                        ? 'Add to cart'
                        : inStock
                            ? 'Add to Cart'
                            : 'Out of Stock'}
                </Button>
                {!inStock && isWhitelisted && (
                    <span className="text-xs text-white px-4 py-2">
                        You can add it as you are whitelisted customer
                    </span>
                )}

                <Divider
                    color="#555555"
                    display={{ base: 'block', md: 'none' }}
                    mt="2rem"
                />
                <CartPopup
                    open={cartModalOpen}
                    closeModal={() => {
                        setCartModalOpen(false);
                    }}
                />
            </Flex>
        </Flex>
    );
};

export default PreviewCheckout;
