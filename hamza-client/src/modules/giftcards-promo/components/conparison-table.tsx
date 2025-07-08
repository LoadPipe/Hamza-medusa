import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    HStack,
    Icon,
} from '@chakra-ui/react';
import { Check, X } from 'lucide-react';

interface ComparisonRowProps {
    feature: string;
    traditional: string;
    hamza: string;
    index: number;
    isVisible: boolean;
}

const comparisonData = [
    {
        feature: 'Payment Security',
        traditional: 'Credit card required',
        hamza: 'Crypto security',
    },
    {
        feature: 'Privacy Level',
        traditional: 'Full personal details',
        hamza: 'Crypto anonymity',
    },
    {
        feature: 'Delivery Speed',
        traditional: '24-48 hours',
        hamza: 'Instant delivery',
    },
    {
        feature: 'Geographic Access',
        traditional: 'Limited regions',
        hamza: 'Worldwide access',
    },
    {
        feature: 'Payment Methods',
        traditional: 'Credit cards only',
        hamza: 'Multiple cryptocurrencies',
    },
    {
        feature: 'Transaction Fees',
        traditional: '3-5% processing fees',
        hamza: 'Minimal network fees',
    },
];

const ComparisonRow = memo(({ feature, traditional, hamza, index, isVisible }: ComparisonRowProps) => {
    return (
        <Tr
            borderBottom="1px solid rgba(255, 255, 255, 0.1)"
            _hover={{
                bg: 'rgba(255, 255, 255, 0.02)',
            }}
            transition="background 0.2s ease"
            bg="#000000"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
            style={{
                transition: `all 0.6s ease ${1.2 + (index * 0.1)}s`
            }}
        >
            <Td
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight="medium"
                color="#FEFEFE"
                py={6}
                borderBottom="none"
            >
                {feature}
            </Td>

            <Td
                textAlign="center"
                py={6}
                borderBottom="none"
            >
                <HStack spacing={3} justify="center">
                    <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color="#D1D5DB"
                        textAlign="center"
                    >
                        {traditional}
                    </Text>
                    <Box
                        w={6}
                        h={6}
                        borderRadius="full"
                        bg="rgba(239, 68, 68, 0.2)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Icon as={X} w={4} h={4} color="red.400" />
                    </Box>
                </HStack>
            </Td>

            <Td
                textAlign="center"
                py={6}
                borderBottom="none"
            >
                <HStack spacing={3} justify="center">
                    <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color="#D1D5DB"
                        textAlign="center"
                        fontWeight="medium"
                    >
                        {hamza}
                    </Text>
                    <Box
                        w={6}
                        h={6}
                        borderRadius="full"
                        bg="rgba(34, 197, 94, 0.2)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Icon as={Check} w={4} h={4} color="green.400" />
                    </Box>
                </HStack>
            </Td>
        </Tr>
    );
});

ComparisonRow.displayName = 'ComparisonRow';

const ComparisonTable = memo(() => {
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
            py={{ base: 16, md: 24 }}
            bg="black"
            position="relative"
        >
            {/* Background Pattern */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.3}
                bg="linear-gradient(45deg, transparent 49%, rgba(34, 197, 94, 0.1) 50%, transparent 51%)"
                backgroundSize="20px 20px"
            />

            <Container maxW="5xl" position="relative" zIndex={1}>
                <VStack>
                    {/* Section Header */}
                    <VStack spacing={6} textAlign="center">
                        <Text
                            fontSize={{ base: 'xs', md: 'sm' }}
                            fontWeight="300"
                            fontFamily="Arial, Helvetica, sans-serif"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            color="gray.500"
                            lineHeight="1.25rem"
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                            transition="all 0.6s ease 0.2s"
                        >
                            Platform Comparison
                        </Text>

                        <HStack
                            spacing={4}
                            align="center"
                            justify="center"
                            flexWrap="wrap"
                            marginBottom="1rem"
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                            transition="all 0.6s ease 0.4s"
                        >
                            <Text
                                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                                fontWeight="300"
                                fontFamily="Arial, Helvetica, sans-serif"
                                letterSpacing="-0.025em"
                                lineHeight="2.5rem"
                                color="white"
                            >
                                Traditional Platforms
                            </Text>
                            <Text
                                fontSize={{ base: '1xl', md: '2xl', lg: '3xl' }}
                                fontWeight="300"
                                fontFamily="Arial, Helvetica, sans-serif"
                                letterSpacing="-0.025em"
                                lineHeight="2.5rem"
                                px={2}
                                color="gray.500"
                            >
                                vs.
                            </Text>
                            <Text
                                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                                fontWeight="300"
                                fontFamily="Arial, Helvetica, sans-serif"
                                letterSpacing="-0.025em"
                                lineHeight="2.5rem"
                                color="#4ADE80"
                            >
                                Hamza
                            </Text>
                        </HStack>
                    </VStack>

                    <Box
                        w={{ base: "5rem", sm: "8rem" }}
                        h="2px"
                        bgGradient="linear(to-r, transparent, green.400, transparent)"
                        mx="auto"
                        mb={12}
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                        transition="all 0.6s ease 0.6s"
                    />

                    {/* Comparison Table */}
                    <Box
                        w="100%"
                        bg="rgba(255, 255, 255, 0.02)"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        borderRadius="xl"
                        overflow="hidden"
                        backdropFilter="blur(10px)"
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                        transition="all 0.6s ease 0.8s"
                    >
                        <Table variant="unstyled" size="lg">
                            <Thead>
                                <Tr bg="black" borderBottom="1px solid #080B11">
                                    <Th
                                        color="white"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        fontWeight="bold"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        textTransform="none"
                                        letterSpacing="normal"
                                        py={6}
                                        borderBottom="none"
                                    >
                                        <VStack spacing={4} align="start">
                                            <Text>Feature</Text>
                                            <Box w="20%" h="1px" bg="white" />
                                        </VStack>
                                    </Th>
                                    <Th
                                        color="red.300"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        fontWeight="bold"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        textTransform="none"
                                        letterSpacing="normal"
                                        textAlign="center"
                                        py={6}
                                        borderBottom="none"
                                    >
                                        <VStack spacing={4}>
                                            <Text>Traditional</Text>
                                            <Box w="20%" h="1px" bg="red.300" />
                                        </VStack>
                                    </Th>
                                    <Th
                                        color="green.300"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        fontWeight="bold"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        textTransform="none"
                                        letterSpacing="normal"
                                        textAlign="center"
                                        py={6}
                                        borderBottom="none"
                                    >
                                        <VStack spacing={4}>
                                            <Text>Hamza</Text>
                                            <Box w="20%" h="1px" bg="green.300" />
                                        </VStack>
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {comparisonData.map((row, index) => (
                                    <ComparisonRow
                                        key={row.feature}
                                        feature={row.feature}
                                        traditional={row.traditional}
                                        hamza={row.hamza}
                                        index={index}
                                        isVisible={isVisible}
                                    />
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
});

ComparisonTable.displayName = 'ComparisonTable';

export default ComparisonTable;