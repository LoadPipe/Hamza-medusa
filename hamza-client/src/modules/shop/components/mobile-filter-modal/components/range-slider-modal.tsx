import React, { useState } from 'react';
import {
    Box,
    Text,
    Flex,
    Divider,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
} from '@chakra-ui/react';
import useHomeModalFilter from '@/zustand/home-page/home-filter/home-filter';
import {
    FILTER_PRICE_RANGE_MAX,
    FILTER_PRICE_RANGE_MIN,
} from '@/zustand/products/filter/use-unified-filter-store';

// Define a type for the range state
type RangeType = [number, number];

type RangeSliderProps = {
    range: [number, number];
    setRange: (range: [number, number]) => void;
};

const RangeSliderModal: React.FC<RangeSliderProps> = ({ range, setRange }) => {
    const handleRangeChange = (values: number[]) => {
        setRange(values as RangeType);
        console.log('Range Slider range', range);
    };

    return (
        <Box my="1rem" px={'1rem'}>
            <Box mx="0.5rem">
                <RangeSlider
                    // eslint-disable-next-line jsx-a11y/aria-proptypes
                    aria-label={['min', 'max']}
                    value={range}
                    min={FILTER_PRICE_RANGE_MIN}
                    max={FILTER_PRICE_RANGE_MAX}
                    onChange={handleRangeChange}
                    colorScheme="blue"
                >
                    <RangeSliderTrack bg="secondary.charcoal.900">
                        <RangeSliderFilledTrack bg="primary.indigo.900" />
                    </RangeSliderTrack>
                    <RangeSliderThumb
                        index={0}
                        boxSize={5}
                        bg="primary.indigo.900"
                    />
                    <RangeSliderThumb
                        index={1}
                        boxSize={5}
                        bg="primary.indigo.900"
                        className="range-slider-thumb-right"
                    />
                </RangeSlider>
            </Box>

            {/* Display for min and max values */}
            <Flex mt="1rem" justifyContent="center" alignItems={'center'}>
                <Flex
                    borderColor="secondary.davy.900"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    mr="auto"
                    borderRadius="12px"
                    borderWidth="1px"
                    h="69px"
                    width={'100%'}
                >
                    <Text
                        ml="1rem"
                        alignSelf={'flex-start'}
                        color="secondary.davy.900"
                        lineHeight="1"
                        mb="5px"
                    >
                        Minimum
                    </Text>
                    <Text
                        ml="1rem"
                        alignSelf={'flex-start'}
                        fontSize="18px"
                        color="white"
                        lineHeight="1"
                    >
                        USD {range[0]}
                    </Text>
                </Flex>
                <Divider
                    borderColor="secondary.davy.900"
                    minW="26.6px"
                    maxW="26.6px"
                    width={'100%'}
                    mx="1rem"
                    alignSelf="center"
                />
                <Flex
                    borderColor="secondary.davy.900"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    ml="auto"
                    borderRadius="12px"
                    borderWidth="1px"
                    h="69px"
                    width={'100%'}
                >
                    <Text
                        ml="1rem"
                        alignSelf={'flex-start'}
                        color="secondary.davy.900"
                        lineHeight="1"
                        mb="5px"
                    >
                        Maximum
                    </Text>
                    <Text
                        ml="1rem"
                        alignSelf={'flex-start'}
                        fontSize="18px"
                        color="white"
                        lineHeight="1"
                    >
                        USD {range[1]}
                    </Text>
                </Flex>
            </Flex>
        </Box>
    );
};

export default RangeSliderModal;
