'use client';
import React, { useEffect, useState } from 'react';
import { Flex, Text, Heading } from '@chakra-ui/react';
import useProductPreview from '@/zustand/product-preview/product-preview';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const QuantityButton = () => {
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

    //TODO:Get varient id and update quantity.
    return (
        <Flex flexDirection="column" my="1rem">
            <Flex>
                <Heading
                    as="h3"
                    fontSize={{ base: '14px', md: '18px' }}
                    color="white"
                >
                    Quantity &#x2022;
                </Heading>
                <Heading
                    as="h4"
                    ml="5px"
                    mt="auto"
                    fontSize={{ base: '14px', md: '18px' }}
                    color="primary.indigo.900"
                >
                    {`${quantityAvailable} available`}
                </Heading>
            </Flex>

            <Flex mt="1rem" gap="10px">
                <Flex
                    onClick={() => decrementQuantity()}
                    borderWidth={'1px'}
                    padding={'10px'}
                    borderRadius={'8px'}
                    width={'40px'}
                    height={{ base: '33px', md: '50px' }}
                    backgroundColor={{ base: 'black', md: 'transparent' }}
                    borderColor={'#3E3E3E'}
                    cursor={'pointer'}
                    justifyContent={'center'}
                >
                    <Flex
                        alignSelf="center"
                        fontSize={{ base: '12px', md: '20px' }}
                    >
                        <AiOutlineMinus color="white" />
                    </Flex>
                </Flex>

                <Flex
                    borderWidth={'1px'}
                    width={'109px'}
                    height={{ base: '33px', md: '50px' }}
                    justifyContent={'center'}
                    padding={'10px'}
                    borderRadius={'8px'}
                    borderColor={'#3E3E3E'}
                    backgroundColor={{ base: 'black', md: 'transparent' }}
                >
                    <Text
                        fontSize={{ base: '12px', md: '20px' }}
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
                    borderRadius={'8px'}
                    width={'40px'}
                    height={{ base: '33px', md: '50px' }}
                    borderColor={'#3E3E3E'}
                    cursor={'pointer'}
                    justifyContent={'center'}
                    backgroundColor={{ base: 'black', md: 'transparent' }}
                >
                    <Flex
                        alignSelf="center"
                        fontSize={{ base: '12px', md: '20px' }}
                    >
                        <AiOutlinePlus color="white" />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default QuantityButton;
