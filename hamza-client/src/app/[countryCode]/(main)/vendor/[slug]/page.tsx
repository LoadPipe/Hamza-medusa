'use client';

import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import ProductCollections from '@modules/collections/product_collection_filter';
import {
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
        <div className="bg-black text-white text-center flex flex-col py-12">
            <h1 className="text-3xl font-bold mb-4 text-center">
                {displaySlug} {/* Display the capitalized slug */}
            </h1>
            <Image
                src={reviewStats.thumbnail}
                alt="Vendor"
                borderRadius="full"
                boxSize="250px"
                objectFit="cover"
                objectPosition="center"
                mx="auto"
                my={4}
            />

            <Text>Total Products: {reviewStats.productCount}</Text>
            <Text>Vendor Created at: {readableDate}</Text>
            <Text>Number of Followers: {reviewStats.numberOfFollowers}</Text>
            <Box>
                <Heading as="h2" size="md" mt={4}>
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
            <div>
                <ProductCollections vendorName={displaySlug} />{' '}
                {/* Pass the capitalized slug */}
            </div>
            <Box pt={12}>
                <Button
                    onClick={onOpen}
                    colorScheme={isSubmitted ? 'green' : 'red'}
                    mt={4}
                >
                    {isSubmitted ? 'Report Submitted' : 'Report Abuse'}
                </Button>
            </Box>
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
            </Box>
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
        </div>
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
