'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Text,
    Button,
    Flex,
    Box,
    Heading,
    Divider,
    Checkbox,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Link,
    useDisclosure,
} from '@chakra-ui/react';
import useProductPreview from '@/zustand/product-preview/product-preview';
import QuantityButton from '../quantity-button';
import { addToCart, getOrSetCart } from '@modules/cart/actions';
import { useParams, useRouter } from 'next/navigation';
import ReviewStar from '../../../../../../../public/images/products/review-star.svg';
import Image from 'next/image';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import toast from 'react-hot-toast';
import OptionSelect from '../../../option-select';
import { isEqual } from 'lodash';
import CartPopup from '../../../cart-popup';
import {
    getAverageRatings,
    getStore,
    getReviewCount,
    clearCart,
    getProductTermsByProductHandle,
} from '@/lib/server';
import currencyIcons from '@/images/currencies/crypto-currencies';
import Spinner from '@modules/common/icons/spinner';
import TermsOfService from '@/modules/terms-of-service/templates/product-details-tos';
import { renderStars } from '@modules/products/components/review-stars';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import { useWishlistMutations } from '@/zustand/wishlist/mutations/wishlist-mutations';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';
import { Cart } from '@medusajs/medusa';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@lib/schemas/product';
import { setCurrency } from '@/lib/server';

interface PreviewCheckoutProps {
    productId: string;
    selectedVariantImage: string;
    setSelectedVariantImage: (imageUrl: string) => void;
    handle: string;
}

type ProductTerms = {
    terms_and_conditions: string;
    require: boolean;
};

