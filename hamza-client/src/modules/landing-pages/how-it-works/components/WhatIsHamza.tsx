import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    HStack,
    SimpleGrid,
    Icon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react';
import { Check, X } from 'lucide-react';
import Image from 'next/image';
import smartContractInfographic from '@/images/how-it-works/smart-contract-infographic.png';

interface WhatIsHamzaProps {
    selectedLanguage: string;
}

interface ComparisonRowProps {
    row: {
        feature: string;
        traditional: {
            text: string;
            emoji: string;
            negative: boolean;
        };
        hamza: {
            text: string;
            emoji: string;
            negative: boolean;
        };
    };
    index: number;
    isVisible: boolean;
}

interface MobileComparisonCardProps {
    row: {
        feature: string;
        traditional: {
            text: string;
            emoji: string;
            negative: boolean;
        };
        hamza: {
            text: string;
            emoji: string;
            negative: boolean;
        };
    };
    index: number;
    isVisible: boolean;
}

const comparisonData = [
    {
        feature: 'Transaction Fees',
        traditional: {
            text: '10-15% platform fees',
            emoji: '💸',
            negative: true,
        },
        hamza: { text: '2-3% minimal fees', emoji: '💰', negative: false },
    },
    {
        feature: 'Payment Processing',
        traditional: {
            text: '3-7 business days',
            emoji: '⏳',
            negative: true,
        },
        hamza: {
            text: 'Instant settlements',
            emoji: '⚡',
            negative: false,
        },
    },
    {
        feature: 'Payment Methods',
        traditional: {
            text: 'Credit cards only',
            emoji: '💳',
            negative: true,
        },
        hamza: {
            text: 'Multiple cryptocurrencies',
            emoji: '🪙',
            negative: false,
        },
    },
    {
        feature: 'Dispute Resolution',
        traditional: {
            text: 'Opaque process',
            emoji: '❓',
            negative: true,
        },
        hamza: {
            text: 'Transparent smart contracts',
            emoji: '🔍',
            negative: false,
        },
    },
    {
        feature: 'Data Control',
        traditional: {
            text: 'Platform owns your data',
            emoji: '🕵️',
            negative: true,
        },
        hamza: {
            text: 'You control your data',
            emoji: '🔐',
            negative: false,
        },
    },
    {
        feature: 'Global Access',
        traditional: {
            text: 'Geographic restrictions',
            emoji: '🚫',
            negative: true,
        },
        hamza: {
            text: 'Worldwide accessibility',
            emoji: '🌍',
            negative: false,
        },
    },
];

