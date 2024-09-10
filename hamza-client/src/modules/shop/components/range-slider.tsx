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

const RangeSliderComponent = () => {
    // Using the RangeType for the state
    const [range, setRange] = useState<RangeType>([0, 2000]);

    // Define the type for the values parameter
    const handleRangeChange = (values: number[]) => {
        setRange(values as RangeType);
    };

    return (
        <Flex w="100%" my={'2rem'} flexDirection={'column'}>
            <Box>
                <RangeSlider
                    // eslint-disable-next-line jsx-a11y/aria-proptypes
                    aria-label={['min', 'max']}
                    defaultValue={[0, 2000]}
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
                    h="56px"
                    minW="124px"
                    w={'100%'}
                >
                    <Text mb="5px" color="secondary.davy.900" lineHeight="1">
                        Minimum
                    </Text>
                    <Text fontSize="18px" color="white" lineHeight="1">
                        USD {range[0]}
                    </Text>
                </Flex>
                <Divider
                    borderColor="secondary.davy.900"
                    w={'100%'}
                    mx="0.5rem"
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
                    h="56px"
                    minW="124px"
                    w={'100%'}
                >
                    <Text mb="5px" color="secondary.davy.900" lineHeight="1">
                        Maximum
                    </Text>
                    <Text fontSize="18px" color="white" lineHeight="1">
                        USD {range[1]}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default RangeSliderComponent;
