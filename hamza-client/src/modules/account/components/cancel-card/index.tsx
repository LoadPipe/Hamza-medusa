import { formatAmount } from '@lib/util/prices';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import {
    Box,
    Flex,
    Text,
    Button,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { upperCase } from 'lodash';
import React from 'react';

type OrderDetails = {
    thumbnail: string;
    title: string;
    description: string;
};

type Order = {
    id: string;
    display_id: string;
    created_at: string;
    details: OrderDetails;
    quantity: string;
    paid_total: number;
    currency_code: string;
    unit_price: number;
    thumbnail: string;
    title: string;
    description: string;
    variant: {
        product_id: string;
        metadata: {
            imgUrl?: string;
        };
    };
    region: {
        id: string;
        name: string;
    };
    metadata: {
        cancel_reason?: string;
    };
};

type OrderCardProps = {
    order: Order;
    handle: string;
    cancel_reason: string;
    cancelled_date: string;
    vendorName: string;
};

const CancelCard = ({
    order,
    handle,
    cancel_reason,
    cancelled_date,
    vendorName,
}: OrderCardProps) => {
    const orderString = typeof order.currency_code;
    const { isOpen, onOpen, onClose } = useDisclosure();
    console.log('Order Metadata:', cancel_reason, 'on date', cancelled_date);

    const getAmount = (amount?: number | null) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, order.currency_code || 'USDC');
    };

    if (!order) {
        return <div>Loading...</div>; // Display loading message if order is undefined
    }
    return (
        <Flex
            // bg={'#272727'}
            color={'white'}
            maxWidth="100%"
            my={4}
        >
            <Flex
                justifyContent="space-between"
                flexDirection={{ base: 'column' }}
                gap={{ base: 4, md: 0 }}
            >
                <Flex alignItems="center" mb={4}>
                    <Text
                        fontSize={{ base: '18px', md: '24px' }}
                        fontWeight="bold"
                        noOfLines={1}
                    >
                        {vendorName}
                    </Text>
                    <Flex display={{ base: 'flex' }} ml={2} alignItems="center">
                        <FaCheckCircle color="#3196DF" />
                    </Flex>
                </Flex>

                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    alignItems={{ base: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                >
                    {' '}
                    {/* Left Side: Existing Content */}
                    <Flex
                        direction={{ base: 'column', md: 'row' }} // Ensure column layout on mobile
                        alignItems={{ base: 'flex-start', md: 'center' }}
                        justifyContent="space-between"
                        flex="1"
                        maxWidth="650px"
                    >
                        <Link
                            href={`/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/products/${handle}`}
                        >
                            <Image
                                borderRadius="lg"
                                width={{ base: '75px', md: '100px' }}
                                height={{ base: '75px', md: '100px' }}
                                src={
                                    order?.variant?.metadata?.imgUrl ??
                                    order.thumbnail ??
                                    ''
                                }
                                alt={`Thumbnail of ${order.title}`}
                                mr={4}
                            />
                        </Link>

                        <Box flex="1">
                            <Flex
                                justifyContent="space-between"
                                direction="row"
                            >
                                <Flex direction="column">
                                    <Text
                                        minWidth="250px"
                                        maxWidth="600px"
                                        noOfLines={4}
                                        fontWeight="bold"
                                        fontSize="18px"
                                    >
                                        {order.title}
                                    </Text>
                                    <Flex
                                        direction={{
                                            base: 'column',
                                            md: 'row',
                                        }}
                                        alignItems={'center'}
                                        color={'rgba(85, 85, 85, 1.0)'}
                                    >
                                        <Text
                                            fontSize={{ base: '14px' }}
                                            mr={1} // Add some space between "Variation:" and the description
                                        >
                                            Variation:
                                        </Text>
                                        <Text fontSize="14px">
                                            {order.description}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Flex>

                            {/*<Flex direction="column" mt={4}>*/}
                            {/*    <Text*/}
                            {/*        color={'rgba(85, 85, 85, 1.0)'}*/}
                            {/*        fontSize="16px"*/}
                            {/*    >*/}
                            {/*        Order Date*/}
                            {/*    </Text>*/}
                            {/*    <Text color={'white'} fontSize="16px">*/}
                            {/*        {new Date(*/}
                            {/*            order.created_at*/}
                            {/*        ).toLocaleDateString()}*/}
                            {/*    </Text>*/}
                            {/*</Flex>*/}
                        </Box>
                    </Flex>
                </Flex>
                {/* Right Side: Courier and Address */}
            </Flex>

            <Flex
                justifyContent="space-between"
                flex="1"
                width={'100%'}
                direction={{ base: 'column', md: 'column' }}
                mt={8}
                gap={1}
            >
                <Flex direction={'row'} justifyContent={'flex-end'}>
                    <Text fontSize="16px" fontWeight="semibold">
                        {getAmount(order.unit_price)}{' '}
                        {upperCase(order.currency_code)}
                    </Text>
                </Flex>
                <Flex direction={'row'} justifyContent={'flex-end'}>
                    <Button
                        variant="outline"
                        colorScheme="white"
                        borderRadius={'37px'}
                        onClick={onOpen}
                        width={{ base: '100%', md: 'auto' }}
                    >
                        View Cancellation Details
                    </Button>
                    <a
                        href="https://blog.hamza.market/contact/"
                        target="_blank"
                    >
                        <Button
                            ml={{ base: 0, md: 2 }}
                            mt={{ base: 2, md: 0 }}
                            variant="outline"
                            colorScheme="white"
                            borderRadius={'37px'}
                            width={{ base: '100%', md: 'auto' }}
                        >
                            Contact Seller
                        </Button>
                    </a>
                </Flex>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">
                        Cancellation Details
                    </ModalHeader>
                    <ModalBody>
                        <Text fontSize="lg" fontWeight="bold" mb={2}>
                            Reason for Cancellation:
                        </Text>
                        <Text mb={2}>{cancel_reason}</Text>
                        <Text fontSize="lg" fontWeight="bold" mb={2}>
                            Cancellation Date:
                        </Text>
                        <Text>
                            {new Date(cancelled_date).toLocaleDateString(
                                undefined,
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default CancelCard;
