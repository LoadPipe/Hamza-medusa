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
        <Box
            // bg={'#272727'}
            color={'white'}
            p={4}
            rounded="lg"
            shadow="base"
            maxWidth="1000px"
            m="auto"
            mt={2}
        >
            <Flex alignItems="center" mb={2}>
                <Text
                    fontSize={{ base: '14px', md: '24px' }}
                    fontWeight="bold"
                    noOfLines={1}
                >
                    {vendorName}
                </Text>
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    ml={2}
                    alignItems="center"
                >
                    <FaCheckCircle color="#3196DF" />
                </Flex>
            </Flex>

            <Flex justifyContent="space-between">
                {/* Left Side: Existing Content */}
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    flex="1"
                >
                    <Link href={`/us/products/${handle}`}>
                        <Image
                            borderRadius="lg"
                            width={{ base: '60px', md: '120px' }}
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
                        <Flex justifyContent="space-between" direction="row">
                            <Flex direction="column">
                                <Text
                                    color={'rgba(85, 85, 85, 1.0)'}
                                    fontSize="16px"
                                >
                                    Item Name
                                </Text>
                                <Text fontWeight="bold" fontSize="18px">
                                    {order.title}
                                </Text>
                                <Flex direction="row" alignItems="center">
                                    <Text
                                        color={'rgba(85, 85, 85, 1.0)'}
                                        fontSize="16px"
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

                        <Flex direction="column" mt={2}>
                            <Text
                                color={'rgba(85, 85, 85, 1.0)'}
                                fontSize="16px"
                            >
                                Order Date
                            </Text>
                            <Text color={'white'} fontSize="16px">
                                {new Date(
                                    order.created_at
                                ).toLocaleDateString()}
                            </Text>
                        </Flex>
                    </Box>
                </Flex>

                {/* Right Side: Courier and Address */}
                <Flex
                    direction="column"
                    ml={4}
                    minWidth="200px"
                    maxWidth="300px"
                >
                    <Text fontSize="24px" fontWeight="semibold">
                        {getAmount(order.unit_price)}{' '}
                        {upperCase(order.currency_code)}
                    </Text>
                </Flex>
            </Flex>
            <Flex justifyContent="flex-end" mt={2}>
                <Button
                    variant="outline"
                    colorScheme="white"
                    borderRadius={'37px'}
                    onClick={onOpen}
                >
                    View Cancellation Details
                </Button>
                {/*<Button*/}
                {/*    ml={2}*/}
                {/*    variant="outline"*/}
                {/*    colorScheme="white"*/}
                {/*    borderRadius={'37px'}*/}
                {/*>*/}
                {/*    Contact Seller*/}
                {/*</Button>*/}
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
                        <Text mb={4}>{cancel_reason}</Text>
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
        </Box>
    );
};

export default CancelCard;