const ComparisonRow = memo(({ row, index, isVisible }: ComparisonRowProps) => {
    return (
        <Tr
            borderBottom="1px solid"
            borderColor="rgba(255, 255, 255, 0.08)"
            _last={{ borderBottom: 'none' }}
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
            transition={`all 0.5s ease ${0.7 + index * 0.1}s`}
            _hover={{
                bg: "rgba(255, 255, 255, 0.02)"
            }}
        >
            {/* Feature column */}
            <Td p={{ base: 6, sm: 8, lg: 10 }} verticalAlign="top">
                <VStack spacing={{ base: 2, sm: 3 }} align="start">
                    <Text
                        color="white"
                        fontWeight="medium"
                        fontSize={{ base: 'sm', sm: 'lg', lg: 'xl' }}
                        lineHeight="tight"
                        letterSpacing="wide"
                    >
                        {row.feature}
                    </Text>
                    <Box
                        w={{ base: 8, sm: 12 }}
                        h="1px"
                        bg="gray.700"
                        _groupHover={{ bg: "purple.400" }}
                        transition="background-color 0.3s ease"
                    />
                    <Text
                        color="gray.500"
                        fontSize={{ base: 'xs', sm: 'sm' }}
                        fontWeight="light"
                        letterSpacing="wide"
                    >
                        Key Difference
                    </Text>
                </VStack>
            </Td>

            {/* Traditional column */}
            <Td p={{ base: 6, sm: 8, lg: 10 }} textAlign="center" verticalAlign="top">
                <VStack spacing={{ base: 3, sm: 6 }}>
                    <Box
                        fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}
                        _hover={{
                            transform: "scale(1.2) rotate(-5deg)"
                        }}
                        transition="transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        cursor="pointer"
                    >
                        {row.traditional.emoji}
                    </Box>
                    <VStack spacing={{ base: 2, sm: 3 }}>
                        <Text
                            color="gray.300"
                            fontSize={{ base: 'xs', sm: 'base', lg: 'lg' }}
                            lineHeight="relaxed"
                            textAlign="center"
                            fontWeight="light"
                            letterSpacing="wide"
                            whiteSpace="normal"
                            wordBreak="break-word"
                            px={2}
                        >
                            {row.traditional.text}
                        </Text>
                        <Box
                            display="flex"
                            justifyContent="center"
                            _hover={{ transform: "scale(1.1)" }}
                            transition="transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                            cursor="pointer"
                        >
                            <Box
                                w={{ base: 8, sm: 10 }}
                                h={{ base: 8, sm: 10 }}
                                borderRadius="full"
                                bg="rgba(239, 68, 68, 0.2)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="1px solid rgba(239, 68, 68, 0.3)"
                            >
                                <Icon as={X} w={{ base: 4, sm: 5 }} h={{ base: 4, sm: 5 }} color="red.400" />
                            </Box>
                        </Box>
                    </VStack>
                </VStack>
            </Td>

            {/* Hamza column */}
            <Td p={{ base: 6, sm: 8, lg: 10 }} textAlign="center" verticalAlign="top">
                <VStack spacing={{ base: 3, sm: 6 }}>
                    <Box
                        fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}
                        _hover={{
                            transform: "scale(1.2) rotate(5deg)"
                        }}
                        transition="transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        cursor="pointer"
                    >
                        {row.hamza.emoji}
                    </Box>
                    <VStack spacing={{ base: 2, sm: 3 }}>
                        <Text
                            color="gray.300"
                            fontSize={{ base: 'xs', sm: 'base', lg: 'lg' }}
                            lineHeight="relaxed"
                            textAlign="center"
                            fontWeight="light"
                            letterSpacing="wide"
                            whiteSpace="normal"
                            wordBreak="break-word"
                            px={2}
                        >
                            {row.hamza.text}
                        </Text>
                        <Box
                            display="flex"
                            justifyContent="center"
                            _hover={{ transform: "scale(1.1)" }}
                            transition="transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                            cursor="pointer"
                        >
                            <Box
                                w={{ base: 8, sm: 10 }}
                                h={{ base: 8, sm: 10 }}
                                borderRadius="full"
                                bg="rgba(168, 85, 247, 0.2)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="1px solid rgba(168, 85, 247, 0.3)"
                            >
                                <Icon as={Check} w={{ base: 4, sm: 5 }} h={{ base: 4, sm: 5 }} color="purple.400" />
                            </Box>
                        </Box>
                    </VStack>
                </VStack>
            </Td>
        </Tr>
    );
});

ComparisonRow.displayName = 'ComparisonRow';

