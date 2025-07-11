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
    Stack,
    Flex,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Check, X, DollarSign, Clock, Globe, Shield } from 'lucide-react';

interface ComparisonRowProps {
    feature: string;
    traditional: { text: string; icon: React.ElementType };
    hamza: { text: string; icon: React.ElementType };
    index: number;
    isVisible: boolean;
}

const comparisonData = [
    {
        feature: 'Platform Fees',
        traditional: { text: '8-15% + payment fees', icon: DollarSign },
        hamza: { text: 'Only 2-3% total', icon: DollarSign },
    },
    {
        feature: 'Payment Processing',
        traditional: { text: '7-14 days hold', icon: Clock },
        hamza: { text: 'Instant crypto payments', icon: Clock },
    },
    {
        feature: 'Global Reach',
        traditional: { text: 'Limited by regulations', icon: Globe },
        hamza: { text: 'Sell to 190+ countries', icon: Globe },
    },
    {
        feature: 'Account Security',
        traditional: { text: 'Can be suspended anytime', icon: Shield },
        hamza: { text: 'Decentralized & secure', icon: Shield },
    },
    {
        feature: 'Data Ownership',
        traditional: { text: 'Platform owns your data', icon: Shield },
        hamza: { text: 'You control your data', icon: Shield },
    },
    {
        feature: 'Payment Methods',
        traditional: { text: 'Limited to fiat only', icon: DollarSign },
        hamza: { text: 'Accept crypto & fiat', icon: DollarSign },
    },
];

// Mobile Card Component for better mobile experience
const MobileComparisonCard = memo(({ feature, traditional, hamza, index, isVisible }: ComparisonRowProps) => {
    return (
        <Box
            bg="rgba(0, 0, 0, 0.3)"
            borderRadius="xl"
            p={4}
            mb={4}
            border="1px solid rgba(128, 128, 128, 0.2)"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
            transition={`all 0.6s ease ${1.2 + (index * 0.1)}s`}
            w="full" 
        >
            <VStack spacing={4} align="stretch">
                <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="white"
                    textAlign="center"
                    letterSpacing="wide"
                >
                    {feature}
                </Text>

                <HStack spacing={4} justify="space-between" align="stretch">
                    {/* Traditional */}
                    <VStack
                        spacing={2}
                        flex={1}
                        minH="120px" 
                        justify="space-between"
                    >
                        <Text fontSize="xs" color="red.400" fontWeight="medium" textTransform="uppercase">
                            Traditional
                        </Text>
                        <Icon as={traditional.icon} w={6} h={6} color="red.400" />
                        <Box flex={1} display="flex" alignItems="center" minH="40px">
                            <Text
                                fontSize="xs"
                                color="gray.300"
                                textAlign="center"
                                lineHeight="relaxed"
                                px={1}
                            >
                                {traditional.text}
                            </Text>
                        </Box>
                        <Box
                            w={6}
                            h={6}
                            borderRadius="full"
                            bg="rgba(239, 68, 68, 0.2)"
                            border="1px solid rgba(239, 68, 68, 0.3)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={X} w={3} h={3} color="red.400" />
                        </Box>
                    </VStack>

                    {/* VS Separator */}
                    <Box
                        w="1px"
                        h="120px" 
                        bg="gray.700"
                        position="relative"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Box
                            bg="gray.900"
                            px={2}
                            py={1}
                            borderRadius="full"
                            border="1px solid gray.700"
                        >
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                VS
                            </Text>
                        </Box>
                    </Box>

                    {/* Hamza */}
                    <VStack
                        spacing={2}
                        flex={1}
                        minH="120px" 
                        justify="space-between" 
                    >
                        <Text fontSize="xs" color="green.400" fontWeight="medium" textTransform="uppercase">
                            Hamza
                        </Text>
                        <Icon as={hamza.icon} w={6} h={6} color="green.400" />
                        <Box flex={1} display="flex" alignItems="center" minH="40px">
                            <Text
                                fontSize="xs"
                                color="gray.300"
                                textAlign="center"
                                lineHeight="relaxed"
                                px={1}
                            >
                                {hamza.text}
                            </Text>
                        </Box>
                        <Box
                            w={6}
                            h={6}
                            borderRadius="full"
                            bg="rgba(34, 197, 94, 0.2)"
                            border="1px solid rgba(34, 197, 94, 0.3)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={Check} w={3} h={3} color="green.400" />
                        </Box>
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    );
});

