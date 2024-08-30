'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Stack,
    Divider,
} from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Thumbnail from '@modules/products/components/thumbnail';
import Tweet from '@/components/tweet';
import { useRouter, useParams } from 'next/navigation';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import Image from 'next/image';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { getCompleteTemplate } from '@lib/data/index';
import LineItemPrice from '@modules/common/components/line-item-price';
import { Cart, Order } from '@medusajs/medusa';
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

type SummaryProps = {
    cart_id: string;
    cart: Cart;
    order: Order;
};

interface Product {
    store_id: string;
    massmarket_prod_id: string;
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    title: string;
    subtitle: string | null;
    description: string;
    handle: string;
    is_giftcard: boolean;
    store_name: string;
    unit_price: number;
    currency_code: string;
    order_id: string;
    status: string;
    thumbnail: string;
    weight: number;
    length: number | null;
    height: number | null;
    width: number | null;
    hs_code: string | null;
    origin_country: string | null;
    mid_code: string | null;
    material: string | null;
    collection_id: string | null;
    type_id: string | null;
    discountable: boolean;
    external_id: string | null;
    metadata: Record<string, any> | null;
}

const Summary: React.FC<SummaryProps> = ({ cart_id, cart, order }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();
    const { countryCode } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getCompleteTemplate(cart_id);
                // Assuming the response contains the products array in `response.data.products`
                const fetchedProducts: Product[] = response.cart || [];
                console.log(`Fetched products: ${JSON.stringify(response)}`);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]); // Ensure products is always an array
            }
        };

        fetchProducts();
    }, [cart_id]);

    console.log(products);
    console.log('this is cart', cart.items);
    console.log('this is order', order);

    return (
        <Flex direction="column" width={'100%'}>
            <Text fontWeight={600}>Your Order</Text>
            {products.map((product, index) => (
                <Flex key={product.id} width={'100%'} flexDir={'column'}>
                    <Divider
                        mt="1rem"
                        mb="0.5rem"
                        display={index !== 0 ? 'flex' : 'none'}
                        borderColor={'#555555'}
                    />
                    <Flex mt="1rem" height={'70px'} width={'100%'}>
                        <Flex flexDir={'column'}>
                            <LocalizedClientLink
                                href={`/products/${product.handle}`}
                            >
                                <Flex width={'55px'} height={'55px'}>
                                    <Thumbnail
                                        thumbnail={product.thumbnail}
                                        images={[]}
                                        size="small"
                                    />
                                </Flex>
                            </LocalizedClientLink>
                        </Flex>
                        <Text
                            ml="1rem"
                            maxW={{ base: '200px', md: '336px' }}
                            height={'46px'}
                            width={'100%'}
                            fontSize={{ base: '14px', md: '16px' }}
                            noOfLines={2}
                        >
                            {product.title}
                        </Text>

                        <Flex ml="auto">
                            <Flex
                                height={'22px'}
                                alignItems={'center'}
                                mb="auto"
                            >
                                <Image
                                    className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                    src={currencyIcons[product.currency_code]}
                                    alt={product.currency_code}
                                />
                            </Flex>
                            <Flex
                                height={'22px'}
                                alignItems={'center'}
                                mb="auto"
                            >
                                <Text
                                    ml="0.4rem"
                                    alignSelf={'center'}
                                    fontSize={{ base: '14px', md: '16px' }}
                                >
                                    {formatCryptoPrice(
                                        cart.items[index].quantity *
                                            product.unit_price,
                                        product.currency_code
                                    )}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    {/* Twitter and Quantity */}
                    <Flex alignItems={'center'} height={'50px'} width={'100%'}>
                        <Flex alignSelf={'center'}>
                            <Tweet
                                productHandle={product.handle}
                                isPurchased={true}
                            />
                        </Flex>
                        <Text ml="1rem" fontSize={{ base: '14px', md: '16px' }}>
                            Quantity: {cart.items[index].quantity}
                        </Text>
                    </Flex>
                </Flex>
            ))}
        </Flex>
    );
};

export default Summary;