const MobileComparisonCard = memo(({ row, index, isVisible }: MobileComparisonCardProps) => {
    return (
        <Box
            bg="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="gray.800"
            borderRadius="xl"
            p={4}
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
            transition={`all 0.5s ease ${0.7 + index * 0.1}s`}
        >
            {/* Feature name */}
            <VStack spacing={0} mb={4}>
                <Text
                    color="white"
                    fontWeight="medium"
                    fontSize="base"
                    letterSpacing="wide"
                    textAlign="center"
                >
                    {row.feature}
                </Text>
                <Box w={8} h="1px" bg="gray.700" mt={2} />
            </VStack>

            {/* Comparison grid */}
            <SimpleGrid columns={2} spacing={4}>
                {/* Traditional column */}
                <Box
                    textAlign="center"
                    p={3}
                    bg="rgba(239, 68, 68, 0.05)"
                    borderRadius="lg"
                    border="1px solid rgba(239, 68, 68, 0.2)"
                >
                    <VStack spacing={3}>
                        <Text
                            color="red.400"
                            fontSize="xs"
                            fontWeight="medium"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                        >
                            Traditional
                        </Text>
                        <Box fontSize="2xl">
                            {row.traditional.emoji}
                        </Box>
                        <Text
                            color="gray.300"
                            fontSize="xs"
                            lineHeight="relaxed"
                            fontWeight="light"
                        >
                            {row.traditional.text}
                        </Text>
                        <Box display="flex" justifyContent="center">
                            <Box
                                w={6}
                                h={6}
                                borderRadius="full"
                                bg="rgba(239, 68, 68, 0.2)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="1px solid rgba(239, 68, 68, 0.3)"
                            >
                                <Icon as={X} w={3} h={3} color="red.400" />
                            </Box>
                        </Box>
                    </VStack>
                </Box>

                {/* Hamza column */}
                <Box
                    textAlign="center"
                    p={3}
                    bg="rgba(168, 85, 247, 0.05)"
                    borderRadius="lg"
                    border="1px solid rgba(168, 85, 247, 0.2)"
                >
                    <VStack spacing={3}>
                        <Text
                            color="purple.400"
                            fontSize="xs"
                            fontWeight="medium"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                        >
                            Hamza
                        </Text>
                        <Box fontSize="2xl">
                            {row.hamza.emoji}
                        </Box>
                        <Text
                            color="gray.300"
                            fontSize="xs"
                            lineHeight="relaxed"
                            fontWeight="light"
                        >
                            {row.hamza.text}
                        </Text>
                        <Box display="flex" justifyContent="center">
                            <Box
                                w={6}
                                h={6}
                                borderRadius="full"
                                bg="rgba(168, 85, 247, 0.2)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="1px solid rgba(168, 85, 247, 0.3)"
                            >
                                <Icon as={Check} w={3} h={3} color="purple.400" />
                            </Box>
                        </Box>
                    </VStack>
                </Box>
            </SimpleGrid>
        </Box>
    );
});

MobileComparisonCard.displayName = 'MobileComparisonCard';

