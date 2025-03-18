import React, { useState } from 'react';
import { Flex, Text, Box, Image, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

type StoreProps = {
    storeName: string;
    storeHandle: string;
    icon: string;
};

const StoreBanner = (props: StoreProps) => {
    const router = useRouter();
    const { countryCode } = useParams();
    const [isLoading, setIsLoading] = useState(true); // State to track loading

    const navigateToVendor = () => {
        router.push(`/${countryCode}/store/${props.storeHandle}`);
    };

    return (
        <Flex
            backgroundColor={'#121212'}
            maxWidth="1280px"
            width="100%"
            height={{ base: '110px', md: '165.78px' }}
            borderRadius={'16px'}
            p={{ base: '1rem', md: '2rem' }}
            flexWrap="wrap" // Ensures wrapping on mobile
            className="store-banner"
            justifyContent="space-between" // Ensures separation between text & buttons
        >
            <Flex gap={{ base: '10px', md: '20px' }}>
                <Flex flexShrink={0} alignSelf="center">
                    {!props.icon && isLoading ? (
                        <Skeleton
                            boxSize={{ base: '36.5px', md: '72px' }}
                            borderRadius="full"
                            startColor="gray.700"
                            endColor="gray.500"
                        />
                    ) : (
                        <Image
                            src={props.icon}
                            alt={`Store Logo`}
                            boxSize={{ base: '36.5px', md: '72px' }}
                            borderRadius="full"
                            onLoad={() => setIsLoading(false)} // Set loading to false when the image is loaded
                            onError={() => setIsLoading(false)} // Handle load failure gracefully
                        />
                    )}
                </Flex>

                {/* Middle Section with Text */}
                <Flex
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'flex-start'}
                >
                    <Flex gap={{ base: '5px', md: '10px' }}>
                        <Text
                            fontSize={{ base: '14px', md: '24px' }}
                            color="white"
                            fontWeight="bold"
                            noOfLines={1}
                        >
                            {props.storeName}
                        </Text>
                        <Flex
                            display={'flex'}
                            alignSelf={'center'}
                            fontSize={{ base: '10px', md: '20px' }}
                        >
                            <FaCheckCircle color="#3196DF" />
                        </Flex>
                    </Flex>

                    <Flex color="#555555" gap={'7px'}>
                        <Box
                            alignSelf={'center'}
                            width={{ base: '2.53px', md: '7.33px' }}
                            height={{ base: '2.53px', md: '7.33px' }}
                            borderRadius={'full'}
                            backgroundColor="primary.green.900"
                        />
                        <Text fontSize={{ base: '10px', md: '16px' }}>
                            Online
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            <Flex
                ml={{ base: '0', md: 'auto' }}
                alignSelf="center"
                flexDirection={'column'}
                gap={{ base: '8px', md: '16px' }}
            >
                <Flex
                    flexDirection={{ base: 'row', md: 'column' }} // Column for mobile, Row for desktop
                    gap={{ base: '8px', md: '16px' }}
                    justifyContent="center"
                    pt={{ base: '12px', md: '0' }} // Adds top padding only on mobile
                    // mb={{ base: '12px', md: '0' }} // Adds bottom padding only on mobile
                >
                    <a
                        href={
                            process.env.NEXT_PUBLIC_HAMZA_CHAT_LINK ??
                            'https://support.hamza.market/help/1568263160'
                        }
                        target="_blank"
                    >
                        <Flex
                            display={{ base: 'flex' }}
                            height={{ base: '33px', md: '47px' }}
                            width={{ base: '120px', md: '190px' }}
                            borderColor={'primary.green.900'}
                            borderWidth={'1px'}
                            borderRadius={'37px'}
                            justifyContent={'center'}
                            cursor={'pointer'}
                            fontSize={{ base: '12px', md: '16px' }}
                        >
                            <Text
                                alignSelf={'center'}
                                color="primary.green.900"
                                fontWeight={700}
                            >
                                Chat with them
                            </Text>
                        </Flex>
                    </a>
                    <Flex
                        onClick={navigateToVendor}
                        height={{ base: '33px', md: '47px' }}
                        width={{ base: '120px', md: '190px' }}
                        borderColor={'transparent'}
                        backgroundColor={'primary.green.900'}
                        borderWidth={'1px'}
                        borderRadius={'37px'}
                        justifyContent={'center'}
                        cursor={'pointer'}
                    >
                        <Text
                            alignSelf={'center'}
                            color="#121212"
                            fontWeight={700}
                            fontSize={{ base: '12px', md: '16px' }}
                        >
                            Visit Store
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default StoreBanner;
