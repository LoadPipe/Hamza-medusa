'use client';

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import {
    Box,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { debounce } from 'lodash';

type NativeSelectProps = {
    defaultValue?: number;
    value?: number;
    min?: number;
    max?: number;
    onChange?: (valueAsString: string, valueAsNumber: number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

const CartItemSelect = forwardRef<HTMLInputElement, NativeSelectProps>(
    (
        { defaultValue = 1, value, min = 1, max = 100, onChange, ...props },
        ref
    ) => {
        const innerRef = useRef<HTMLInputElement>(null);
        const [isPlaceholder, setIsPlaceholder] = useState(false);

        useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
            ref,
            () => innerRef.current
        );

        useEffect(() => {
            if (innerRef.current && innerRef.current.value === '') {
                setIsPlaceholder(true);
            } else {
                setIsPlaceholder(false);
            }
        }, [innerRef.current?.value]);

        return (
            <Box
                display="flex"
                alignItems="center"
                borderRadius="md"
                padding={[2, 4]}
                borderColor={isPlaceholder ? 'gray.400' : 'gray.600'}
                minW={['16', '20']}
                maxW={['20', '24']}
                onFocus={() => innerRef.current?.focus()}
                onBlur={() => innerRef.current?.blur()}
            >
                <NumberInput
                    size={['md', 'lg']}
                    maxW={['16', '32']}
                    minW={['16', '20']}
                    defaultValue={defaultValue}
                    value={value}
                    min={min}
                    max={max}
                    onChange={(valueAsString, valueAsNumber) => {
                        // Only trigger onChange if the new value is greater than or equal to the minimum
                        if (onChange) {
                            onChange(valueAsString, valueAsNumber);
                        }
                    }}
                >
                    <NumberInputField
                        readOnly
                        ref={innerRef}
                        {...props}
                        textAlign="left"
                        color={'white'}
                        fontSize={['lg', 'xl']}
                        minW="48px"
                        pl="8px"
                    />
                    <NumberInputStepper>
                        <NumberIncrementStepper
                            color="white"
                            _hover={{ bg: 'green.500', color: 'white' }}
                            _active={{ bg: 'green.600' }}
                            _focus={{ boxShadow: 'outline' }}
                        >
                            <Box
                                as="span"
                                fontSize={['14px', '18px']}
                                fontWeight="bold"
                            >
                                +
                            </Box>
                        </NumberIncrementStepper>
                        <NumberDecrementStepper
                            color="white"
                            _hover={{ bg: 'red.500', color: 'white' }}
                            _active={{ bg: 'red.600' }}
                            _focus={{ boxShadow: 'outline' }}
                        >
                            <Box
                                as="span"
                                fontSize={['14px', '18px']}
                                fontWeight="bold"
                            >
                                -
                            </Box>
                        </NumberDecrementStepper>
                    </NumberInputStepper>
                </NumberInput>
            </Box>
        );
    }
);

CartItemSelect.displayName = 'CartItemSelect';

export default CartItemSelect;
