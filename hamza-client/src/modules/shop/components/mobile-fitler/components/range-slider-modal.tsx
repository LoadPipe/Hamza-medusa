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

// Define a type for the range state
type RangeType = [number, number];

const RangeSliderModal = () => {
    // Using the RangeType for the state
    const [range, setRange] = useState<RangeType>([10, 2000]);

    // Define the type for the values parameter
    const handleRangeChange = (values: number[]) => {
        setRange(values as RangeType);
    };

    return (
        <Box my="1rem">
            <Box mx="0.5rem">
                <RangeSlider
                    // eslint-disable-next-line jsx-a11y/aria-proptypes
                    aria-label={['min', 'max']}
                    defaultValue={[10, 2000]}
                    min={0}
                    max={2000}
                    onChange={handleRangeChange}
                    colorScheme="blue"
                >
                    <RangeSliderTrack bg="primary.indigo.900">
                        <RangeSliderFilledTrack bg="secondary.charcoal.900" />
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