// TODO: REFACTOR THIS COMPONENT, POST DEMO - GN
const PreviewCheckout: React.FC<PreviewCheckoutProps> = ({
    productId,
    selectedVariantImage,
    setSelectedVariantImage,
    handle,
}) => {
    const queryClient = useQueryClient();
    const product = queryClient.getQueryData<Product>(['product', handle]);

    const {
        data: productTermsData,
        isLoading: productTermsIsLoading,
        isError: productTermsIsError,
    } = useQuery<ProductTerms>({
        // Cache / Fetch data based off this unique product_id
        queryKey: ['product_terms', handle],
        queryFn: () => getProductTermsByProductHandle(handle),
        // Only run this query when product
        enabled: !!handle,
    });

    console.log(
        'PreviewCheckout component rendered with productId:',
        productId
    );

    const currencies = ['eth', 'usdc', 'usdt'];

    const [options, setOptions] = useState<Record<string, string>>({});
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState<Cart | null>(null);
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
    const [selectedVariant, setSelectedVariant] = useState<
        Product['variants'][number] | null
    >(null);

    const [averageRating, setAverageRating] = useState<number>(0);
    const [reviewCount, setReviewCount] = useState<number>(0);

    const { preferred_currency_code, setCustomerPreferredCurrency } =
        useCustomerAuthStore();
    //console.log('user preferred currency code: ', preferred_currency_code);

    const { whitelist_config, setWhitelistConfig, authData } =
        useCustomerAuthStore();
    const router = useRouter();

    const { wishlist } = useWishlistStore();
    const { addWishlistItemMutation, removeWishlistItemMutation } =
        useWishlistMutations();

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Clear variantId to avoid referencing ID from the previous product.
    useEffect(() => {
        setVariantId('');
        setSelectedVariant(null);
        setSelectedVariantImage('');
    }, [product, setVariantId, setSelectedVariantImage]);

    useEffect(() => {
        const fetchProductReview = async () => {
            const averageRatingResponse = await getAverageRatings(productId);
            const reviewCountResponse = await getReviewCount(productId);

            setAverageRating(averageRatingResponse);
            setReviewCount(reviewCountResponse);
        };

        fetchProductReview();
    }, [productId]);

    const handleCurrencyIconClick = async (newCurrency: string) => {
        try {
            setCustomerPreferredCurrency(newCurrency);
            await setCurrency(newCurrency, authData.customer_id);
        } catch (error) {
            console.error('Error updating currency:', error);
        }
    };

    const showAvailableCurrencies = () => {
        return (
            <>
                {currencies
                    .filter((currency) => currency !== preferred_currency_code)
                    .map((currency) => (
                        <Image
                            key={currency}
                            className="h-[14px] w-[14px] md:h-[20px] md:w-[20px] cursor-pointer"
                            src={currencyIcons[currency ?? 'usdc']}
                            alt={currency ?? 'usdc'}
                            onClick={() => handleCurrencyIconClick(currency)}
                        />
                    ))}
            </>
        );
    };

    const variantRecord = useMemo(() => {
        const map: Record<string, Record<string, string>> = {};
        if (product && product.variants) {
            for (const variant of product.variants) {
                if (!variant.options || !variant.id) continue;

                const temp: Record<string, string> = {};

                for (const option of variant.options) {
                    temp[option.option_id] = option.value;
                }

                map[variant.id] = temp;
            }

            return map;
        }
    }, [product]);

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
    }, [options, variantRecord, setVariantId]);

    useEffect(() => {
        if (product && product.variants) {
            if (!variantId) {
                // Initially setting the variantId if it's not set
                setVariantId(product.variants[0].id);
            } else {
                // Finding the variant that matches the current variantId
                let selectedProductVariant = product.variants.find(
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
                    const isEthCurrency = preferred_currency_code === 'eth';

                    // Determine the price based on the preferred currency or fallback
                    const price = getPriceByCurrency(
                        selectedProductVariant.prices,
                        isEthCurrency
                            ? 'eth'
                            : preferred_currency_code ?? 'usdc'
                    );

                    // Update USD price if the preferred currency is 'eth'
                    if (isEthCurrency) {
                        setUsdPrice(
                            getPriceByCurrency(
                                selectedProductVariant.prices,
                                'usdc'
                            )
                        );
                    }

                    // Update the selected price
                    setSelectedPrice(price);
                } else {
                    console.error(`No variant found for ID: ${variantId}`);
                }
            }
        }
    }, [product, variantId, preferred_currency_code]); // Adding preferred_currency_code to dependencies if it can change

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
    }, [productData.id]);

    const convertToPriceDictionary = (
        selectedVariant: Product['variants'][number] | null
    ) => {
        const output: { [key: string]: number } = {};
        if (selectedVariant) {
            for (let price of selectedVariant.prices) {
                output[price.currency_code] = price.amount;
            }
        }
        return output;
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                let cart = await getOrSetCart(countryCode);
                setCart(cart);

                //Do cart house cleaning, see if its an old cart
                if (cart.completed_at !== null) {
                    await clearCart();
                    cart = await getOrSetCart(countryCode).then((cart) => {
                        // console.log('New cart retrieved or set:', cart);
                        return cart;
                    });
                    setCart(cart);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };
        fetchCart();
    }, [countryCode]);

    if (!product) {
        return <Spinner />;
    }

    const whitelistedProductHandler = async () => {
        let data = await getStore(product?.id);
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

    const getValidValuesForOption = (optionId: string): string[] => {
        const mainOptionId = productData.options[0]?.id;

        // For the main variant, show all available values.
        if (optionId === mainOptionId) {
            const mainOption = productData.options.find(
                (opt: any) => opt.id === optionId
            );
            return mainOption
                ? mainOption.values.map((val: any) => val.value)
                : [];
        }

        // For sub variant options, filter based on the main variant selection.
        const mainSelection = options[mainOptionId];
        const validValues = new Set<string>();
        productData.variants.forEach((variant: any) => {
            // Only consider variants that match the main variant selection.
            const mainVariantOption = variant.options.find(
                (opt: any) => opt.option_id === mainOptionId
            );
            if (
                mainVariantOption &&
                mainVariantOption.value === mainSelection
            ) {
                // Find the value for the current sub variant option.
                const subVariantOption = variant.options.find(
                    (opt: any) => opt.option_id === optionId
                );
                if (subVariantOption) {
                    validValues.add(subVariantOption.value);
                }
            }
        });

        return Array.from(validValues);
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
            className="preview-checkout"
        >
            <Flex gap={{ base: 1, md: 3 }} flexDirection={'column'}>
                <Heading
                    display={{ base: 'block', md: 'none' }}
                    fontSize={'16px'}
                    color="white"
                >
                    {product.title}
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
                                (a) => a.id == product?.id
                            ) ? (
                                <BiSolidHeart
                                    size={'22px'}
                                    onClick={() => {
                                        removeWishlistItemMutation.mutate({
                                            id: product?.id ?? '',
                                            description:
                                                product?.description ?? '',
                                            handle: product?.handle ?? '',
                                            thumbnail: product?.thumbnail ?? '',
                                            variantThumbnail:
                                                selectedVariantImage,
                                            title: product?.title ?? '',
                                            price: convertToPriceDictionary(
                                                selectedVariant
                                            ),
                                            productVariantId:
                                                wishlist.products.find(
                                                    (i) => i.id == product?.id
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
                                            id: product?.id,
                                            description:
                                                product?.description ?? '',
                                            handle: product?.handle ?? '',
                                            thumbnail: product?.thumbnail ?? '',
                                            variantThumbnail:
                                                selectedVariantImage,
                                            title: product?.title ?? '',
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
                        ? `≅ $${formatCryptoPrice(parseFloat(usdPrice!), 'usdc')} USD`
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
                                        const validValues =
                                            getValidValuesForOption(option.id);

                                        const updatedValues = option.values
                                            .map((val: any) => {
                                                const matchingVariant =
                                                    productData.variants.find(
                                                        (v: any) =>
                                                            v.id ===
                                                            val.variant_id
                                                    );

                                                return {
                                                    ...val,
                                                    variant_rank:
                                                        matchingVariant?.variant_rank ??
                                                        null,
                                                };
                                            })
                                            .filter((val: any) =>
                                                validValues.includes(val.value)
                                            );

                                        const augmentedOption = {
                                            ...option,
                                            values: updatedValues,
                                        };
                                        return (
                                            <div key={option.id}>
                                                <OptionSelect
                                                    option={augmentedOption}
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

                {productTermsData?.require && (
                    <>
                        <Flex align="start" mt={4} mb={4}>
                            <Checkbox
                                isChecked={acceptedTerms}
                                onChange={(e) =>
                                    setAcceptedTerms(e.target.checked)
                                }
                                colorScheme="green"
                                mr={2}
                                mt={1}
                            />
                            <Text
                                color="white"
                                fontSize="sm"
                                fontWeight="bold"
                                marginBottom="10px"
                            >
                                You must accept the{' '}
                                {productTermsData?.terms_and_conditions ? (
                                    <Link
                                        color="primary.green.900"
                                        onClick={onOpen}
                                        textDecoration="underline"
                                    >
                                        Terms and Conditions
                                    </Link>
                                ) : (
                                    'Terms and Conditions'
                                )}{' '}
                                before you can purchase this product.
                            </Text>
                        </Flex>

                        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
                            <ModalOverlay />
                            <ModalContent
                                bg="#181818"
                                my="4" // Add small margin top/bottom
                                maxH={{
                                    base: 'calc(100vh - 32px)',
                                    md: 'calc(100vh - 64px)',
                                }} // Adjust height based on screen size
                                h={{
                                    base: 'calc(100vh - 32px)',
                                    md: 'calc(100vh - 64px)',
                                }}
                            >
                                <ModalHeader color="white">
                                    Terms and Conditions
                                </ModalHeader>
                                <ModalCloseButton color="white" />
                                <ModalBody
                                    color="white"
                                    pb={6}
                                    mb={6}
                                    mr={6}
                                    overflowY="auto" // Enable vertical scrolling
                                    css={{
                                        '&::-webkit-scrollbar': {
                                            width: '4px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: '#2D3748',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: '#4A5568',
                                            borderRadius: '24px',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            '& h1, & h2, & h3, & h4, & h5, & h6':
                                                {
                                                    fontSize: 'lg',
                                                    fontWeight: 'bold',
                                                    mb: 2,
                                                    mt: 4,
                                                },
                                            '& p': {
                                                mb: 2,
                                            },
                                            '& ul, & ol': {
                                                pl: 4,
                                                mb: 3,
                                            },
                                            '& li': {
                                                mb: 1,
                                            },
                                            '& a': {
                                                color: 'primary.green.900',
                                                textDecoration: 'underline',
                                            },
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: productTermsData.terms_and_conditions,
                                        }}
                                    />
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </>
                )}

                <Button
                    display={{ base: 'none', md: 'flex' }}
                    onClick={async () => {
                        if (productTermsData?.require && !acceptedTerms) return;
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
                    disabled={
                        isLoading ||
                        !cart ||
                        (productTermsData?.require && !acceptedTerms)
                    } // Disable button while loading or if cart doesn't exist
                    fontSize={{ base: '12px', md: '18px' }}
                    className="buy-now-button"
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
                    className="preview-checkout-add-to-cart"
                    display={{ base: 'none', md: 'flex' }}
                    disabled={
                        (!inStock && !isWhitelisted) ||
                        !cart ||
                        (productTermsData?.require && !acceptedTerms)
                    }
                    onClick={() => {
                        if (productTermsData?.require && !acceptedTerms) return;
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
                    mt="1rem"
                />

                {/* Mobile Sticky Footer */}
                <Flex
                    mx="-1rem"
                    gap={2}
                    flexDirection={'row'}
                    position="fixed"
                    bottom="0"
                    height={productTermsData?.require ? '150px' : '90px'}
                    width="100%"
                    backgroundColor="black"
                    zIndex="10"
                    display={{ base: 'flex', md: 'none' }} // Only show on mobile
                    padding="5"
                >
                    {productTermsData?.require && (
                        <Flex align="center" mb={2} px={2}>
                            <Checkbox
                                isChecked={acceptedTerms}
                                onChange={(e) =>
                                    setAcceptedTerms(e.target.checked)
                                }
                                colorScheme="green"
                                mr={2}
                                marginBottom="20px"
                            />
                            <Text
                                color="white"
                                fontSize="xs"
                                marginBottom="10px"
                                fontWeight="bold"
                            >
                                You must accept the{' '}
                                {productTermsData?.terms_and_conditions ? (
                                    <Link
                                        color="primary.green.900"
                                        onClick={onOpen}
                                        textDecoration="underline"
                                    >
                                        Terms and Conditions
                                    </Link>
                                ) : (
                                    'Terms and Conditions'
                                )}{' '}
                                before you can purchase this product.
                                <br />
                            </Text>
                        </Flex>
                    )}
                    <Flex gap={2}>
                        <Button
                            disabled={
                                (!inStock && !isWhitelisted) ||
                                !cart ||
                                (productTermsData?.require && !acceptedTerms)
                            }
                            onClick={() => {
                                if (productTermsData?.require && !acceptedTerms)
                                    return;
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
                            width={'100%'}
                            borderRadius={'6px'}
                            height={'50px'}
                            borderWidth={'1px'}
                            color="white"
                            border="none"
                            backgroundColor={'#121212'}
                            data-cy="add-to-cart-button"
                            fontSize={'12px'}
                            _hover={{
                                color: 'black',
                                bg: 'white',
                                borderColor: 'white',
                            }}
                        >
                            <Flex
                                flexDir={'column'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <MdOutlineShoppingCart size={14} />

                                {!inStock && isWhitelisted
                                    ? 'Add to cart'
                                    : inStock
                                      ? 'Add to Cart'
                                      : 'Out of Stock'}
                            </Flex>
                        </Button>

                        <Button
                            onClick={async () => {
                                if (productTermsData?.require && !acceptedTerms)
                                    return;
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
                                    console.error(
                                        'Error adding to cart:',
                                        error
                                    );
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            height={'50px'}
                            width={'100%'}
                            borderRadius={'60px'}
                            backgroundColor={'primary.green.900'}
                            disabled={
                                isLoading ||
                                !cart ||
                                (productTermsData?.require && !acceptedTerms)
                            }
                            fontSize={{ base: '12px', md: '18px' }}
                        >
                            {isLoading ? (
                                <Spinner />
                            ) : (
                                <Flex flexDir={'column'}>
                                    <Text fontSize={'12px'}>Buy Now</Text>
                                    <Flex flexDir={'row'}>
                                        <Image
                                            className="h-[14px] w-[14px] md:h-[24px!important] md:w-[24px!important] self-center mr-1"
                                            src={
                                                currencyIcons[
                                                    preferred_currency_code ??
                                                        'usdc'
                                                ]
                                            }
                                            alt={
                                                preferred_currency_code?.toUpperCase() ??
                                                'USDC'
                                            }
                                        />
                                        <Text
                                            alignSelf={'center'}
                                            fontSize={'14px'}
                                            color="black"
                                        >
                                            {formatCryptoPrice(
                                                parseFloat(selectedPrice!),
                                                preferred_currency_code ??
                                                    'usdc'
                                            )}
                                        </Text>
                                    </Flex>
                                </Flex>
                            )}
                        </Button>
                    </Flex>
                </Flex>
                <CartPopup
                    open={cartModalOpen}
                    productName={product.title}
                    closeModal={() => {
                        setCartModalOpen(false);
                    }}
                />
            </Flex>

            {/* TOS */}
            <TermsOfService metadata={product.metadata} />
        </Flex>
    );
};

export default PreviewCheckout;
