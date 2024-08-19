'use client';

import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import ProductCollections from '@modules/collections/product_collection_filter';
import {
    Flex,
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Image,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    useDisclosure,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Card,
    CardHeader,
    CardBody,
    Stack,
    StackDivider,
    CardFooter,
    FormErrorMessage,
    Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { getVendorStoreBySlug } from '@lib/data';
import { format } from 'date-fns';
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export default function Page({ params }: { params: { slug: string } }) {
    const displaySlug = capitalizeSlug(params.slug);
    const [reviewStats, setReviewStats] = useState({
        reviewCount: 0,
        reviews: [],
        avgRating: 0,
        productCount: 0,
        createdAt: '',
        numberOfFollowers: 0,
        thumbnail: '',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [abuseReason, setAbuseReason] = useState('');
    const [abuseDetails, setAbuseDetails] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isAttemptedSubmit, setIsAttemptedSubmit] = useState(false);
    console.log(`slug name ${displaySlug}`);
    // can I get a store_id from vendor name??
    // yes you can so let's do that, /custom/vendors/vendor-reviews
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(
                    `${BACKEND_URL}/custom/vendors/vendor-store`,
                    {
                        store_name: displaySlug,
                    }
                );
                console.log(`Response ${JSON.stringify(response.data)}`);
                setReviewStats(response.data);
                console.log(`THUMBNAIL: ${response.data.icon}`);
            } catch (error) {
                console.log(`Error ${error}`);
            }
        };

        fetchData();
    }, [displaySlug]);

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

    const handleSubmit = () => {
        console.log('Abuse Report Submitted');
        console.log('Reason:', abuseReason);
        console.log('Details:', abuseDetails);
        if (!abuseReason) {
            setIsAttemptedSubmit(true);
            return;
        }
        // Reset form values
        setAbuseReason('');
        setAbuseDetails('');
        setIsSubmitted(true);
        setIsAttemptedSubmit(false);

        onClose();
    };

    return (
        <Box color={'white'} my="4rem">
            <Flex
                flexDir={'column'}
                mx="auto"
                maxW={'1261px'}
                width="100%"
                bgColor={'#121212'}
                padding={'40px'}
                borderRadius={'16px'}
            >
                {/* Company */}
                <Flex flexDir={'row'} gap={'26px'}>
                    <Image
                        src={reviewStats.thumbnail}
                        alt="Vendor"
                        borderRadius="full"
                        boxSize="72px"
                        objectFit="cover"
                        objectPosition="center"
                    />
                    <Flex ml="1rem" flexDir={'column'}>
                        <Text fontSize={'24px'}>
                            {displaySlug} {/* Display the capitalized slug */}
                        </Text>
                        <Flex color="#555555" gap={'7px'}>
                            <Text fontSize={{ base: '10px', md: '16px' }}>
                                Flagship Store
                            </Text>
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
                    {/* Reviews */}
                    <Box ml="2rem" width={'166px'}>
                        <Heading as="h2" size="md">
                            Review Stats
                        </Heading>
                        <Text>
                            {reviewStats.reviewCount === 0
                                ? 'No reviews yet'
                                : `Average Rating: ${reviewStats.avgRating.toFixed(1)}`}
                        </Text>
                        <Text>
                            {reviewStats.reviewCount === 0
                                ? 'No ratings yet'
                                : `Review Count: ${reviewStats.reviewCount}`}
                        </Text>
                    </Box>

                    <Flex
                        flexDir={'column'}
                        borderLeftWidth={'1px'}
                        borderRightWidth={'1px'}
                        borderStyle={'dashed'}
                        width={'166px'}
                    >
                        <Text
                            as="h1"
                            fontSize={'32px'}
                            textAlign={'center'}
                            color="primary.green.900"
                        >
                            {reviewStats.productCount}
                        </Text>
                        <Text textAlign={'center'}>Total Products</Text>
                    </Flex>

                    <Flex flexDir={'column'} width={'166px'}>
                        <Text
                            as="h1"
                            fontSize={'32px'}
                            color="primary.green.900"
                            textAlign={'center'}
                        >
                            {reviewStats.numberOfFollowers}
                        </Text>
                        <Text textAlign={'center'}>Number of Followersss</Text>
                    </Flex>

                    <Flex ml="auto" flexDir={'column'} gap="16px">
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
                            <Text
                                alignSelf={'center'}
                                color="primary.indigo.900"
                            >
                                Chat with them
                            </Text>
                        </Flex>
                        <Flex
                            display={{ base: 'none', md: 'flex' }}
                            height={{ base: '33px', md: '47px' }}
                            width={{ base: '120px', md: '190px' }}
                            borderWidth={'1px'}
                            borderRadius={'37px'}
                            justifyContent={'center'}
                            cursor={'pointer'}
                            fontSize={{ base: '12px', md: '16px' }}
                            onClick={onOpen}
                            borderColor={isSubmitted ? 'green' : 'red'}
                        >
                            <Text
                                alignSelf={'center'}
                                color={isSubmitted ? 'green' : 'red'}
                            >
                                {isSubmitted
                                    ? 'Report Submitted'
                                    : 'Report Abuse'}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Divider backgroundColor={'#555555'} my="2rem" />
                {/* About */}
                <Flex flexDir={'column'}>
                    <Text alignSelf={'flex-start'} color="primary.green.900">
                        About the seller
                    </Text>

                    <Text ml="auto" mt="1rem">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Commodi, nostrum. Quasi similique cum sunt alias
                        harum voluptatum adipisci delectus, mollitia porro
                        labore at eos numquam ratione nihil repellat! Placeat,
                        laborum.
                    </Text>
                </Flex>
                <Text ml="auto">Vendor Created at: {readableDate}</Text>
            </Flex>
            {/* 
            <Box className="bg-black text-white p-4">
                <Card>
                    {reviewStats.reviewCount > 0 && (
                        <>
                            <CardHeader>
                                <Heading size="md">
                                    Vendor Product Reviews
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack divider={<StackDivider />} spacing={4}>
                                    {reviewStats.reviews.map((review) => (
                                        <Box key={(review as any).id}>
                                            <Heading
                                                size="xs"
                                                textTransform="uppercase"
                                            >
                                                {(review as any).title}
                                            </Heading>
                                            <Text fontSize="sm">
                                                Customer ID:{' '}
                                                {(review as any).customer_id}
                                            </Text>
                                            <Text fontSize="sm">
                                                Rating: {(review as any).rating}{' '}
                                                / 5
                                            </Text>
                                            <Text fontSize="sm">
                                                {(review as any).review}
                                            </Text>
                                            <Text fontSize="sm">
                                                Date:{' '}
                                                {format(
                                                    new Date(
                                                        (
                                                            review as any
                                                        ).createdAt
                                                    ),
                                                    'PPP'
                                                )}
                                            </Text>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardBody>
                            <CardFooter></CardFooter>
                        </>
                    )}
                </Card>
            </Box> */}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Report Abuse</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isSubmitted ? (
                            <Alert status="success">
                                <AlertIcon />
                                <AlertTitle mr={2}>Abuse reported!</AlertTitle>
                                <AlertDescription>
                                    Your report has been submitted.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <>
                                <FormControl
                                    id="abuse-reason"
                                    isRequired
                                    isInvalid={
                                        !abuseReason && isAttemptedSubmit
                                    }
                                >
                                    <FormLabel>Reason</FormLabel>
                                    <Select
                                        placeholder="Select reason"
                                        value={abuseReason}
                                        onChange={(e) =>
                                            setAbuseReason(e.target.value)
                                        }
                                    >
                                        <option value="spam">Spam</option>
                                        <option value="harassment">
                                            Harassment
                                        </option>
                                        <option value="inappropriate">
                                            Inappropriate Content
                                        </option>
                                    </Select>
                                    {!abuseReason && isAttemptedSubmit && (
                                        <FormErrorMessage>
                                            Reason is required.
                                        </FormErrorMessage>
                                    )}
                                </FormControl>
                                <FormControl
                                    id="abuse-details"
                                    isRequired
                                    mt={4}
                                >
                                    <FormLabel>Details</FormLabel>
                                    <Textarea
                                        placeholder="Provide additional details"
                                        value={abuseDetails}
                                        onChange={(e) =>
                                            setAbuseDetails(e.target.value)
                                        }
                                    />
                                </FormControl>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {!isSubmitted && (
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

// Function to capitalize each word in the slug
function capitalizeSlug(slug: string) {
    // Decode URI components before processing
    const decodedSlug = decodeURIComponent(slug);
    return decodedSlug
        .replace(/\+/g, ' ')
        .split(/[\s-]+/) // Split on any sequence of spaces or dashes
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
}
