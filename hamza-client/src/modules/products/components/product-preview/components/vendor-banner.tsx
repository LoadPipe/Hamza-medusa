import React from 'react';
import { Flex, Text, Box, Image } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

type VendorProps = {
    vendor: string;
};

const VendorBanner = (props: VendorProps) => {
    const router = useRouter();
    const { countryCode } = useParams();

    // console.log(`vendor name is ${props.vendor}`);
    const navigateToVendor = () => {
        router.push(`/${countryCode}/vendor/${props.vendor}`);
    };

    return (
        <Flex
            backgroundColor={'#121212'}
            maxWidth="1280px"
            width="100%"
            height={{ base: '99px', md: '165.78px' }}
            borderRadius={'16px'}
            p={{ base: '1rem', md: '2rem' }}
        >
            <Flex
                flexShrink={0}
                mr={{ base: '0.5rem', md: '1rem' }}
                alignSelf={'center'}
            >
                <Image
                    src="https://images.hamza.biz/Legendary/wall/wall1.jpeg"
                    alt="Light Logo"
                    boxSize={{ base: '36.5px', md: '72px' }}
                    borderRadius="full"
                />
            </Flex>

            {/* Middle Section with Text */}
            <Flex alignSelf={'center'} flexDirection={'column'}>
                <Flex gap={{ base: '5px', md: '10px' }}>
                    <Text
                        fontSize={{ base: '14px', md: '24px' }}
                        color="white"
                        fontWeight="bold"
                    >
                        {props.vendor}
                    </Text>
                    <Flex
                        alignSelf={'center'}
                        fontSize={{ base: '10px', md: '23.05px' }}
                    >
                        <FaCheckCircle color="#3196DF" />
                    </Flex>
                </Flex>
                <Flex>
                    <Text
                        fontSize={{ base: '10px', md: '16px' }}
                        color="gray.400"
                    >
                        Flagship Store{' '}
                        <Box as="span" color="green.500" mx="2">
                            •
                        </Box>{' '}
                        Online
                    </Text>
                </Flex>
            </Flex>

            <Flex
                ml="auto"
                alignSelf="center"
                flexDirection={'column'}
                gap={'16px'}
            >
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    height={{ base: '33px', md: '47px' }}
                    width={{ base: '120px', md: '190px' }}
                    borderColor={'primary.indigo.900'}
                    borderWidth={'1px'}
                    borderRadius={'37px'}
                    justifyContent={'center'}
                    cursor={'pointer'}
                    fontSize={{ base: '12px', md: '16px' }}
                >
                    <Text alignSelf={'center'} color="primary.indigo.900">
                        Chat with them
                    </Text>
                </Flex>
                <Flex
                    height={{ base: '33px', md: '47px' }}
                    width={{ base: '120px', md: '190px' }}
                    borderColor={'transparent'}
                    backgroundColor={'primary.indigo.900'}
                    borderWidth={'1px'}
                    borderRadius={'37px'}
                    justifyContent={'center'}
                    cursor={'pointer'}
                >
                    <Text
                        onClick={navigateToVendor}
                        alignSelf={'center'}
                        color="white"
                        fontSize={{ base: '12px', md: '16px' }}
                    >
                        Visit Store
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default VendorBanner;
