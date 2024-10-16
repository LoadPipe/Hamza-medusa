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
import OrderLeftColumn from '@modules/order/templates/order-left-column';

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
    storeName: string;
    icon: string;
};

const CancelCard = ({
    order,
    handle,
    cancel_reason,
    cancelled_date,
    storeName,
    icon,
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
            <OrderLeftColumn
                order={order}
                handle={handle}
                storeName={storeName}
                icon={icon}
                showDate={false}
            />

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
