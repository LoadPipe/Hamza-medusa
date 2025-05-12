'use client';

import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Flex,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react';
import { FaBitcoin, FaCopy, FaQrcode, FaRegCheckCircle } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StatusStep from './components/StatusStep';
import OrderItem from './components/OrderItem';
import QRCode from 'react-qr-code';

import { PaymentsDataProps } from '@/app/[countryCode]/(main)/order/processing/[id]/page';
import Image from 'next/image';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { STATUS_STEPS } from './types';
import { getPaymentData } from '@/lib/server';
import { useAccount } from 'wagmi';
import { ModalCoverWalletConnect } from '../common/components/modal-cover-wallet-connect';
import { calculateStepState } from './utils';
import {
    getChainLogoFromName,
    getChainNameFromId,
    getChainTitleFromName,
    isChainNameInChainMap,
} from '../chain-select';

const OrderProcessing = ({
    startTimestamp,
    endTimestamp,
    paymentsData,
    cartId,
    paywith,
    openqrmodal,
    fromCheckout,
}: {
    cartId: string;
    startTimestamp: number;
    endTimestamp: number;
    paymentsData: PaymentsDataProps[];
    paywith?: string;
    openqrmodal?: boolean;
    fromCheckout?: boolean;
}) => {
    const router = useRouter();
    const initialPaymentData = paymentsData ? paymentsData[0] : null;
    const [paymentData, setPaymentData] = useState(initialPaymentData);
    const [openOrders, setOpenOrders] = useState<Record<string, boolean>>({});
    const [progress, setProgress] = useState(0);
    const { isConnected } = useAccount();
    const [isClient, setIsClient] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const totalOrders = initialPaymentData?.orders?.length ?? 0;

    //get chain name from payment data
    const _paymentData = initialPaymentData?.orders?.length
        ? initialPaymentData.orders[0].payments
        : null;

    const paymentCurrency = _paymentData?.[0]?.currency_code;

    const blockchainData = _paymentData?.[0]?.blockchain_data;

    const chainId = blockchainData?.chain_id;

    const chainName = getChainNameFromId(chainId || 0);

    //get total of items
    const totalItems = initialPaymentData?.orders?.reduce((total, order) => {
        const orderTotalItems = order?.items?.reduce(
            (totalItems, item) => totalItems + item.quantity,
            0
        );
        return total + orderTotalItems;
    }, 0);

    //get total cost
    const paymentTotal = initialPaymentData?.orders?.reduce((total, order) => {
        const orderTotal = order?.payments.reduce(
            (paymentTotal, payment) => paymentTotal + payment.amount,
            0
        );
        return total + orderTotal;
    }, 0);

    const currencyCode = initialPaymentData?.orders?.length
        ? initialPaymentData.orders[0].currency_code
        : 'usdc';
    const [hasCopied, setHasCopied] = useState(false);
    const [hasCopiedAmount, setHasCopiedAmount] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('waiting');

    const toggleOrder = (orderId: string) => {
        setOpenOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const calculateProgress = useCallback(() => {
        const usedTime = Date.now() - startTimestamp;
        const totalTime = endTimestamp - startTimestamp;
        return Math.min(Math.max((usedTime / totalTime) * 100, 0), 100);
    }, [startTimestamp, endTimestamp]);

    // handling progress bar timer
    useEffect(() => {
        setIsClient(true);

        if (paymentData?.status !== 'waiting') {
            setProgress(100);
            return;
        }

        const timer = setInterval(() => {
            const currentProgress = calculateProgress();
            setProgress(currentProgress);

            // If progress reaches 100% (timer is done), change status to expired
            if (currentProgress >= 100) {
                //setPaymentData((prev) => ({
                //    ...prev,
                //    status: 'expired',
                //}));
                clearInterval(timer);
            }
        }, 1000);

        setProgress(calculateProgress());

        return () => clearInterval(timer);
    }, [paymentData?.status, calculateProgress]);

    // handling polling of payments endpoint for status updates
    useEffect(() => {
        let timer: NodeJS.Timer;
        timer = setInterval(
            async () => {
                try {
                    // console.log('Polling payment status...');
                    const payments = await getPaymentData(cartId);

                    if (payments && payments.length > 0) {
                        const payment = payments[0];

                        setPaymentData(payment);
                        setCurrentStatus(payment?.status);

                        // Stop polling if payment is expired
                        if (payment.status === 'expired') {
                            clearInterval(timer);
                            return;
                        }

                        // Redirect if payment is in escrow
                        if (
                            (payment.status === 'received' ||
                                payment.status === 'in_escrow') &&
                            fromCheckout
                        ) {
                            //pause 2 seconds before redirecting
                            clearInterval(timer);
                            setTimeout(() => {
                                router.push(
                                    `/order/confirmed/${payment.orders[0].id}?cart=${cartId}`
                                );
                            }, 2000);
                        }
                    }
                } catch (error) {
                    console.error('Error polling payment status:', error);
                }
            },
            Number(process.env.NEXT_PUBLIC_PAYMENT_POLLING_INTERVAL) || 5000
        );

        return () => clearInterval(timer);
    }, [cartId, router]);

    // Update the useEffect to run on mount and handle the initial state
    useEffect(() => {
        if (openqrmodal) {
            onOpen();
        }
    }, []); // Empty dependency array to run only on mount

    if (!isClient) {
        return (
            <ModalCoverWalletConnect
                title="Proceed to Payment Processing"
                message="To view payment processing details, please connect your wallet"
                pageIsLoading={isClient}
            />
        ); // Render nothing on the server
    }

    return (
        <div>
            {!isConnected ? (
                <ModalCoverWalletConnect
                    title="Proceed to Payment Processing"
                    message="To view payment processing details, please connect your wallet"
                    pageIsLoading={isClient}
                />
            ) : (
                <>
                    <Box bg="gray.900" p={6} borderRadius="xl">
                        <VStack spacing={6} align="stretch">
                            {/* Payment Header */}
                            <HStack justify="space-between">
                                <Text
                                    fontSize="2xl"
                                    color="white"
                                    fontWeight="bold"
                                >
                                    Payment Status
                                </Text>
                                <Box
                                    bg={
                                        currentStatus === 'expired'
                                            ? 'red.900'
                                            : currentStatus === 'partial'
                                              ? 'orange.900'
                                              : 'green.900'
                                    }
                                    px={3}
                                    py={1}
                                    borderRadius="3xl"
                                    border="2px"
                                    borderStyle="solid"
                                    borderColor={
                                        currentStatus === 'expired'
                                            ? 'red.500'
                                            : currentStatus === 'partial'
                                              ? 'orange.400'
                                              : 'primary.green.900'
                                    }
                                >
                                    <Text color="white" fontWeight="bold">
                                        {currentStatus === 'expired'
                                            ? 'Expired'
                                            : currentStatus === 'partial'
                                              ? 'Partial'
                                              : STATUS_STEPS.find(
                                                    (step) =>
                                                        step.status ===
                                                        currentStatus
                                                )?.label}
                                    </Text>
                                </Box>
                            </HStack>

                            <Text color="gray.300">Cart ID: {cartId}</Text>

                            {/* Status Steps */}
                            <Box display={{ base: 'block', md: 'none' }}>
                                {STATUS_STEPS.map(
                                    (step, index) =>
                                        (step.status === currentStatus ||
                                            (step.status === 'waiting' &&
                                                currentStatus ===
                                                    'expired')) && (
                                            <StatusStep
                                                key={step.status}
                                                step={step}
                                                index={index}
                                                progress={progress}
                                                currentStatus={currentStatus}
                                                {...calculateStepState(
                                                    step.status,
                                                    currentStatus,
                                                    progress,
                                                    endTimestamp,
                                                    startTimestamp
                                                )}
                                            />
                                        )
                                )}
                            </Box>
                            <HStack
                                spacing={4}
                                justify="space-between"
                                align="flex-start"
                                display={{ base: 'none', md: 'flex' }}
                            >
                                {STATUS_STEPS.map((step, index) => (
                                    <StatusStep
                                        key={step.status}
                                        step={step}
                                        index={index}
                                        progress={progress}
                                        currentStatus={currentStatus}
                                        {...calculateStepState(
                                            step.status,
                                            currentStatus,
                                            progress,
                                            endTimestamp,
                                            startTimestamp
                                        )}
                                    />
                                ))}
                            </HStack>

                            <Box height="1px" bg="gray.600" my={4} w="100%" />

                            {/* Escrow Info */}
                            <VStack spacing={0} align="start">
                                <Stack
                                    mt={4}
                                    spacing={8}
                                    direction={{ base: 'column', md: 'row' }}
                                    align={{
                                        base: 'stretch',
                                        md: 'flex-start',
                                    }}
                                >
                                    <VStack align="start" spacing={1}>
                                        <Text color="gray.500" fontSize="sm">
                                            Created:
                                        </Text>
                                        <Text color="white">
                                            {new Date(
                                                paymentData?.orders?.length
                                                    ? paymentData.orders[0]
                                                          ?.created_at
                                                    : ''
                                            )
                                                .toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })
                                                .replace(',', ' -')}
                                        </Text>
                                    </VStack>
                                    <VStack align="start" spacing={1}>
                                        <Text color="gray.500" fontSize="sm">
                                            Total Amount:
                                        </Text>
                                        <Flex>
                                            <Image
                                                className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                                src={
                                                    currencyIcons[
                                                        currencyCode ?? 'usdc'
                                                    ]
                                                }
                                                alt={currencyCode ?? 'usdc'}
                                            />
                                            <Text ml="0.4rem" color="white">
                                                {formatCryptoPrice(
                                                    paymentTotal ?? 0,
                                                    currencyCode ?? 'usdc',
                                                    false
                                                )}
                                            </Text>
                                        </Flex>
                                    </VStack>
                                    {paywith &&
                                        chainName &&
                                        isChainNameInChainMap(chainName) && (
                                            <VStack align="start" spacing={1}>
                                                <Text
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    Chain Network:
                                                </Text>
                                                <Flex>
                                                    <Image
                                                        src={
                                                            getChainLogoFromName(
                                                                chainName
                                                            ).src
                                                        }
                                                        alt={`${getChainTitleFromName(
                                                            chainName
                                                        )} logo`}
                                                        width={24}
                                                        height={24}
                                                    />
                                                    <Text
                                                        ml="0.4rem"
                                                        color="white"
                                                    >
                                                        {getChainTitleFromName(
                                                            chainName
                                                        )}
                                                    </Text>
                                                </Flex>
                                            </VStack>
                                        )}

                                    {paymentCurrency && (
                                        <VStack align="start" spacing={1}>
                                            <Text
                                                color="gray.500"
                                                fontSize="sm"
                                            >
                                                Payment Currency:
                                            </Text>
                                            <Text color="white">
                                                {paymentCurrency?.toUpperCase()}
                                            </Text>
                                        </VStack>
                                    )}
                                    <VStack align="start" spacing={1}>
                                        <Text color="gray.500" fontSize="sm">
                                            Total Items:
                                        </Text>
                                        <Text color="white">
                                            {totalItems} items
                                        </Text>
                                    </VStack>
                                </Stack>
                            </VStack>

                            <Box bg="gray.800" p={4} borderRadius="lg">
                                <HStack justify="space-between">
                                    <VStack align="start" spacing={1}>
                                        <Text color="white" fontSize="sm">
                                            Payment address
                                        </Text>
                                        <HStack spacing={2}>
                                            <Text
                                                fontSize="sm"
                                                fontFamily="monospace"
                                                color="white"
                                                display={{
                                                    base: 'none',
                                                    md: 'block',
                                                }}
                                            >
                                                {paymentData?.paymentAddress}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontFamily="monospace"
                                                color="white"
                                                display={{
                                                    base: 'block',
                                                    md: 'none',
                                                }}
                                            >
                                                ...
                                                {paymentData?.paymentAddress?.slice(
                                                    -10
                                                )}
                                            </Text>
                                        </HStack>
                                    </VStack>

                                    <Stack
                                        direction={{
                                            base: 'column',
                                            md: 'row',
                                        }}
                                        spacing={2}
                                    >
                                        {paywith && paywith === 'bitcoin' && (
                                            <Button
                                                size={{
                                                    base: 'xs',
                                                    md: 'sm',
                                                }}
                                                bg="gray.700"
                                                color="white"
                                                borderRadius="2rem"
                                                leftIcon={
                                                    <FaBitcoin
                                                        size={24}
                                                        color="#F7931A"
                                                    />
                                                }
                                                _hover={{ bg: 'gray.600' }}
                                                p={{ base: 4, md: 6 }}
                                                onClick={() => onOpen()}
                                            >
                                                BTC QR Code
                                            </Button>
                                        )}

                                        {paywith && paywith === 'evm' && (
                                            <Button
                                                size={{
                                                    base: 'xs',
                                                    md: 'sm',
                                                }}
                                                bg="gray.700"
                                                color="white"
                                                borderRadius="2rem"
                                                leftIcon={
                                                    <FaQrcode
                                                        size={20}
                                                        color="white"
                                                    />
                                                }
                                                _hover={{ bg: 'gray.600' }}
                                                p={{ base: 4, md: 6 }}
                                                onClick={onOpen}
                                            >
                                                QR Code
                                            </Button>
                                        )}

                                        <Button
                                            size={{ base: 'xs', md: 'sm' }}
                                            bg="gray.700"
                                            color="white"
                                            borderRadius="2rem"
                                            leftIcon={
                                                hasCopied ? (
                                                    <FaRegCheckCircle color="white" />
                                                ) : (
                                                    <FaCopy color="white" />
                                                )
                                            }
                                            _hover={{ bg: 'gray.600' }}
                                            p={{ base: 4, md: 6 }}
                                            onClick={() => {
                                                const formattedAmount =
                                                    formatCryptoPrice(
                                                        paymentTotal ?? 0,
                                                        currencyCode ?? 'usdc',
                                                        false
                                                    ).toString();
                                                navigator.clipboard.writeText(
                                                    formattedAmount
                                                );
                                                setHasCopied(true);
                                                setTimeout(
                                                    () => setHasCopied(false),
                                                    2000
                                                );
                                            }}
                                        >
                                            {hasCopied ? 'Copied!' : 'Copy'}
                                        </Button>
                                    </Stack>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>

                    {/* QR Code Modal */}
                    {paywith && (
                        <Modal
                            isOpen={isOpen}
                            onClose={onClose}
                            size={{ base: 'full', md: 'md' }}
                            motionPreset="slideInBottom"
                            isCentered
                        >
                            <ModalOverlay />
                            <ModalContent
                                bg="gray.900"
                                h={{ base: '100vh', md: 'auto' }}
                                m={0}
                                borderRadius={{ base: 0, md: 'xl' }}
                            >
                                <ModalCloseButton
                                    color="white"
                                    position="absolute"
                                    top={4}
                                    right={4}
                                    size="lg"
                                />
                                <ModalBody
                                    py={8}
                                    h={{ base: '100%', md: 'auto' }}
                                    overflowY="auto"
                                >
                                    <VStack spacing={6}>
                                        <Text
                                            color="white"
                                            fontSize="xl"
                                            fontWeight="bold"
                                        >
                                            {paywith === 'bitcoin'
                                                ? 'Pay with BTC'
                                                : 'Pay with External Wallet'}
                                        </Text>
                                        {paywith && paywith === 'bitcoin' ? (
                                            <Text
                                                color="gray.400"
                                                fontSize="sm"
                                                textAlign="left"
                                            >
                                                Bitcoin payments are processed
                                                separately from EVM wallets. If
                                                you choose Bitcoin, you'll
                                                receive a unique payment address
                                                and instructions. This method is
                                                independent of your EVM wallet
                                                balance. To complete your
                                                payment, simply scan the QR code
                                                using your Bitcoin wallet."
                                            </Text>
                                        ) : (
                                            <>
                                                <Text
                                                    color="gray.400"
                                                    fontSize="sm"
                                                    textAlign="left"
                                                >
                                                    Use this option if you're
                                                    paying with a hardware
                                                    wallet or a mobile wallet
                                                    app like Trust Wallet or
                                                    SafePal. It's ideal when
                                                    your wallet isn't connected
                                                    directly to the site but
                                                    supports the same network.{' '}
                                                    <br />
                                                    <br /> To complete the
                                                    payment, just scan the QR
                                                    code or copy the wallet
                                                    address to send the funds
                                                    manually.
                                                </Text>

                                                <HStack
                                                    justify="flex-start"
                                                    width="100%"
                                                    gap={5}
                                                >
                                                    <VStack
                                                        gap={0}
                                                        alignItems="flex-start"
                                                    >
                                                        <Text
                                                            color="gray.400"
                                                            fontSize="sm"
                                                            textAlign="left"
                                                        >
                                                            Total Amount:
                                                        </Text>
                                                        <HStack>
                                                            <Text
                                                                color="gray.400"
                                                                fontSize="sm"
                                                                textAlign="left"
                                                            >
                                                                {formatCryptoPrice(
                                                                    paymentTotal ??
                                                                        0,
                                                                    currencyCode ??
                                                                        'usdc',
                                                                    false
                                                                )}
                                                            </Text>
                                                            <Button
                                                                size="xs"
                                                                bg="gray.700"
                                                                color="white"
                                                                borderRadius="2rem"
                                                                leftIcon={
                                                                    hasCopiedAmount ? (
                                                                        <FaRegCheckCircle
                                                                            style={{
                                                                                marginRight:
                                                                                    '0',
                                                                            }}
                                                                            color="white"
                                                                        />
                                                                    ) : (
                                                                        <FaCopy
                                                                            style={{
                                                                                marginRight:
                                                                                    '0',
                                                                            }}
                                                                            color="white"
                                                                        />
                                                                    )
                                                                }
                                                                _hover={{
                                                                    bg: 'gray.600',
                                                                }}
                                                                onClick={() => {
                                                                    const formattedAmount =
                                                                        formatCryptoPrice(
                                                                            paymentTotal ??
                                                                                0,
                                                                            currencyCode ??
                                                                                'usdc',
                                                                            false
                                                                        ).toString();
                                                                    navigator.clipboard.writeText(
                                                                        formattedAmount
                                                                    );
                                                                    setHasCopiedAmount(
                                                                        true
                                                                    );
                                                                    setTimeout(
                                                                        () =>
                                                                            setHasCopiedAmount(
                                                                                false
                                                                            ),
                                                                        2000
                                                                    );
                                                                }}
                                                            >
                                                                {/* {hasCopiedAmount
                                                                    ? 'Copied!'
                                                                    : 'Copy'} */}
                                                            </Button>
                                                        </HStack>
                                                    </VStack>
                                                    {paywith && chainName && (
                                                        <VStack
                                                            gap={0}
                                                            alignItems="flex-start"
                                                        >
                                                            <Text
                                                                color="gray.400"
                                                                fontSize="sm"
                                                                textAlign="left"
                                                            >
                                                                Chain Network:
                                                            </Text>
                                                            <HStack>
                                                                <Image
                                                                    src={
                                                                        getChainLogoFromName(
                                                                            chainName
                                                                        ).src
                                                                    }
                                                                    alt={`${getChainTitleFromName(
                                                                        chainName
                                                                    )} logo`}
                                                                    width={24}
                                                                    height={24}
                                                                />
                                                                <Text
                                                                    color="gray.400"
                                                                    fontSize="sm"
                                                                    textAlign="left"
                                                                >
                                                                    {getChainTitleFromName(
                                                                        chainName
                                                                    )}
                                                                </Text>
                                                            </HStack>
                                                        </VStack>
                                                    )}
                                                    <VStack
                                                        gap={0}
                                                        alignItems="flex-start"
                                                    >
                                                        <Text
                                                            color="gray.400"
                                                            fontSize="sm"
                                                            textAlign="left"
                                                        >
                                                            Payment Currency:
                                                        </Text>
                                                        <HStack>
                                                            <Text
                                                                color="gray.400"
                                                                fontSize="sm"
                                                                textAlign="left"
                                                            >
                                                                {paymentCurrency?.toUpperCase()}
                                                            </Text>
                                                        </HStack>
                                                    </VStack>
                                                </HStack>
                                            </>
                                        )}

                                        <Box bg="white" p={4} borderRadius="lg">
                                            <QRCode
                                                value={
                                                    paymentData?.paymentAddress ??
                                                    ''
                                                }
                                                size={256}
                                                style={{
                                                    height: 'auto',
                                                    maxWidth: '100%',
                                                    width: '100%',
                                                }}
                                            />
                                        </Box>

                                        <Text
                                            color="gray.400"
                                            fontSize="sm"
                                            textAlign="center"
                                            wordBreak="break-all"
                                        >
                                            {paymentData?.paymentAddress}
                                            <br />

                                            <Button
                                                size={{ base: 'xs', md: 'sm' }}
                                                bg="gray.700"
                                                color="white"
                                                borderRadius="2rem"
                                                leftIcon={
                                                    hasCopied ? (
                                                        <FaRegCheckCircle color="white" />
                                                    ) : (
                                                        <FaCopy color="white" />
                                                    )
                                                }
                                                _hover={{ bg: 'gray.600' }}
                                                p={{ base: 4, md: 6 }}
                                                onClick={() => {
                                                    const formattedAmount =
                                                        formatCryptoPrice(
                                                            paymentTotal ?? 0,
                                                            currencyCode ??
                                                                'usdc',
                                                            false
                                                        ).toString();
                                                    navigator.clipboard.writeText(
                                                        formattedAmount
                                                    );
                                                    setHasCopied(true);
                                                    setTimeout(
                                                        () =>
                                                            setHasCopied(false),
                                                        2000
                                                    );
                                                }}
                                            >
                                                {hasCopied ? 'Copied!' : 'Copy'}
                                            </Button>
                                        </Text>
                                    </VStack>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    )}

                    <Box bg="gray.900" mt={8} p={6} borderRadius="xl">
                        <VStack spacing={6} align="stretch">
                            {/* Orders Section */}
                            <Box>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    mb={4}
                                    color="white"
                                >
                                    Orders
                                </Text>
                                <VStack spacing={3} align="stretch">
                                    {paymentData?.orders?.map((order) => (
                                        <OrderItem
                                            key={order.id}
                                            order={order}
                                            isOpen={openOrders[order.id]}
                                            onToggle={() =>
                                                toggleOrder(order.id)
                                            }
                                            currencyCode={
                                                currencyCode ?? 'usdc'
                                            }
                                        />
                                    ))}
                                </VStack>

                                <HStack justify="space-between" mt={4}>
                                    <Text color="white">
                                        Total Orders: {totalOrders}
                                    </Text>
                                    <Flex gap={2}>
                                        <Text color="white">Total Amount:</Text>
                                        <Image
                                            className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                            src={
                                                currencyIcons[
                                                    currencyCode ?? 'usdc'
                                                ]
                                            }
                                            alt={currencyCode ?? 'usdc'}
                                        />
                                        <Text ml="0.4rem" color="white">
                                            {formatCryptoPrice(
                                                paymentTotal ?? 0,
                                                currencyCode ?? 'usdc',
                                                false
                                            )}
                                        </Text>
                                    </Flex>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>
                </>
            )}
        </div>
    );
};

export default OrderProcessing;
