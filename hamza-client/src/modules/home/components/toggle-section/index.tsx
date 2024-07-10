import React from 'react';
import {
    Box,
    Flex,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import toggle_1 from '../../../../../public/images/toggle_logos/toggle_1.png';
import toggle_2 from '../../../../../public/images/toggle_logos/toggle_2.png';
import toggle_3 from '../../../../../public/images/toggle_logos/toggle_3.png';

import Image from 'next/image';
const ToggleSelection = () => {
    return (
        <Flex
            className="font-sora"
            maxW="100%"
            bg="black"
            color="white"
            direction={{ base: 'column', lg: 'row' }}
            justifyContent="space-between"
            alignItems="start"
            p={5}
        >
            <Box
                flex="1"
                p={5}
                bgGradient="linear(to-l, #53594A 70%, #2C272D 100%)" // This creates a gradient from right to left
                borderRadius="2xl"
                boxShadow="lg"
                marginLeft={{ lg: 4 }}
                marginRight={{ lg: 4 }}
                color="white"
            >
                <Tabs
                    isFitted
                    variant="enclosed"
                    colorScheme="orange"
                    orientation="vertical"
                >
                    <Flex direction="column" alignItems="flex-start">
                        <TabList>
                            <Tab
                                borderRadius="full"
                                border="1px solid "
                                p={4}
                                m={8}
                                fontWeight="bold" // Makes text bold for all tabs
                                _selected={{ bg: '#94D42A', color: 'black' }} // Styling for the selected tab
                            >
                                Buy
                            </Tab>
                            <Tab
                                borderRadius="full"
                                border="1px solid "
                                p={4}
                                m={8}
                                fontWeight="bold" // Makes text bold for all tabs
                                _selected={{ bg: '#94D42A', color: 'black' }} // Adjusted to 'black' to keep consistency
                            >
                                Sell
                            </Tab>
                            <Tab
                                borderRadius="full"
                                border="1px solid "
                                p={4}
                                m={8}
                                fontWeight="bold" // Makes text bold for all tabs
                                _selected={{ bg: '#94D42A', color: 'black' }} // Styling for the selected tab
                            >
                                Own
                            </Tab>
                        </TabList>
                    </Flex>
                    <TabPanels mx={12}>
                        <TabPanel mx={12}>
                            <Flex
                                mb={12}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                height="100%"
                            >
                                <Text fontSize="xs" color={'#94D42A'}>
                                    JOIN THE MOVEMENT
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    {' '}
                                    Buy products as a Community
                                </Text>
                            </Flex>
                            <Flex
                                mt={12}
                                mb={4}
                                mx={12}
                                justifyContent="space-between"
                            >
                                <Image
                                    src={toggle_1}
                                    width={80}
                                    height={80}
                                    alt={'toggle_1 image'}
                                />
                                <Image
                                    src={toggle_2}
                                    width={80}
                                    height={80}
                                    alt={'toggle_1 image'}
                                />
                                <Image
                                    src={toggle_3}
                                    width={80}
                                    height={80}
                                    alt={'toggle_1 image'}
                                />
                            </Flex>
                            <Flex mx={12} justifyContent="space-between">
                                <Text fontWeight="bold" color={'#94D42A'}>
                                    Dummy text Loren Ipsum
                                </Text>
                                <Text fontWeight="bold" color={'#94D42A'}>
                                    Dummy text Loren Ipsum
                                </Text>
                                <Text fontWeight="bold" color={'#94D42A'}>
                                    Dummy text Loren Ipsum
                                </Text>
                            </Flex>
                            <Flex mx={12} justifyContent="space-between">
                                <Text fontWeight="semi">
                                    Dummy text Loren Ipsum
                                </Text>
                                <Text fontWeight="semi">
                                    Dummy text Loren Ipsum
                                </Text>
                                <Text fontWeight="semi">
                                    Dummy text Loren Ipsum
                                </Text>
                            </Flex>
                            <Flex mx={12} justifyContent="space-between">
                                <Text fontWeight="italic">
                                    Dummy text Loren Ipsum
                                </Text>
                                <Text fontWeight="italic">
                                    Dummy text Loren Ipsum
                                </Text>
                                <Text fontWeight="italic">
                                    Dummy text Loren Ipsum
                                </Text>
                            </Flex>
                        </TabPanel>

                        <TabPanel>
                            <Flex
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                height="100%"
                            >
                                <Text fontSize="xs" color={'#94D42A'}>
                                    JOIN THE MOVEMENT
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    {' '}
                                    Buy products as a Community
                                </Text>
                            </Flex>
                        </TabPanel>
                        <TabPanel>
                            <Flex
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                height="100%"
                            >
                                <Text fontSize="xs" color={'#94D42A'}>
                                    JOIN THE MOVEMENT
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    {' '}
                                    Buy products as a Community
                                </Text>
                            </Flex>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Flex>
    );
};

export default ToggleSelection;
