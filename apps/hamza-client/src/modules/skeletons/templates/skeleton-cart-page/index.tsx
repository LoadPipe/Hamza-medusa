import {
    Flex,
    Skeleton,
    SkeletonText,
    Box,
    SkeletonCircle,
    SkeletonTextProps,
} from '@chakra-ui/react';
import SkeletonOrderSummary from '@modules/skeletons/components/skeleton-order-summary';

const SkeletonCartPage = () => {
    return (
        <Flex
            maxW={'1280px'}
            width={'100vw'}
            mx="auto"
            py={{ base: '1rem', md: '4rem' }}
            justifyContent="center"
            alignItems={'center'}
        >
            <Flex
                maxWidth="1258px"
                width="100%"
                mx="1rem"
                flexDirection={{ base: 'column', md: 'row' }}
                gap="16px"
            >
                {/* Skeleton for Cart Items */}
                <Flex
                    flexDirection={'column'}
                    maxW={'830px'}
                    width={'100%'}
                    height={'auto'}
                    alignSelf={'self-start'}
                    py={{ base: '16px', md: '40px' }}
                    px={{ base: '16px', md: '45px' }}
                    borderRadius={'16px'}
                    backgroundColor={'#121212'}
                    color={'white'}
                >
                    <Flex justifyContent={{ base: 'center', md: 'left' }}>
                        <SkeletonText
                            fontWeight={600}
                            fontSize={{ base: '16px', md: '18px' }}
                            width="120px"
                            height={'18px'}
                            noOfLines={1}
                            startColor="gray.300"
                            endColor="gray.600"
                        />
                    </Flex>

                    {/* Placeholder skeletons for multiple items */}
                    <Box mt="1rem" minHeight={{ base: '170px', md: '400px' }}>
                        <Flex flexDirection="column" gap="16px">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <Flex
                                    key={index}
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    width="100%"
                                    height="170px"
                                    p="1rem"
                                    backgroundColor="#1a1a1a"
                                    borderRadius="8px"
                                >
                                    {/* Skeleton for item details */}
                                    <Flex
                                        flexDirection="column"
                                        width="100%"
                                        gap={1}
                                    >
                                        <Flex gap={3}>
                                            {/* <SkeletonCircle
                                                width={'32px'}
                                                height={'32px'}
                                            />
                                            <Skeleton
                                                alignSelf={'center'}
                                                height="12px"
                                                width="20%"
                                                startColor="gray.300"
                                                endColor="gray.600"
                                            /> */}
                                            {/* <Skeleton
                                                ml="auto"
                                                borderRadius={'full'}
                                                height="24px"
                                                width="100px"
                                                startColor="gray.300"
                                                endColor="gray.600"
                                            /> */}
                                        </Flex>
                                        <Flex flexDir={'row'}>
                                            <Skeleton
                                                borderRadius={'15px'}
                                                mt="4px"
                                                height="110px"
                                                width="110px"
                                                startColor="gray.300"
                                                endColor="gray.600"
                                            />
                                            <Flex
                                                flexDirection={'column'}
                                                justifyContent={'space-evenly'}
                                                flexGrow={1}
                                            >
                                                <Skeleton
                                                    ml="1rem"
                                                    height="14px"
                                                    width="70%"
                                                    startColor="gray.300"
                                                    endColor="gray.600"
                                                />
                                                <Skeleton
                                                    ml="1rem"
                                                    height="14px"
                                                    width="60%"
                                                    startColor="gray.300"
                                                    endColor="gray.600"
                                                />
                                                <Skeleton
                                                    ml="1rem"
                                                    height="14px"
                                                    width="20%"
                                                    startColor="gray.300"
                                                    endColor="gray.600"
                                                />
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>
                    </Box>
                </Flex>

                {/* Skeleton for Order Summary */}
                <SkeletonOrderSummary />
            </Flex>
        </Flex>
    );
};

export default SkeletonCartPage;