MobileComparisonCard.displayName = 'MobileComparisonCard';

const ComparisonRow = memo(({ feature, traditional, hamza, index, isVisible }: ComparisonRowProps) => {
    return (
        <Tr
            borderBottom="1px solid rgba(128, 128, 128, 0.3)"
            _last={{ borderBottom: 'none' }}
            role="group"
            _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
            transition="background 0.3s"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
            style={{
                transition: `all 0.6s ease ${1.2 + (index * 0.1)}s, background 0.3s`
            }}
        >
            <Td
                p={{ base: 4, md: 6, lg: 8 }}
                verticalAlign="top"
                borderBottom="none"
                minW={{ base: '80px', md: 'auto' }}
            >
                <VStack spacing={{ base: 1, md: 2, lg: 3 }} align="start">
                    <Text
                        fontSize={{ base: 'xs', md: 'sm', lg: 'base', xl: 'lg' }}
                        fontWeight="medium"
                        color="white"
                        lineHeight="tight"
                        letterSpacing="wide"
                    >
                        {feature}
                    </Text>
                    <Box
                        w={{ base: '20px', md: '32px', lg: '48px' }}
                        h="1px"
                        bg="gray.700"
                        _groupHover={{ bg: 'rgba(34, 197, 94, 0.5)' }}
                        transition="background 0.3s"
                    />
                </VStack>
            </Td>

            <Td
                p={{ base: 2, md: 4, lg: 6 }}
                textAlign="center"
                verticalAlign="top"
                borderBottom="none"
                minW={{ base: '100px', md: 'auto' }}
            >
                <VStack spacing={{ base: 1, md: 2, lg: 4 }}>
                    <Box
                        _groupHover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.3s"
                    >
                        <Icon
                            as={traditional.icon}
                            w={{ base: 4, md: 6, lg: 8 }}
                            h={{ base: 4, md: 6, lg: 8 }}
                            color="red.400"
                        />
                    </Box>
                    <VStack spacing={{ base: 1, md: 2 }}>
                        <Text
                            fontSize={{ base: '2xs', md: 'xs', lg: 'sm' }}
                            color="gray.300"
                            lineHeight="relaxed"
                            fontWeight="300"
                            letterSpacing="wide"
                            textAlign="center"
                            px={1}
                        >
                            {traditional.text}
                        </Text>
                        <Flex justify="center">
                            <Box
                                w={{ base: 4, md: 6, lg: 8 }}
                                h={{ base: 4, md: 6, lg: 8 }}
                                borderRadius="full"
                                bg="rgba(239, 68, 68, 0.2)"
                                border="1px solid rgba(239, 68, 68, 0.3)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={X} w={{ base: 2, md: 3, lg: 4 }} h={{ base: 2, md: 3, lg: 4 }} color="red.400" />
                            </Box>
                        </Flex>
                    </VStack>
                </VStack>
            </Td>

            <Td
                p={{ base: 2, md: 4, lg: 6 }}
                textAlign="center"
                verticalAlign="top"
                borderBottom="none"
                minW={{ base: '100px', md: 'auto' }}
            >
                <VStack spacing={{ base: 1, md: 2, lg: 4 }}>
                    <Box
                        _groupHover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.3s"
                    >
                        <Icon
                            as={hamza.icon}
                            w={{ base: 4, md: 6, lg: 8 }}
                            h={{ base: 4, md: 6, lg: 8 }}
                            color="green.400"
                        />
                    </Box>
                    <VStack spacing={{ base: 1, md: 2 }}>
                        <Text
                            fontSize={{ base: '2xs', md: 'xs', lg: 'sm' }}
                            color="gray.300"
                            lineHeight="relaxed"
                            fontWeight="300"
                            letterSpacing="wide"
                            textAlign="center"
                            px={1}
                        >
                            {hamza.text}
                        </Text>
                        <Flex justify="center">
                            <Box
                                w={{ base: 4, md: 6, lg: 8 }}
                                h={{ base: 4, md: 6, lg: 8 }}
                                borderRadius="full"
                                bg="rgba(34, 197, 94, 0.2)"
                                border="1px solid rgba(34, 197, 94, 0.3)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={Check} w={{ base: 2, md: 3, lg: 4 }} h={{ base: 2, md: 3, lg: 4 }} color="green.400" />
                            </Box>
                        </Flex>
                    </VStack>
                </VStack>
            </Td>
        </Tr>
    );
});

