import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
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
    Button,
    SimpleGrid,
    Flex,
    Link,
} from '@chakra-ui/react';
import { Check, X } from 'lucide-react';

interface FeeComparisonRowProps {
    platform: string;
    fee: string;
    additional: string;
    isHamza?: boolean;
    index: number;
    isVisible: boolean;
}

interface PricingPlanProps {
    name: string;
    price: string;
    description: string;
    features: Array<{ text: string; included: boolean }>;
    popular?: boolean;
    color: string;
    index: number;
    isVisible: boolean;
}

const feeComparison = [
    { platform: "Amazon", fee: "15%", additional: "+ payment fees" },
    { platform: "eBay", fee: "12.9%", additional: "+ PayPal fees" },
    { platform: "Etsy", fee: "8.5%", additional: "+ payment fees" },
    { platform: "Shopify", fee: "2.9%", additional: "+ monthly fees" },
    { platform: "Hamza", fee: "2-3%", additional: "All inclusive" },
];

const pricingPlans = [
    {
        name: "Traditional Platforms",
        price: "8-15%",
        description: "What you pay elsewhere",
        features: [
            { text: "High platform fees", included: false },
            { text: "Payment processing fees", included: false },
            { text: "7-14 day payment holds", included: false },
            { text: "Account suspension risk", included: false },
            { text: "Limited global reach", included: false },
            { text: "No data ownership", included: false },
        ],
        popular: false,
        color: "red",
    },
    {
        name: "Hamza Marketplace",
        price: "2-3%",
        description: "All-inclusive pricing",
        features: [
            { text: "Ultra-low platform fees", included: true },
            { text: "No hidden charges", included: true },
            { text: "Instant crypto payments", included: true },
            { text: "Decentralized security", included: true },
            { text: "Global market access", included: true },
            { text: "Full data control", included: true },
            { text: "DECOM token rewards", included: true },
            { text: "24/7 community support", included: true },
        ],
        popular: true,
        color: "green",
    },
];

const FeeComparisonRow = memo(({ platform, fee, additional, isHamza = false, index, isVisible }: FeeComparisonRowProps) => {
    return (
        <Tr
            bg={isHamza ? "rgba(34, 197, 94, 0.05)" : "transparent"}
            borderBottom="1px solid"
            borderBottomColor="gray.800"
            _last={{ borderBottom: 'none' }}
            _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
            transition="background 0.3s"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
            style={{
                transition: `all 0.6s ease ${1.2 + (index * 0.1)}s, background 0.3s`
            }}
        >
            <Td
                p={{ base: 3, sm: 4, lg: 6 }}
                color="white"
                fontWeight="medium"
                fontSize={{ base: 'sm', sm: 'base' }}
                borderBottom="none"
            >
                {platform}
            </Td>
            <Td
                p={{ base: 3, sm: 4, lg: 6 }}
                textAlign="center"
                color={isHamza ? "green.400" : "red.400"}
                fontWeight="bold"
                fontSize={{ base: 'sm', sm: 'base' }}
                borderBottom="none"
            >
                {fee}
            </Td>
            <Td
                p={{ base: 3, sm: 4, lg: 6 }}
                textAlign="center"
                color="gray.400"
                fontSize={{ base: 'sm', sm: 'base' }}
                borderBottom="none"
            >
                {additional}
            </Td>
            <Td
                p={{ base: 3, sm: 4, lg: 6 }}
                textAlign="center"
                borderBottom="none"
            >
                <Text
                    color={isHamza ? "green.400" : "red.400"}
                    fontWeight="medium"
                    fontSize={{ base: 'sm', sm: 'base' }}
                >
                    {isHamza ? "Best Value" : "High Cost"}
                </Text>
            </Td>
        </Tr>
    );
});

FeeComparisonRow.displayName = 'FeeComparisonRow';

