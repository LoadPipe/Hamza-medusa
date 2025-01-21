'use client';
import React, { useEffect, useState } from 'react';
import { Flex, Text, Heading } from '@chakra-ui/react';
import useProductPreview from '@/zustand/product-preview/product-preview';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const ItemQuantityButton = () => {
    const [quantityAvailable, setQuantityAvailable] = useState('');
    const { productData, setProductData, quantity, setQuantity, variantId } =
        useProductPreview();

    let selectedProductVariant =
        productData &&
        productData.variants &&
        productData.variants.find((a: any) => a.id == variantId);

    useEffect(() => {
        const updateQuantityButton = async () => {
            if (
                productData &&
                productData.variants &&
                productData.variants.length > 0 &&
                selectedProductVariant
            ) {
                setQuantityAvailable(selectedProductVariant.inventory_quantity);
            }
        };

        updateQuantityButton();
    }, [productData, selectedProductVariant]);

    const incrementQuantity = () => {
        if (quantity < Number(quantityAvailable)) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <Flex flexDirection="column">
            <Flex gap="10px">
                <Flex
                    onClick={() => decrementQuantity()}
                    borderWidth={'1px'}
                    padding={'10px'}
                    width={'24px'}
                    height={{ base: '33px', md: '24px' }}
                    backgroundColor={{ base: 'black', md: 'transparent' }}
                    borderColor={'#3E3E3E'}
                    cursor={'pointer'}
                    justifyContent={'center'}
                >
                    <Flex
                        alignSelf="center"
                        fontSize={{ base: '12px', md: '14px' }}
                    >
                        <AiOutlineMinus color="white" />
                    </Flex>
                </Flex>

                <Flex
                    borderWidth={'1px'}
                    width={'48px'}
                    height={{ base: '33px', md: '24px' }}
                    justifyContent={'center'}
                    padding={'10px'}
                    borderColor={'#3E3E3E'}
                    backgroundColor={{ base: 'black', md: 'transparent' }}
                >
                    <Text
                        fontSize={{ base: '12px', md: '14px' }}
                        alignSelf={'center'}
                        color="white"
                    >
                        {quantity}
                    </Text>
                </Flex>

                <Flex
                    onClick={() => incrementQuantity()}
                    borderWidth={'1px'}
                    padding={'10px'}
                    width={'24px'}
                    height={{ base: '33px', md: '24px' }}
                    borderColor={'#3E3E3E'}
                    cursor={'pointer'}
                    justifyContent={'center'}
                    backgroundColor={{ base: 'black', md: 'transparent' }}
                >
                    <Flex
                        alignSelf="center"
                        fontSize={{ base: '12px', md: '14px' }}
                    >
                        <AiOutlinePlus color="white" />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ItemQuantityButton;
