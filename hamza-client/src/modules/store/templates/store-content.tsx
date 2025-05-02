'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, Image, Divider, Skeleton } from '@chakra-ui/react';
import StoreProductDisplay from './store-product-display';
import { getStoreBySlug } from '@/lib/server';
import {
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardArrowUp,
} from 'react-icons/md';

export default function StoreContent({ params }: { params: { slug: string } }) {
    const slug = params.slug?.trim();
    const [reviewStats, setReviewStats] = useState({
        reviewCount: 0,
        reviews: [],
        avgRating: 0,
        productCount: 0,
        createdAt: '',
        numberOfFollowers: 0,
        thumbnail: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    // reveal more text mobile about
    const [showMore, setShowMore] = useState(3);
    const [storeName, setStoreName] = useState('');
    const [storeHandle, setStoreHandle] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function loadStore() {
            try {
                if (!params.slug?.trim()) {
                    // If no slug, redirect to not-found
                    window.location.href = '/not-found';
                    return;
                }

                const response = await getStoreBySlug(params.slug);

                if (!response || !response.products) {
                    console.log('Store not found or invalid response');
                    window.location.href = '/not-found';
                    return;
                }

                setStoreName(response?.store?.name);
                setStoreHandle(response?.store?.handle);
                setReviewStats(response?.products);
                setIsLoading(false);
            } catch (error) {
                console.error(`Error fetching store:`, error);
                window.location.href = '/error';
            }
        }

        loadStore();
    }, [params.slug]);

    let readableDate = 'Invalid date';
    if (reviewStats.createdAt) {
        try {
            readableDate = new Date(reviewStats.createdAt).toLocaleDateString(
                'en-US',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }
            );
        } catch (error) {
            console.error('Error parsing date:', error);
        }
    }

    const toggleShowMore = () => {
        setShowMore((prev) => (prev === 3 ? 0 : 3));
    };

    return (
        <Box color={'white'} my="4rem">
            <Flex
                maxW={'1280x'}
                width="100%"
                justifyContent={'center'}
                alignItems={'center'}
                className="store-header"
            >
                <Flex
                    flexDir={'column'}
                    mx={'1rem'}
                    maxW={'1261px'}
                    overflow={'hidden'}
                    width="100%"
                    bgColor={'#121212'}
                    padding={{ base: '14px', md: '40px' }}
                    borderRadius={'16px'}
                >
                    {/* Company */}
                    <Flex
                        flexDir={{ base: 'column', md: 'row' }}
                        height={{ base: 'inherit', md: '111px' }}
                    >
                        <Flex
                            flexDir={'row'}
                            gap={{ base: '16px', md: '24px' }}
                        >
                            {!reviewStats.thumbnail && isLoading ? (
                                <Skeleton
                                    boxSize={{ base: '36.5px', md: '72px' }}
                                    borderRadius="full"
                                    startColor="gray.700"
                                    endColor="gray.500"
                                />
                            ) : (
                                <Image
                                    src={reviewStats.thumbnail}
                                    alt="Vendor"
                                    borderRadius="full"
                                    boxSize={{ base: '40px', md: '72px' }}
                                    objectFit="cover"
                                    objectPosition="center"
                                    alignSelf={'center'}
                                    onLoad={() => setIsLoading(false)}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            )}

                            <Flex flexDir={'column'} alignSelf={'center'}>
                                <Text
                                    fontSize={{ base: '12px', md: '24px' }}
                                    className="store-name"
                                >
                                    {storeName}{' '}
                                    {/* Display the capitalized slug */}
                                </Text>
                                <Flex color="#555555" gap={'7px'}>
                                    <Box
                                        alignSelf={'center'}
                                        width={{ base: '2.53px', md: '7.33px' }}
                                        height={{
                                            base: '2.53px',
                                            md: '7.33px',
                                        }}
                                        borderRadius={'full'}
                                        backgroundColor="primary.green.900"
                                    />
                                    <Text
                                        fontSize={{ base: '10px', md: '16px' }}
                                    >
                                        Online
                                    </Text>
                                </Flex>
                            </Flex>
                            {/*<Flex*/}
                            {/*    display={{ base: 'flex', md: 'none' }}*/}
                            {/*    height={'33px'}*/}
                            {/*    width={'120px'}*/}
                            {/*    ml="auto"*/}
                            {/*    borderColor={'primary.indigo.900'}*/}
                            {/*    borderWidth={'1px'}*/}
                            {/*    borderRadius={'37px'}*/}
                            {/*    justifyContent={'center'}*/}
                            {/*    cursor={'pointer'}*/}
                            {/*    fontSize={{ base: '12px', md: '16px' }}*/}
                            {/*>*/}
                            {/*    <Text*/}
                            {/*        alignSelf={'center'}*/}
                            {/*        color="primary.indigo.900"*/}
                            {/*    >*/}
                            {/*        Follow Seller*/}
                            {/*    </Text>*/}
                            {/*</Flex>*/}
                        </Flex>

                        {/* Stats */}
                        <Flex
                            mt={{ base: '1rem', md: '0' }}
                            justifyContent={'space-between'}
                        >
                            <Flex>
                                <Flex
                                    alignSelf={'center'}
                                    ml={{ base: '0', md: '2rem' }}
                                    flexDir={{ base: 'row', md: 'column' }}
                                    width={{ base: '100px', md: '166px' }}
                                >
                                    <Text
                                        as="h1"
                                        mr={{ base: '5px', md: '0' }}
                                        fontSize={{ base: '9px', md: '32px' }}
                                        textAlign={'center'}
                                        color="primary.green.900"
                                    >
                                        {reviewStats.reviewCount === 0
                                            ? ''
                                            : `${reviewStats.avgRating.toFixed(1)}`}
                                    </Text>
                                    <Text
                                        mt={{ base: '0', md: '0.75rem' }}
                                        fontSize={{ base: '9px', md: '16px' }}
                                        textAlign={'center'}
                                    >
                                        {reviewStats.reviewCount === 0
                                            ? ''
                                            : 'Average Rating'}
                                    </Text>
                                    {/* <Text>
                            {reviewStats.reviewCount === 0
                                ? 'No ratings yet'
                                : `Review Count: ${reviewStats.reviewCount}`}
                        </Text> */}
                                </Flex>
                            </Flex>

                            <Flex
                                flexDir={{ base: 'row', md: 'column' }}
                                justifyContent={{ base: 'end', md: 'center' }}
                                borderLeftWidth={{ base: '0', md: '1px' }}
                                borderRightWidth={{ base: '0', md: '1px' }}
                                borderStyle={'dashed'}
                                borderColor={'#555555'}
                                width={{ base: '100px', md: '166px' }}
                                alignItems={'center'}
                            >
                                <Flex flexDir={{ base: 'row', md: 'column' }}>
                                    <Text
                                        as="h1"
                                        mr={{ base: '5px', md: '0' }}
                                        fontSize={{ base: '9px', md: '32px' }}
                                        textAlign={'center'}
                                        color="primary.green.900"
                                        className="store-product-count"
                                    >
                                        {reviewStats.productCount}
                                    </Text>
                                    <Text
                                        mt={{ base: '0', md: '0.75rem' }}
                                        fontSize={{ base: '9px', md: '16px' }}
                                        textAlign={'center'}
                                    >
                                        Total Products
                                    </Text>
                                </Flex>
                            </Flex>

                            {/*    <Flex
                                    alignSelf={'center'}
                                    flexDir={{ base: 'row', md: 'column' }}
                                    justifyContent={{ base: 'end', md: 'normal' }}
                                    width={{ base: '100px', md: '166px' }}
                                >
                                    <Text
                                        mr={{ base: '5px', md: '0' }}
                                        as="h1"
                                        fontSize={{ base: '9px', md: '32px' }}
                                        color="primary.green.900"
                                        textAlign={'center'}
                                    >
                                        {reviewStats.numberOfFollowers}
                                    </Text>
                                    <Text
                                        mt={{ base: '0', md: '0.75rem' }}
                                        fontSize={{ base: '9px', md: '16px' }}
                                        textAlign={'center'}
                                    >
                                        Total Followers
                                    </Text>
                                </Flex>
                                */}
                        </Flex>
                        {/*End of Stats*/}

                        {/* Chat / Report */}
                        <Flex
                            ml={{ base: '0', md: 'auto' }}
                            flexDir={'column'}
                            gap="16px"
                            justifyContent={'center'}
                        >
                            <a
                                href={
                                    process.env.NEXT_PUBLIC_HAMZA_CHAT_LINK
                                        ? `${process.env.NEXT_PUBLIC_HAMZA_CHAT_LINK}?channel=${storeHandle}`
                                        : 'https://support.hamza.market/help/1568263160'
                                }
                                target="_blank"
                            >
                                <Flex
                                    display={'flex'}
                                    height={{ base: '33px', md: '47px' }}
                                    width={{ base: '120px', md: '190px' }}
                                    borderColor={'primary.indigo.900'}
                                    borderWidth={'1px'}
                                    borderRadius={'37px'}
                                    justifyContent={'center'}
                                    cursor={'pointer'}
                                    fontSize={{ base: '12px', md: '16px' }}
                                >
                                    <Text
                                        alignSelf={'center'}
                                        color="primary.indigo.900"
                                    >
                                        Chat with them
                                    </Text>
                                </Flex>
                            </a>

                            {/*<Flex*/}
                            {/*    display={{ base: 'none', md: 'flex' }}*/}
                            {/*    height={{ base: '33px', md: '47px' }}*/}
                            {/*    width={{ base: '120px', md: '190px' }}*/}
                            {/*    borderColor={'primary.indigo.900'}*/}
                            {/*    borderWidth={'1px'}*/}
                            {/*    borderRadius={'37px'}*/}
                            {/*    justifyContent={'center'}*/}
                            {/*    cursor={'pointer'}*/}
                            {/*    fontSize={{ base: '12px', md: '16px' }}*/}
                            {/*>*/}
                            {/*    <Text*/}
                            {/*        alignSelf={'center'}*/}
                            {/*        color="primary.indigo.900"*/}
                            {/*    >*/}
                            {/*        Follow Seller*/}
                            {/*    </Text>*/}
                            {/*</Flex>*/}
                        </Flex>
                    </Flex>
                    <Divider
                        borderColor={'#555555'}
                        my={{ base: '1rem', md: '2rem' }}
                    />

                    {/* About */}
                    <Flex flexDir={'column'}>
                        <Text
                            fontSize={{ base: '14px', md: '16px' }}
                            alignSelf={'flex-start'}
                            color="primary.green.900"
                        >
                            About the seller
                        </Text>

                        <Text
                            fontSize={{ base: '14px', md: '16px' }}
                            ml="auto"
                            mt={{ base: '0', md: '1rem' }}
                            noOfLines={{ base: showMore, md: 0 }}
                        >
                            {reviewStats.description}
                        </Text>

                        <Flex>
                            <Flex
                                display={{ base: 'flex', md: 'none' }}
                                fontSize={{ base: '14px', md: '16px' }}
                                alignSelf={'center'}
                                onClick={toggleShowMore}
                            >
                                {showMore === 0 ? 'Show Less' : 'Show More'}
                            </Flex>
                            <Flex
                                display={{ base: 'flex', md: 'none' }}
                                alignSelf={'center'}
                            >
                                {showMore === 0 ? (
                                    <MdOutlineKeyboardArrowUp size={24} />
                                ) : (
                                    <MdOutlineKeyboardArrowRight size={24} />
                                )}
                            </Flex>
                        </Flex>
                    </Flex>
                    {/* <Text
                    ml="auto"
                    mt="1rem"
                    fontSize={{ base: '14px', md: '16px' }}
                >
                    Vendor Created at: {readableDate}
                </Text> */}
                </Flex>
            </Flex>

            {/* Only render StoreProductDisplay if we have a valid store */}
            {!isLoading && <StoreProductDisplay storeName={slug} />}
        </Box>
    );
}