const PricingPlan = memo(({ name, price, description, features, popular = false, color, index, isVisible }: PricingPlanProps) => {
    return (
        <Box
            position="relative"
            _hover={{ transform: 'translateY(-8px)' }}
            transition="transform 0.3s"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
            style={{
                transition: `all 0.6s ease ${1.8 + (index * 0.2)}s, transform 0.3s`
            }}
        >
            <Box
                bg="rgba(0, 0, 0, 0.5)"
                backdropFilter="blur(4px)"
                border="1px solid"
                borderColor={popular ? "rgba(34, 197, 94, 0.5)" : "gray.800"}
                borderRadius={{ base: 'xl', sm: '2xl' }}
                h="full"
                _hover={{
                    borderColor: popular ? "rgba(34, 197, 94, 0.7)" : "rgba(239, 68, 68, 0.3)",
                }}
                transition="border-color 0.3s"
                boxShadow={popular ? "0 0 20px rgba(34, 197, 94, 0.2)" : "none"}
            >
                {popular && (
                    <Box
                        position="absolute"
                        top={{ base: -3, sm: -4 }}
                        left="50%"
                        transform="translateX(-50%)"
                        bgGradient="linear(to-r, #22c55e, #10b981)"
                        color="black"
                        px={{ base: 4, sm: 6 }}
                        py={{ base: 1, sm: 2 }}
                        borderRadius="full"
                        fontSize={{ base: 'xs', sm: 'sm' }}
                        fontWeight="medium"
                    >
                        Recommended
                    </Box>
                )}

                <VStack spacing={{ base: 6, sm: 8 }} p={{ base: 6, sm: 8, lg: 10 }} h="full">
                    {/* Header */}
                    <VStack spacing={{ base: 3, sm: 4 }} textAlign="center">
                        <Text
                            fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }}
                            fontWeight="medium"
                            color="white"
                        >
                            {name}
                        </Text>
                        <VStack spacing={{ base: 1, sm: 2 }}>
                            <Text
                                fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
                                fontWeight="bold"
                                color={color === "green" ? "green.400" : "red.400"}
                            >
                                {price}
                            </Text>
                            <Text
                                color="gray.400"
                                fontSize={{ base: 'xs', sm: 'sm' }}
                            >
                                {description}
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Features */}
                    <VStack spacing={{ base: 3, sm: 4 }} flex="1" w="full">
                        {features.map((feature, featureIndex) => (
                            <Flex key={featureIndex} alignItems="center" gap={{ base: 2, sm: 3 }} w="full">
                                <Box
                                    w={{ base: 5, sm: 6 }}
                                    h={{ base: 5, sm: 6 }}
                                    borderRadius="full"
                                    bg={
                                        feature.included
                                            ? "rgba(34, 197, 94, 0.2)"
                                            : "rgba(239, 68, 68, 0.2)"
                                    }
                                    border="1px solid"
                                    borderColor={
                                        feature.included
                                            ? "rgba(34, 197, 94, 0.3)"
                                            : "rgba(239, 68, 68, 0.3)"
                                    }
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    flexShrink={0}
                                >
                                    <Icon
                                        as={feature.included ? Check : X}
                                        w={{ base: 3, sm: 4 }}
                                        h={{ base: 3, sm: 4 }}
                                        color={feature.included ? "green.400" : "red.400"}
                                    />
                                </Box>
                                <Text
                                    fontSize={{ base: 'xs', sm: 'sm' }}
                                    color={feature.included ? "gray.300" : "gray.500"}
                                >
                                    {feature.text}
                                </Text>
                            </Flex>
                        ))}
                    </VStack>

                    {/* CTA Button */}
                    <Box pt={{ base: 4, sm: 6 }} w="full">
                        {popular ? (
                            <Link href="https://admin.hamza.market/" isExternal w="full">
                                <Button
                                    as="span"
                                    w="full"
                                    bgGradient="linear(to-r, #22c55e, #10b981)"
                                    color="black"
                                    fontWeight="medium"
                                    py={{ base: 2, sm: 3 }}
                                    borderRadius="full"
                                    fontSize={{ base: 'sm', sm: 'base' }}
                                    size="lg"
                                    _hover={{
                                        bgGradient: "linear(to-r, #10b981, #059669)",
                                    }}
                                    cursor="pointer"
                                >
                                    Start Selling Now
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                w="full"
                                variant="outline"
                                borderColor="gray.600"
                                color="gray.400"
                                py={{ base: 2, sm: 3 }}
                                borderRadius="full"
                                bg="transparent"
                                fontSize={{ base: 'sm', sm: 'base' }}
                                size="lg"
                                _hover={{
                                    borderColor: "red.400",
                                    color: "red.400",
                                }}
                                disabled
                            >
                                Traditional Platform
                            </Button>
                        )}
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
});

