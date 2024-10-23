'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Text, Button, Flex, Box, Heading, Divider } from '@chakra-ui/react';
import useProductPreview from '@store/product-preview/product-preview';
import QuantityButton from '../quantity-button';
import { addToCart } from '@modules/cart/actions';
import { useParams, useRouter } from 'next/navigation';
import ReviewStar from '../../../../../../../public/images/products/review-star.svg';
import Image from 'next/image';
import { Variant } from '@/types/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import toast from 'react-hot-toast';
import OptionSelect from '../../../option-select';
import { isEqual } from 'lodash';
import CartPopup from '../../../cart-popup';
import { getAverageRatings, getStore, getReviewCount } from '@lib/data';
import currencyIcons from '@/images/currencies/crypto-currencies';
import Spinner from '@modules/common/icons/spinner';
import TermsOfService from '../terms-of-service/product-details-tos';
import { renderStars } from '@modules/products/components/review-stars';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import useWishlistStore, {
    WishlistProduct,
} from '@store/wishlist/wishlist-store';
import { useWishlistMutations } from '@store/wishlist/mutations/wishlist-mutations';

interface PreviewCheckoutProps {
    productId: string;
    selectedVariantImage: string;
    setSelectedVariantImage: (imageUrl: string) => void;
}

// TODO: REFACTOR THIS COMPONENT, POST DEMO - GN
const PreviewCheckout: React.FC<PreviewCheckoutProps> = ({
    productId,
    selectedVariantImage,
    setSelectedVariantImage,
}) => {
    console.log(
        'PreviewCheckout component rendered with productId:',
        productId
    );

    const currencies = ['eth', 'usdc', 'usdt'];

    const [options, setOptions] = useState<Record<string, string>>({});
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false); // To prevent further navigation after the first one

    const updateOptions = (update: Record<string, string>) => {
        // console.log('options are ', options);
        setOptions({ ...options, ...update });
    };
    let countryCode = useParams().countryCode as string;
    if (process.env.NEXT_PUBLIC_FORCE_COUNTRY)
        countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY;

    const [isWhitelisted, setIsWhitelisted] = useState(false);

    const { productData, variantId, quantity, setVariantId } =
        useProductPreview();
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [usdPrice, setUsdPrice] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<null | Variant>(
        null
    );

    const [averageRating, setAverageRating] = useState<number>(0);
    const [reviewCount, setReviewCount] = useState<number>(0);

    const { preferred_currency_code } = useCustomerAuthStore();
    //console.log('user preferred currency code: ', preferred_currency_code);

    const { whitelist_config, setWhitelistConfig, authData } =
        useCustomerAuthStore();
    const router = useRouter();

    const { wishlist } = useWishlistStore();
    const { addWishlistItemMutation, removeWishlistItemMutation } =
        useWishlistMutations();

    // Clear variantId to avoid referencing ID from the previous product.
    useEffect(() => {
        setVariantId('');
        setSelectedVariant(null);
        setSelectedVariantImage('');
    }, [productData]);

    useEffect(() => {
        const fetchProductReview = async () => {
            const averageRatingResponse = await getAverageRatings(productId);
            const reviewCountResponse = await getReviewCount(productId);

            setAverageRating(averageRatingResponse);
            setReviewCount(reviewCountResponse);
        };

        fetchProductReview();
    }, [productId]);

    const showAvailableCurrencies = () => {
        return (
            <>
                {currencies
                    .filter((currency) => currency !== preferred_currency_code)
                    .map((currency) => (
                        <Image
                            key={currency}
                            className="h-[14px] w-[14px] md:h-[20px] md:w-[20px]"
                            src={currencyIcons[currency ?? 'usdc']}
                            alt={currency ?? 'usdc'}
                        />
                    ))}
            </>
        );
    };

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
                // Initially setting the variantId if it's not set
                setVariantId(productData.variants[0].id);
            } else {
                // Finding the variant that matches the current variantId
                let selectedProductVariant = productData.variants.find(
                    (v: any) => v.id === variantId
                );

                if (selectedProductVariant) {
                    // console.log(`Selected Variant:`, selectedProductVariant);

                    if (selectedProductVariant.metadata?.imgUrl) {
                        // console.log(
                        //     `META: ${selectedProductVariant.metadata?.imgUrl}`
                        // );
                        setSelectedVariantImage(
                            selectedProductVariant.metadata?.imgUrl
                        );
                    }
                    // Update the selected variant in state
                    setSelectedVariant(selectedProductVariant);

                    // Find the price for the selected currency or default to the first price available
                    if (preferred_currency_code === 'eth') {
                        let price;
                        try {
                            price = selectedProductVariant.prices.find(
                                (p: any) => p.currency_code === 'usdc'
                            );
                        } catch (e) {
                            console.log(e);
                        }
                        setUsdPrice(price?.amount ?? 0);
                    }
                    const price = selectedProductVariant.prices.find(
                        (p: any) =>
                            p.currency_code ===
                            (preferred_currency_code ?? 'usdc')
                    );

                    // Update the price state
                    setSelectedPrice(price?.amount ?? 0);
                    console.log(`Updated Price: ${price?.amount}`);
                } else {
                    console.error(`No variant found for ID: ${variantId}`);
                }
            }
        }
    }, [productData, variantId, preferred_currency_code]); // Adding preferred_currency_code to dependencies if it can change

    const handleAddToCart = async (showPopup: boolean = true) => {
        if (!selectedVariant) {
            console.error('Selected variant is null or undefined.');
            return;
        }

        try {
            //TODO: is this used, and why is eth hard-coded?
            await addToCart({
                variantId: selectedVariant.id!,
                quantity: quantity,
                countryCode: countryCode,
            });

            if (showPopup) {
                setCartModalOpen(true);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const whitelistedProductHandler = async () => {
        let data = await getStore(productData.id);
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

    // hook runs once when the component mounts and anytime productData changes
    // it sets the initial options to the first value of each option
    useEffect(() => {
        if (productData?.options) {
            const initialOptions = productData.options.reduce(
                (acc: any, option: any) => {
                    // Assuming each option has a 'values' array and each 'value' object has a 'value' property
                    const firstValue = option.values?.[0]?.value;
                    if (firstValue) {
                        acc[option.id] = firstValue;
                    }
                    return acc;
                },
                {}
            );

            // Only update the state if it's different from the current state to avoid unnecessary re-renders
            if (!isEqual(options, initialOptions)) {
                setOptions(initialOptions);
            }
        }
    }, [productData]);

    const convertToPriceDictionary = (selectedVariant: Variant | null) => {
        const output: { [key: string]: number } = {};
        if (selectedVariant) {
            for (let price of selectedVariant.prices) {
                output[price.currency_code] = price.amount;
            }
        }
        return output;
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
            <Flex gap={{ base: 1, md: 3 }} flexDirection={'column'}>
                <Heading
                    display={{ base: 'block', md: 'none' }}
                    fontSize={'16px'}
                    color="white"
                >
                    {productData.title}
                </Heading>
                <Heading
                    display={{ base: 'none', md: 'block' }}
                    fontSize={'24px'}
                    color="primary.green.900"
                >
                    Listing Price
                </Heading>
                <Flex
                    gap={{ base: '5px', md: '10px' }}
                    mb={{ base: '0', md: '-0.5rem' }}
                >
                    <Image
                        className="h-[14px] w-[14px] md:h-[24px!important] md:w-[24px!important] self-center"
                        src={currencyIcons[preferred_currency_code ?? 'usdc']}
                        alt={preferred_currency_code?.toUpperCase() ?? 'USDC'}
                    />
                    <Heading
                        alignSelf={'center'}
                        fontSize={{ base: '18px', md: '32px' }}
                        color="white"
                    >
                        {formatCryptoPrice(
                            parseFloat(selectedPrice!),
                            preferred_currency_code ?? 'usdc'
                        )}
                    </Heading>

                    {authData.status == 'authenticated' && (
                        <Box
                            display={{ base: 'flex', md: 'none' }}
                            alignSelf={'center'}
                            ml="auto"
                        >
                            {wishlist.products.find(
                                (a) => a.id == productData?.id
                            ) ? (
                                <BiSolidHeart
                                    size={'22px'}
                                    onClick={() => {
                                        removeWishlistItemMutation.mutate({
                                            id: productData?.id ?? '',
                                            description:
                                                productData?.description ?? '',
                                            handle: productData?.handle ?? '',
                                            thumbnail:
                                                productData?.thumbnail ?? '',
                                            variantThumbnail:
                                                selectedVariantImage,
                                            title: productData?.title ?? '',
                                            price: convertToPriceDictionary(
                                                selectedVariant
                                            ),
                                            productVariantId:
                                                wishlist.products.find(
                                                    (i) =>
                                                        i.id == productData?.id
                                                )?.productVariantId || null,
                                        });
                                    }}
                                    className="text-white  cursor-pointer"
                                />
                            ) : (
                                <BiHeart
                                    size={'22px'}
                                    onClick={() => {
                                        addWishlistItemMutation.mutate({
                                            id: productData?.id,
                                            description:
                                                productData?.description ?? '',
                                            handle: productData?.handle ?? '',
                                            thumbnail:
                                                productData?.thumbnail ?? '',
                                            variantThumbnail:
                                                selectedVariantImage,
                                            title: productData?.title ?? '',
                                            price: convertToPriceDictionary(
                                                selectedVariant
                                            ),
                                            productVariantId: variantId || null,
                                        });
                                    }}
                                    className="text-white cursor-pointer"
                                />
                            )}
                        </Box>
                    )}
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
                    {preferred_currency_code === 'eth'
                        ? `≅ $ ${formatCryptoPrice(parseFloat(usdPrice!), 'usdc')}`
                        : `${formatCryptoPrice(parseFloat(selectedPrice!), preferred_currency_code ?? 'usdc')} ${preferred_currency_code?.toUpperCase() ?? 'USDC'}`}
                </Heading>
                {reviewCount > 0 ? (
                    <Flex
                        gap="5px"
                        height="20px"
                        display={{ base: 'flex', md: 'none' }}
                    >
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
                    <Flex
                        gap="5px"
                        height="20px"
                        display={{ base: 'flex', md: 'none' }}
                    >
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
                    {showAvailableCurrencies()}
                </Flex>
            </Flex>
            <Divider
                color="#555555"
                display={{ base: 'block', md: 'none' }}
                mt="1rem"
            />
            {/* Variants */}
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
                    onClick={async () => {
                        if (isLoading || isNavigating) return; // Prevent SPAMMING the button

                        setIsLoading(true);

                        try {
                            if (!inStock && isWhitelisted) {
                                await handleAddToCart(false);
                                router.push('/checkout?step=address');
                                setIsNavigating(true);
                            }
                            if (inStock) {
                                await handleAddToCart(false);
                                router.push('/checkout?step=address');
                                setIsNavigating(true);
                            }
                            if (!inStock && !isWhitelisted) {
                                toast.error('Out of stock');
                            }
                        } catch (error) {
                            console.error('Error adding to cart:', error);
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    borderRadius={'56px'}
                    height={{ base: '40px', md: '55px' }}
                    width="100%"
                    backgroundColor={'primary.green.900'}
                    disabled={isLoading} // Disable button while loading
                    fontSize={{ base: '12px', md: '18px' }}
                >
                    {isLoading ? <Spinner /> : 'Buy Now'}{' '}
                    {/* Show spinner when loading */}
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
                    height={{ base: '40px', md: '55px' }}
                    borderWidth={'1px'}
                    color="primary.green.900"
                    borderColor={'primary.green.900'}
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
                    productName={productData.title}
                    closeModal={() => {
                        setCartModalOpen(false);
                    }}
                />
            </Flex>

            {/* TOS */}
            <TermsOfService />
        </Flex>
    );
};

export default PreviewCheckout;
