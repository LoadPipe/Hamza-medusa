import React from 'react';
import {
    Text,
    Box,
    Flex,
    Image as ChakraImage,
    Badge,
} from '@chakra-ui/react';
import { IoStar } from 'react-icons/io5';
import NextLink from 'next/link';
import { Store } from '@/types/global';

type StoreCardProps = {
    store: Store;
};

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
    const formatReviewCount = (count: number = 0) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
        return count;
    };

    return (
        <NextLink
            href={`/store/${store.handle}`}
            passHref
            style={{ textDecoration: 'none' }}
        >
            <Box
                borderRadius="16px"
                overflow="hidden"
                backgroundColor="#121212"
                transition="transform 0.2s ease-in-out"
                _hover={{
                    transform: 'scale(1.02)',
                }}
                cursor={'pointer'}
                className="product-card"
            >
                {/* --- IMAGE SECTION --- */}
                <Box
                    height={{ base: '134.73px', md: '238px' }}
                    display="flex"
                    justifyContent="center"
                    backgroundColor="white"
                    alignItems="center"
                    style={{ cursor: 'pointer' }}
                >
                    <ChakraImage
                        src={store.icon}
                        alt={`${store.name} logo`}
                        objectFit="cover"
                        height="100%"
                        width="100%"
                    />
                </Box>

                {/* --- TEXT CONTENT SECTION --- */}
                <Flex
                    p={{ base: '2', md: '4' }}
                    flexDirection={'column'}
                    flex="1"
                    gap={2}
                    height={{ base: '89px', md: '110px' }}
                >
                    <Flex alignItems="center" flexShrink={0}>
                        <Text
                            color="white"
                            fontWeight="700"
                            fontSize={{ base: '14px', md: '1.25rem' }}
                            noOfLines={2}
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="normal"
                            wordBreak="break-word"
                        >
                            {store.name}
                        </Text>
                    </Flex>

                    <Flex
                        gap={2}
                        mt="auto"
                        mb={{ base: '0', md: '5px' }}
                        flexDirection="column"
                    >
                        <Flex gap="2">
                            {store.is_verified && (
                                <Badge
                                    variant="solid"
                                    colorScheme="green"
                                    fontSize="10px"
                                    py={0.5}
                                >
                                    VERIFIED
                                </Badge>
                            )}
                        </Flex>

                        <Flex alignItems="center">
                            {store.avg_rating && store.review_count ? (
                                <>
                                    <IoStar style={{ color: '#FEC84B' }} />
                                    <Text
                                        color={'white'}
                                        fontWeight="700"
                                        fontSize="14px"
                                        ml="1.5"
                                    >
                                        {store.avg_rating.toFixed(1)}
                                    </Text>
                                    <Text
                                        color="#555555"
                                        fontWeight="700"
                                        fontSize="14px"
                                        ml="2"
                                    >
                                        ({formatReviewCount(store.review_count)})
                                    </Text>
                                </>
                            ) : (
                                <Text fontSize="14px" color="gray.500">No reviews yet</Text>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </NextLink>
    );
};

export default StoreCard;