import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    VStack,
    Text,
    SimpleGrid,
    Button,
    HStack,
    Icon,
    Flex,
    Link,
} from '@chakra-ui/react';
import { DollarSign, Zap, Globe, Shield, Users, TrendingUp } from 'lucide-react';

interface AdvantageCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    stats: string;
    index: number;
    isVisible: boolean;
}

const benefits = [
    {
        title: "Ultra-Low Fees",
        description: "Pay only 2-3% in total fees compared to 8-15% on traditional platforms",
        icon: DollarSign,
        stats: "Save up to 80% on fees",
    },
    {
        title: "Instant Payments",
        description: "Receive cryptocurrency payments immediately upon order completion",
        icon: Zap,
        stats: "0-day payment hold",
    },
    {
        title: "Global Reach",
        description: "Sell to customers in 190+ countries without geographic restrictions",
        icon: Globe,
        stats: "190+ countries",
    },
    {
        title: "Secure Transactions",
        description: "Smart contracts ensure secure, transparent, and automated transactions",
        icon: Shield,
        stats: "100% secure",
    },
    {
        title: "Growing Community",
        description: "Join thousands of sellers in the fastest-growing decentralized marketplace",
        icon: Users,
        stats: "50K+ sellers",
    },
    {
        title: "Earn DECOM Tokens",
        description: "Get rewarded with platform tokens for every successful transaction",
        icon: TrendingUp,
        stats: "Bonus rewards",
    },
];

const AdvantageCard = memo(({ icon, title, description, stats, index, isVisible }: AdvantageCardProps) => {
    return (
        <Box
            bg="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(4px)"
            border="1px solid"
            borderColor="gray.800"
            borderRadius={{ base: 'xl', sm: '2xl' }}
            h="full"
            _hover={{
                borderColor: 'rgba(34, 197, 94, 0.3)',
            }}
            transition="all 0.3s"
            role="group"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
            style={{
                transition: `all 0.6s ease ${1.2 + (index * 0.1)}s, border-color 0.3s, transform 0.3s`
            }}
        >
            <VStack
                spacing={{ base: 4, sm: 6 }}
                p={{ base: 4, sm: 6, lg: 8 }}
                position="relative"
                h="full"
            >
                {/* Icon and Stats */}
                <Flex alignItems="start" justifyContent="space-between" w="full">
                    <Box
                        w={{ base: '48px', sm: '64px' }}
                        h={{ base: '48px', sm: '64px' }}
                        bgGradient="linear(to-br, rgba(34, 197, 94, 0.2), rgba(168, 85, 247, 0.2))"
                        borderRadius={{ base: 'xl', sm: '2xl' }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _groupHover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.3s"
                    >
                        <Icon as={icon} w={{ base: 6, sm: 8 }} h={{ base: 6, sm: 8 }} color="green.400" />
                    </Box>

                    <Box textAlign="right">
                        <Text
                            color="green.400"
                            fontSize={{ base: 'xs', sm: 'sm' }}
                            fontWeight="medium"
                        >
                            {stats}
                        </Text>
                    </Box>
                </Flex>

                {/* Content */}
                <VStack spacing={{ base: 2, sm: 3 }} align="start" w="full" flex="1">
                    <Text
                        fontSize={{ base: 'lg', sm: 'xl' }}
                        fontWeight="medium"
                        color="white"
                        _groupHover={{ color: 'green.400' }}
                        transition="color 0.3s"
                    >
                        {title}
                    </Text>
                    <Box
                        w={{ base: '24px', sm: '32px' }}
                        h="1px"
                        bg="gray.700"
                        _groupHover={{ bg: 'green.400' }}
                        transition="background 0.3s"
                    />
                    <Text
                        color="gray.400"
                        lineHeight="relaxed"
                        fontSize={{ base: 'xs', sm: 'sm', lg: 'base' }}
                    >
                        {description}
                    </Text>
                </VStack>

                {/* Hover Effect */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgGradient="linear(to-br, rgba(34, 197, 94, 0.05), rgba(168, 85, 247, 0.05))"
                    borderRadius={{ base: 'xl', sm: '2xl' }}
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                    transition="opacity 0.3s"
                    pointerEvents="none"
                />
            </VStack>
        </Box>
    );
});

AdvantageCard.displayName = 'AdvantageCard';

const SellerAdvantagesSection = memo(() => {
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
                    Seller Advantages
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
                    Maximize Your <Text as="span" color="green.400" fontWeight="medium">Success</Text>
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
                        Discover the powerful benefits that make Hamza the preferred choice for ambitious sellers worldwide.
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

            {/* Benefits Grid */}
            <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3 }}
                spacing={{ base: 4, sm: 6, lg: 8 }}
                mb={{ base: 12, sm: 16, lg: 24 }}
            >
                {benefits.map((benefit, index) => (
                    <AdvantageCard
                        key={benefit.title}
                        icon={benefit.icon}
                        title={benefit.title}
                        description={benefit.description}
                        stats={benefit.stats}
                        index={index}
                        isVisible={isVisible}
                    />
                ))}
            </SimpleGrid>

            {/* Call to Action */}
            <Flex justify="center">
                <Box
                    bg="rgba(34, 197, 94, 0.1)"
                    border="1px solid rgba(34, 197, 94, 0.3)"
                    borderRadius={{ base: 'xl', sm: '2xl' }}
                    maxW="2xl"
                    w="full"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                    transition="all 0.6s ease 1.8s"
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
                            Ready to Start Earning More?
                        </Text>
                        <Text
                            color="gray.300"
                            lineHeight="relaxed"
                            fontSize={{ base: 'sm', sm: 'base' }}
                        >
                            Join thousands of successful sellers who have already made the switch to decentralized commerce.
                        </Text>
                        <Link href="https://admin.hamza.market/" isExternal>
                            <Button
                                as="span"
                                bgGradient="linear(to-r, #22c55e, #10b981)"
                                color="black"
                                px={{ base: 6, sm: 8 }}
                                py={{ base: 2, sm: 3 }}
                                borderRadius="full"
                                fontWeight="medium"
                                fontSize={{ base: 'sm', sm: 'base' }}
                                _hover={{
                                    bgGradient: "linear(to-r, #10b981, #059669)",
                                    transform: 'scale(1.05)',
                                }}
                                transition="all 0.3s"
                                cursor="pointer"
                            >
                                Start Selling Today
                            </Button>
                        </Link>
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
});

SellerAdvantagesSection.displayName = 'SellerAdvantagesSection';

export default SellerAdvantagesSection;