ComparisonRow.displayName = 'ComparisonRow';

const ComparisonTable = memo(() => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isMobile = useBreakpointValue({ base: true, md: false });

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
            maxW="1200px"
            mx="auto"
            px={{ base: 4, sm: 6, lg: 8 }}
            position="relative"
            zIndex={1}
        >
            <Flex justify="center">
                <Box maxW="5xl" w="full">
                    <VStack spacing={0} textAlign="center" mb={{ base: 8, md: 12, lg: 16 }}>
                        <Text
                            fontSize={{ base: 'xs', sm: 'sm' }}
                            fontWeight="300"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            color="gray.500"
                            mb={{ base: 2, md: 4, lg: 6 }}
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                            transition="all 0.6s ease 0.2s"
                        >
                            Side by Side Comparison
                        </Text>

                        <Text
                            fontSize={{ base: 'xl', sm: '2xl', md: '3xl', lg: '4xl' }}
                            fontWeight="300"
                            color="white"
                            mb={{ base: 4, md: 6, lg: 8 }}
                            letterSpacing="-0.025em"
                            lineHeight="1.1"
                            px={2}
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                            transition="all 0.6s ease 0.4s"
                        >
                            Traditional Marketplaces
                            <Text
                                as="span"
                                display={{ base: 'block', sm: 'inline' }}
                                mx={{ base: 0, sm: 2, md: 4 }}
                                color="gray.600"
                                fontWeight="100"
                                fontSize={{ base: 'md', sm: 'lg', md: 'xl', lg: '2xl' }}
                                my={{ base: 1, sm: 0 }}
                            >
                                vs.
                            </Text>
                            <Text as="span" color="green.400" fontWeight="medium">Hamza</Text>
                        </Text>

                        <Box
                            w={{ base: '48px', sm: '64px', lg: '96px' }}
                            h="1px"
                            bgGradient="linear(to-r, transparent, green.400, transparent)"
                            mx="auto"
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                            transition="all 0.6s ease 0.6s"
                        />
                    </VStack>

                    {/* Mobile Layout */}
                    {isMobile ? (
                        <VStack spacing={0}>
                            {comparisonData.map((row, index) => (
                                <MobileComparisonCard
                                    key={row.feature}
                                    feature={row.feature}
                                    traditional={row.traditional}
                                    hamza={row.hamza}
                                    index={index}
                                    isVisible={isVisible}
                                />
                            ))}
                        </VStack>
                    ) : (
                        /* Desktop/Tablet Table Layout */
                        <Box
                            bg="rgba(0, 0, 0, 0.5)"
                            backdropFilter="blur(4px)"
                            border="1px solid"
                            borderColor="gray.800"
                            borderTopRadius={{ base: 'xl', lg: '2xl' }}
                            overflow="hidden"
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                            transition="all 0.6s ease 0.8s"
                        >
                            <Table variant="unstyled" size="lg">
                                <Thead>
                                    <Tr borderBottom="1px solid rgba(128, 128, 128, 0.3)">
                                        <Th
                                            color="gray.300"
                                            fontSize={{ base: 'sm', md: 'base', lg: 'lg', xl: 'xl' }}
                                            fontWeight="medium"
                                            textTransform="none"
                                            letterSpacing="wide"
                                            py={6}
                                            borderBottom="none"
                                            p={{ base: 4, md: 6, lg: 8 }}
                                            w="33.333%"
                                        >
                                            <VStack spacing={{ base: 1, md: 2, lg: 3 }} align="start">
                                                <Text>Feature</Text>
                                                <Box w={{ base: '20px', md: '32px', lg: '48px' }} h="1px" bg="white" />
                                            </VStack>
                                        </Th>
                                        <Th
                                            color="red.400"
                                            fontSize={{ base: 'sm', md: 'base', lg: 'lg', xl: 'xl' }}
                                            fontWeight="medium"
                                            textTransform="none"
                                            letterSpacing="wide"
                                            textAlign="center"
                                            py={6}
                                            borderBottom="none"
                                            p={{ base: 4, md: 6, lg: 8 }}
                                            w="33.333%"
                                        >
                                            <VStack spacing={{ base: 1, md: 2, lg: 3 }}>
                                                <Text>Traditional</Text>
                                                <Box w={{ base: '24px', md: '40px', lg: '56px' }} h="1px" bg="rgba(239, 68, 68, 0.5)" />
                                            </VStack>
                                        </Th>
                                        <Th
                                            color="green.400"
                                            fontSize={{ base: 'sm', md: 'base', lg: 'lg', xl: 'xl' }}
                                            fontWeight="medium"
                                            textTransform="none"
                                            letterSpacing="wide"
                                            textAlign="center"
                                            py={6}
                                            borderBottom="none"
                                            p={{ base: 4, md: 6, lg: 8 }}
                                            w="33.333%"
                                        >
                                            <VStack spacing={{ base: 1, md: 2, lg: 3 }}>
                                                <Text>Hamza</Text>
                                                <Box w={{ base: '24px', md: '40px', lg: '56px' }} h="1px" bg="green.400" />
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
                    )}

                    {/* Call to Action Footer */}
                    <Box
                        bg="rgba(0, 0, 0, 0.5)"
                        bgGradient="linear(to-r, rgba(34, 197, 94, 0.05), rgba(34, 197, 94, 0.1))"
                        backdropFilter="blur(4px)"
                        border="1px solid"
                        borderColor="gray.800"
                        borderTopRadius="0"
                        borderBottomRadius={{ base: 'xl', lg: '2xl' }}
                        p={{ base: 4, md: 6, lg: 8 }}
                        textAlign="center"
                        mt={isMobile ? 0 : 0}
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                        transition="all 0.6s ease 1.4s"
                    >
                        <VStack spacing={{ base: 2, md: 3, lg: 4 }}>
                            <Text
                                fontSize={{ base: 'sm', md: 'base', lg: 'lg', xl: 'xl' }}
                                fontWeight="medium"
                                color="white"
                                letterSpacing="wide"
                                px={2}
                            >
                                Ready to maximize your selling potential?
                            </Text>
                            <Box
                                w={{ base: '48px', md: '64px', lg: '96px' }}
                                h="1px"
                                bgGradient="linear(to-r, green.400, green.500)"
                                mx="auto"
                            />
                            <Text
                                fontSize={{ base: 'xs', md: 'sm', lg: 'base' }}
                                color="gray.400"
                                fontWeight="300"
                                letterSpacing="wide"
                                px={2}
                            >
                                Join thousands of successful sellers on Hamza
                            </Text>
                        </VStack>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
});

ComparisonTable.displayName = 'ComparisonTable';

export default ComparisonTable;