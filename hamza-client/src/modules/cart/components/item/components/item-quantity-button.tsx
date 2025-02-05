'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

type ItemQuantityButtonProps = {
    value?: number;
    min?: number;
    max?: number;
    onChange?: (valueAsNumber: number) => void;
};

const ItemQuantityButton = forwardRef<
    HTMLInputElement,
    ItemQuantityButtonProps
>(({ value = 1, min = 1, max = 100, onChange }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    const changeQuantity = (newQuantity: number) => {
        if (onChange && newQuantity >= min && newQuantity <= max) {
            onChange(newQuantity);
        }
    };

    return (
        <Flex flexDirection="column" ml={{ base: '0', md: 'auto' }}>
            <Flex gap="10px">
                {/* Decrement Button */}
                <Flex
                    onClick={() => changeQuantity((value || min) - 1)}
                    borderWidth="1px"
                    padding="10px"
                    width={{ base: '33px', md: '24px' }}
                    height={{ base: '33px', md: '24px' }}
                    backgroundColor={{ base: 'black', md: 'transparent' }}
                    borderColor="#3E3E3E"
                    cursor={value && value > min ? 'pointer' : 'not-allowed'}
                    justifyContent="center"
                    opacity={value && value > min ? 1 : 0.5}
                    className="cart-item-quantity-button-decrement"
                >
                    <Flex
                        alignSelf="center"
                        fontSize={{ base: '12px', md: '14px' }}
                    >
                        <AiOutlineMinus color="white" />
                    </Flex>
                </Flex>

                {/* Quantity Display */}
                <Flex
                    borderWidth="1px"
                    width="48px"
                    height={{ base: '33px', md: '24px' }}
                    justifyContent="center"
                    padding={'10px'}
                    borderColor="#3E3E3E"
                    backgroundColor={{ base: 'black', md: 'transparent' }}
                >
                    <Text
                        fontSize={{ base: '12px', md: '14px' }}
                        color="white"
                        alignSelf={'center'}
                        lineHeight={1}
                        className='cart-item-quantity-display'
                    >
                        {value}
                    </Text>
                </Flex>

                {/* Increment Button */}
                <Flex
                    onClick={() => changeQuantity((value || min) + 1)}
                    borderWidth="1px"
                    padding="10px"
                    width={{ base: '33px', md: '24px' }}
                    height={{ base: '33px', md: '24px' }}
                    borderColor="#3E3E3E"
                    cursor={value && value < max ? 'pointer' : 'not-allowed'}
                    justifyContent="center"
                    backgroundColor={{ base: 'black', md: 'transparent' }}
                    opacity={value && value < max ? 1 : 0.5}
                    className='cart-item-quantity-button-increment'
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
});

ItemQuantityButton.displayName = 'ItemQuantityButton';

export default ItemQuantityButton;