const WhatIsHamza = memo(({ selectedLanguage }: WhatIsHamzaProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
            setIsVisible(true);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [handleIntersection]);

    return (
        <Box
            ref={sectionRef}
            id="what-is-hamza"
            maxW="1200px"
            mx="auto"
            px={4}
            position="relative"
            zIndex={1}
        >
            {/* Typography Hierarchy - Section Header with Purple Theme */}
            <Box
                textAlign="center"
                mb={{ base: 16, sm: 20, lg: 32 }}
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.8s ease"
            >
                {/* Overline */}
                <Text
                    color="gray.500"
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    fontWeight="light"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    mb={{ base: 4, sm: 6 }}
                >
                    Platform Overview
                </Text>

                {/* Primary heading */}
                <Text
                    fontSize={{ base: '2xl', sm: '3xl', lg: '5xl', xl: '6xl' }}
                    fontWeight="light"
                    color="white"
                    mb={{ base: 6, sm: 8 }}
                    letterSpacing="tight"
                    lineHeight="1.1"
                    px={2}
                >
                    What is{' '}
                    <Text as="span" color="purple.400" fontWeight="medium">
                        Hamza
                    </Text>
                    ?
                </Text>

                {/* Subtitle */}
                <Box maxW="4xl" mx="auto" px={2}>
                    <Text
                        fontSize={{ base: 'base', sm: 'lg', lg: '2xl' }}
                        fontWeight="light"
                        lineHeight="relaxed"
                        color="gray.300"
                        letterSpacing="wide"
                    >
                        Hamza is a revolutionary decentralized e-commerce
                        platform that eliminates traditional intermediaries,
                        enabling direct, secure, and transparent transactions
                        between buyers and sellers worldwide using blockchain
                        technology.
                    </Text>
                </Box>

                {/* Visual separator */}
                <Box
                    w={{ base: 16, sm: 24 }}
                    h="1px"
                    bgGradient="linear(to-r, transparent, purple.400, transparent)"
                    mx="auto"
                    mt={{ base: 6, sm: 8 }}
                />
            </Box>

            {/* Main Content */}
            <VStack spacing={{ base: 20, sm: 24, lg: 40 }}>
                {/* Smart Contract Infographic */}
                <Box
                    display="flex"
                    justifyContent="center"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                    transition="all 0.8s ease 0.3s"
                >
                    <Box
                        bg="#08090b"
                        backdropFilter="blur(10px)"
                        borderRadius={{ base: '2xl', sm: '3xl' }}
                        border="1px solid"
                        borderColor="gray.800"
                        maxW="3xl"
                        w="100%"
                        overflow="hidden"
                        _hover={{ transform: "scale(1.02)" }}
                        transition="transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                        cursor="pointer"
                    >
                        <VStack spacing={{ base: 8, sm: 12 }}>
                            {/* Section header */}
                            <Box
                                textAlign="center"
                                pt={{ base: 8, sm: 12, lg: 20 }}
                                px={{ base: 8, sm: 12, lg: 20 }}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                                transition="all 0.6s ease 0.5s"
                            >
                                <Text
                                    fontSize={{ base: 'lg', sm: '2xl', lg: '3xl' }}
                                    fontWeight="light"
                                    color="white"
                                    mb={{ base: 4, sm: 6 }}
                                    letterSpacing="wide"
                                    px={2}
                                >
                                    Direct Connection Through Smart Contracts
                                </Text>
                                <Box w={{ base: 12, sm: 16 }} h="1px" bg="purple.400" mx="auto" />
                            </Box>

                            {/* Smart Contract Infographic Image */}
                            <Box
                                w="100%"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'scale(1)' : 'scale(0.9)'}
                                transition="all 0.8s ease 0.7s"
                                _hover={{ transform: "scale(1.05)" }}
                            >
                                <Image
                                    src={smartContractInfographic}
                                    alt="Smart Contract connecting Buyer and Seller"
                                    width={800}
                                    height={500}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            </Box>

                            {/* Description */}
                            <Box
                                textAlign="center"
                                pb={{ base: 8, sm: 12, lg: 20 }}
                                px={{ base: 8, sm: 12, lg: 20 }}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                                transition="all 0.6s ease 0.9s"
                            >
                                <Text
                                    fontSize={{ base: 'sm', sm: 'base', lg: 'lg' }}
                                    color="gray.300"
                                    fontWeight="light"
                                    letterSpacing="wide"
                                    lineHeight="relaxed"
                                    maxW="2xl"
                                    mx="auto"
                                    px={2}
                                >
                                    Smart contracts eliminate the need for
                                    traditional intermediaries, enabling direct,
                                    secure, and automated transactions between
                                    buyers and sellers.
                                </Text>
                            </Box>
                        </VStack>
                    </Box>
                </Box>

                {/* Desktop Comparison Table */}
                <Box
                    display={{ base: 'none', sm: 'flex' }}
                    justifyContent="center"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                    transition="all 0.8s ease 0.5s"
                >
                    <Box maxW="5xl" w="100%">
                        {/* Header */}
                        <Box textAlign="center" mb={{ base: 12, sm: 20 }}>
                            <Text
                                color="gray.500"
                                fontSize={{ base: 'xs', sm: 'sm' }}
                                fontWeight="light"
                                letterSpacing="0.2em"
                                textTransform="uppercase"
                                mb={{ base: 4, sm: 6 }}
                            >
                                Platform Comparison
                            </Text>

                            <Text
                                fontSize={{ base: 'xl', sm: '3xl', lg: '4xl', xl: '5xl' }}
                                fontWeight="light"
                                color="white"
                                mb={{ base: 6, sm: 8 }}
                                letterSpacing="tight"
                                lineHeight="1.1"
                                px={2}
                            >
                                Traditional E-commerce
                                <Text
                                    as="span"
                                    display={{ base: 'block', sm: 'inline' }}
                                    mx={{ sm: 4, lg: 8 }}
                                    color="gray.600"
                                    fontWeight="thin"
                                    fontSize={{ base: 'lg', sm: '2xl', lg: '3xl' }}
                                    my={{ base: 2, sm: 0 }}
                                >
                                    vs.
                                </Text>
                                <Text as="span" color="purple.400" fontWeight="medium">
                                    Hamza
                                </Text>
                            </Text>

                            <Box
                                w={{ base: 20, sm: 32 }}
                                h="1px"
                                bgGradient="linear(to-r, transparent, purple.400, transparent)"
                                mx="auto"
                            />
                        </Box>

                        <Box
                            bg="rgba(0, 0, 0, 0.5)"
                            backdropFilter="blur(10px)"
                            border="1px solid"
                            borderColor="gray.800"
                            borderRadius={{ base: '2xl', sm: '3xl' }}
                            overflow="hidden"
                        >
                            <TableContainer
                                sx={{
                                    '&::-webkit-scrollbar': {
                                        display: 'none'
                                    },
                                    '-ms-overflow-style': 'none',
                                    'scrollbar-width': 'none'
                                }}
                            >
                                <Table variant="unstyled" size="lg">
                                    <Thead>
                                        <Tr borderBottom="1px solid" borderColor="rgba(255, 255, 255, 0.08)">
                                            <Th p={{ base: 6, sm: 8, lg: 10 }} w="33.33%">
                                                <VStack spacing={{ base: 2, sm: 3 }} align="start">
                                                    <Text
                                                        color="gray.300"
                                                        fontWeight="medium"
                                                        fontSize={{ base: 'base', sm: 'xl', lg: '2xl' }}
                                                        letterSpacing="wide"
                                                    >
                                                        Feature
                                                    </Text>
                                                    <Box w={{ base: 8, sm: 12 }} h="1px" bg="gray.700" />
                                                    <Text
                                                        color="gray.500"
                                                        fontSize={{ base: 'xs', sm: 'sm' }}
                                                        fontWeight="light"
                                                        letterSpacing="0.1em"
                                                        textTransform="uppercase"
                                                    >
                                                        Comparison
                                                    </Text>
                                                </VStack>
                                            </Th>
                                            <Th p={{ base: 6, sm: 8, lg: 10 }} w="33.33%" textAlign="center">
                                                <VStack spacing={{ base: 2, sm: 3 }}>
                                                    <Text
                                                        color="red.400"
                                                        fontWeight="medium"
                                                        fontSize={{ base: 'base', sm: 'xl', lg: '2xl' }}
                                                        letterSpacing="wide"
                                                    >
                                                        Traditional
                                                    </Text>
                                                    <Box w={{ base: 12, sm: 16 }} h="1px" bg="rgba(239, 68, 68, 0.5)" mx="auto" />
                                                    <Text
                                                        color="gray.500"
                                                        fontSize={{ base: 'xs', sm: 'sm' }}
                                                        fontWeight="light"
                                                        letterSpacing="0.1em"
                                                        textTransform="uppercase"
                                                    >
                                                        Legacy Systems
                                                    </Text>
                                                </VStack>
                                            </Th>
                                            <Th p={{ base: 6, sm: 8, lg: 10 }} w="33.33%" textAlign="center">
                                                <VStack spacing={{ base: 2, sm: 3 }}>
                                                    <Text
                                                        color="purple.400"
                                                        fontWeight="medium"
                                                        fontSize={{ base: 'base', sm: 'xl', lg: '2xl' }}
                                                        letterSpacing="wide"
                                                    >
                                                        Hamza
                                                    </Text>
                                                    <Box w={{ base: 12, sm: 16 }} h="1px" bg="purple.400" mx="auto" />
                                                    <Text
                                                        color="gray.500"
                                                        fontSize={{ base: 'xs', sm: 'sm' }}
                                                        fontWeight="light"
                                                        letterSpacing="0.1em"
                                                        textTransform="uppercase"
                                                    >
                                                        Blockchain-Powered
                                                    </Text>
                                                </VStack>
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {comparisonData.map((row, index) => (
                                            <ComparisonRow
                                                key={index}
                                                row={row}
                                                index={index}
                                                isVisible={isVisible}
                                            />
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>

                            {/* Footer */}
                            <Box
                                bgGradient="linear(to-r, rgba(168, 85, 247, 0.05), rgba(168, 85, 247, 0.1))"
                                p={{ base: 6, sm: 12 }}
                                textAlign="center"
                                borderTop="1px solid"
                                borderColor="rgba(255, 255, 255, 0.08)"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                                transition="all 0.6s ease 1.2s"
                            >
                                <VStack spacing={{ base: 3, sm: 4 }}>
                                    <Text
                                        color="white"
                                        fontSize={{ base: 'base', sm: 'lg', lg: 'xl' }}
                                        fontWeight="medium"
                                        letterSpacing="wide"
                                        px={2}
                                    >
                                        Experience the difference with
                                        blockchain-powered commerce
                                    </Text>
                                    <Box
                                        w={{ base: 16, sm: 24 }}
                                        h="1px"
                                        bgGradient="linear(to-r, purple.400, purple.500)"
                                        mx="auto"
                                    />
                                    <Text
                                        color="gray.400"
                                        fontSize={{ base: 'sm', sm: 'base' }}
                                        fontWeight="light"
                                        letterSpacing="wide"
                                        px={2}
                                    >
                                        Join the decentralized revolution today
                                    </Text>
                                </VStack>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Mobile Comparison Cards */}
                <Box
                    display={{ base: 'block', sm: 'none' }}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                    transition="all 0.8s ease 0.5s"
                >
                    <Box maxW="md" mx="auto">
                        {/* Mobile header */}
                        <Box textAlign="center" mb={8}>
                            <Text
                                color="gray.500"
                                fontSize="xs"
                                fontWeight="light"
                                letterSpacing="0.2em"
                                textTransform="uppercase"
                                mb={3}
                            >
                                Platform Comparison
                            </Text>
                            <Text
                                fontSize="xl"
                                fontWeight="light"
                                color="white"
                                mb={4}
                                letterSpacing="tight"
                                lineHeight="1.1"
                            >
                                Traditional E-commerce
                                <Text
                                    as="span"
                                    display="block"
                                    color="gray.600"
                                    fontWeight="thin"
                                    fontSize="base"
                                    my={1}
                                >
                                    vs.
                                </Text>
                                <Text as="span" color="purple.400" fontWeight="medium">
                                    Hamza
                                </Text>
                            </Text>
                            <Box
                                w={16}
                                h="1px"
                                bgGradient="linear(to-r, transparent, purple.400, transparent)"
                                mx="auto"
                            />
                        </Box>

                        {/* Mobile comparison cards */}
                        <VStack spacing={4}>
                            {comparisonData.map((row, index) => (
                                <MobileComparisonCard
                                    key={index}
                                    row={row}
                                    index={index}
                                    isVisible={isVisible}
                                />
                            ))}
                        </VStack>

                        {/* Mobile footer */}
                        <Box
                            bgGradient="linear(to-r, rgba(168, 85, 247, 0.05), rgba(168, 85, 247, 0.1))"
                            p={6}
                            textAlign="center"
                            border="1px solid"
                            borderColor="rgba(255, 255, 255, 0.08)"
                            borderRadius="xl"
                            mt={6}
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                            transition="all 0.6s ease 1.2s"
                        >
                            <VStack spacing={2}>
                                <Text
                                    color="white"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    letterSpacing="wide"
                                >
                                    Experience the difference with
                                    blockchain-powered commerce
                                </Text>
                                <Box
                                    w={12}
                                    h="1px"
                                    bgGradient="linear(to-r, purple.400, purple.500)"
                                    mx="auto"
                                />
                                <Text
                                    color="gray.400"
                                    fontSize="xs"
                                    fontWeight="light"
                                    letterSpacing="wide"
                                >
                                    Join the decentralized revolution today
                                </Text>
                            </VStack>
                        </Box>
                    </Box>
                </Box>
            </VStack>
        </Box>
    );
});

WhatIsHamza.displayName = 'WhatIsHamza';

export default WhatIsHamza;