PricingPlan.displayName = 'PricingPlan';

const PricingComparisonSection = memo(() => {
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
            maxW="1200px"
            mx="auto"
            px={{ base: 3, sm: 4 }}
            position="relative"
            zIndex={1}
        >
            {/* Section Header */}
            <VStack spacing={0} textAlign="center" mb={{ base: 12, sm: 16, lg: 20, xl: 32 }}>
                <Text
                    color="gray.500"
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    fontWeight="300"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    mb={{ base: 3, sm: 4, lg: 6 }}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                    transition="all 0.6s ease 0.2s"
                >
                    Transparent Pricing
                </Text>

                <Text
                    fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl', xl: '6xl' }}
                    fontWeight="300"
                    color="white"
                    mb={{ base: 4, sm: 6, lg: 8 }}
                    letterSpacing="-0.025em"
                    lineHeight="1.1"
                    px={2}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                    transition="all 0.6s ease 0.4s"
                >
                    Save More, <Text as="span" color="green.400" fontWeight="medium">Earn More</Text>
                </Text>

                <Box maxW="3xl" mx="auto" px={2}>
                    <Text
                        fontSize={{ base: 'sm', sm: 'base', md: 'lg', lg: 'xl', xl: '2xl' }}
                        fontWeight="300"
                        lineHeight="relaxed"
                        color="gray.300"
                        letterSpacing="wide"
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                        transition="all 0.6s ease 0.6s"
                    >
                        Compare our transparent, all-inclusive pricing with traditional marketplace fees.
                    </Text>
                </Box>

                <Box
                    w={{ base: '48px', sm: '64px', lg: '96px' }}
                    h="1px"
                    bgGradient="linear(to-r, transparent, green.400, transparent)"
                    mx="auto"
                    mt={{ base: 4, sm: 6, lg: 8 }}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                    transition="all 0.6s ease 0.8s"
                />
            </VStack>

            {/* Fee Comparison Table */}
            <Box mb={{ base: 12, sm: 16, lg: 24 }}>
                <Box
                    bg="rgba(0, 0, 0, 0.5)"
                    backdropFilter="blur(4px)"
                    border="1px solid"
                    borderColor="gray.800"
                    borderRadius={{ base: 'xl', sm: '2xl' }}
                    overflow="hidden"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                    transition="all 0.6s ease 1.0s"
                >
                    <Box overflow="auto">
                        <Table variant="unstyled" w="full">
                            <Thead>
                                <Tr borderBottom="1px solid" borderBottomColor="gray.800">
                                    <Th
                                        textAlign="left"
                                        p={{ base: 3, sm: 4, lg: 6 }}
                                        color="gray.300"
                                        fontWeight="medium"
                                        fontSize={{ base: 'sm', sm: 'base' }}
                                        borderBottom="none"
                                        textTransform="none"
                                    >
                                        Platform
                                    </Th>
                                    <Th
                                        textAlign="center"
                                        p={{ base: 3, sm: 4, lg: 6 }}
                                        color="gray.300"
                                        fontWeight="medium"
                                        fontSize={{ base: 'sm', sm: 'base' }}
                                        borderBottom="none"
                                        textTransform="none"
                                    >
                                        Base Fee
                                    </Th>
                                    <Th
                                        textAlign="center"
                                        p={{ base: 3, sm: 4, lg: 6 }}
                                        color="gray.300"
                                        fontWeight="medium"
                                        fontSize={{ base: 'sm', sm: 'base' }}
                                        borderBottom="none"
                                        textTransform="none"
                                    >
                                        Additional Costs
                                    </Th>
                                    <Th
                                        textAlign="center"
                                        p={{ base: 3, sm: 4, lg: 6 }}
                                        color="gray.300"
                                        fontWeight="medium"
                                        fontSize={{ base: 'sm', sm: 'base' }}
                                        borderBottom="none"
                                        textTransform="none"
                                    >
                                        Total Impact
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {feeComparison.map((item, index) => (
                                    <FeeComparisonRow
                                        key={item.platform}
                                        platform={item.platform}
                                        fee={item.fee}
                                        additional={item.additional}
                                        isHamza={item.platform === "Hamza"}
                                        index={index}
                                        isVisible={isVisible}
                                    />
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </Box>

            {/* Pricing Plans */}
            <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                spacing={{ base: 6, sm: 8, lg: 12 }}
                mb={{ base: 12, sm: 16, lg: 24 }}
            >
                {pricingPlans.map((plan, index) => (
                    <PricingPlan
                        key={plan.name}
                        name={plan.name}
                        price={plan.price}
                        description={plan.description}
                        features={plan.features}
                        popular={plan.popular}
                        color={plan.color}
                        index={index}
                        isVisible={isVisible}
                    />
                ))}
            </SimpleGrid>

            {/* Savings Calculator */}
            <Box
                bgGradient="linear(to-r, rgba(34, 197, 94, 0.1), rgba(168, 85, 247, 0.1))"
                border="1px solid rgba(34, 197, 94, 0.3)"
                borderRadius={{ base: 'xl', sm: '2xl' }}
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                transition="all 0.6s ease 2.4s"
            >
                <VStack
                    spacing={{ base: 4, sm: 6 }}
                    p={{ base: 6, sm: 8, lg: 12 }}
                    textAlign="center"
                >
                    <Text
                        fontSize={{ base: 'xl', sm: '2xl', lg: '3xl' }}
                        fontWeight="300"
                        color="white"
                    >
                        Calculate Your Savings
                    </Text>
                    <Text
                        color="gray.300"
                        maxW="2xl"
                        mx="auto"
                        lineHeight="relaxed"
                        fontSize={{ base: 'sm', sm: 'base' }}
                    >
                        On $10,000 in monthly sales, you could save up to $1,200 per month by switching to Hamza.
                    </Text>
                    <SimpleGrid
                        columns={{ base: 1, sm: 3 }}
                        spacing={{ base: 4, sm: 6 }}
                        maxW="2xl"
                        mx="auto"
                        w="full"
                    >
                        <VStack spacing={{ base: 1, sm: 2 }}>
                            <Text
                                color="red.400"
                                fontSize={{ base: 'lg', sm: 'xl' }}
                                fontWeight="bold"
                            >
                                $1,500
                            </Text>
                            <Text
                                color="gray.400"
                                fontSize={{ base: 'xs', sm: 'sm' }}
                            >
                                Traditional fees
                            </Text>
                        </VStack>
                        <VStack spacing={{ base: 1, sm: 2 }}>
                            <Text
                                color="green.400"
                                fontSize={{ base: 'lg', sm: 'xl' }}
                                fontWeight="bold"
                            >
                                $300
                            </Text>
                            <Text
                                color="gray.400"
                                fontSize={{ base: 'xs', sm: 'sm' }}
                            >
                                Hamza fees
                            </Text>
                        </VStack>
                        <VStack spacing={{ base: 1, sm: 2 }}>
                            <Text
                                color="white"
                                fontSize={{ base: 'lg', sm: 'xl' }}
                                fontWeight="bold"
                            >
                                $1,200
                            </Text>
                            <Text
                                color="gray.400"
                                fontSize={{ base: 'xs', sm: 'sm' }}
                            >
                                Monthly savings
                            </Text>
                        </VStack>
                    </SimpleGrid>
                </VStack>
            </Box>
        </Box>
    );
});

PricingComparisonSection.displayName = 'PricingComparisonSection';

export default PricingComparisonSection;