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
import { Star, TrendingUp, DollarSign, Quote } from 'lucide-react';

interface StatCardProps {
    icon: React.ElementType;
    value: string;
    label: string;
    index: number;
    isVisible: boolean;
}

interface TestimonialCardProps {
    name: string;
    business: string;
    avatar: string;
    revenue: string;
    growth: string;
    testimonial: string;
    rating: number;
    index: number;
    isVisible: boolean;
}

const stats = [
    { value: "97%", label: "Seller Satisfaction", icon: Star },
    { value: "340%", label: "Average Revenue Growth", icon: TrendingUp },
    { value: "$2.3M", label: "Total Seller Earnings", icon: DollarSign },
];

const successStories = [
    {
        name: "Sarah Chen",
        business: "Handmade Jewelry",
        avatar: "👩‍💼",
        revenue: "$45K",
        growth: "+340%",
        testimonial: "Switching to Hamza was the best decision for my business. Lower fees and instant payments have transformed my cash flow.",
        rating: 5,
    },
    {
        name: "Marcus Rodriguez",
        business: "Tech Accessories",
        avatar: "👨‍💻",
        revenue: "$78K",
        growth: "+280%",
        testimonial: "The global reach is incredible. I'm now selling to customers I never could have reached on traditional platforms.",
        rating: 5,
    },
    {
        name: "Emma Thompson",
        business: "Vintage Clothing",
        avatar: "👩‍🎨",
        revenue: "$32K",
        growth: "+420%",
        testimonial: "The decentralized approach gives me complete control over my store. No more worrying about account suspensions.",
        rating: 5,
    },
];

const StatCard = memo(({ icon, value, label, index, isVisible }: StatCardProps) => {
    return (
        <Box
            bg="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(4px)"
            border="1px solid"
            borderColor="gray.800"
            borderRadius={{ base: 'xl', sm: '2xl' }}
            textAlign="center"
            _hover={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}
            transition="border-color 0.3s"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
            style={{
                transition: `all 0.6s ease ${1.2 + (index * 0.2)}s, border-color 0.3s`
            }}
        >
            <VStack spacing={{ base: 3, sm: 4 }} p={{ base: 4, sm: 6, lg: 8 }}>
                <Box
                    w={{ base: '48px', sm: '64px' }}
                    h={{ base: '48px', sm: '64px' }}
                    mx="auto"
                    bgGradient="linear(to-br, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))"
                    borderRadius={{ base: 'xl', sm: '2xl' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ transform: 'scale(1.1)' }}
                    transition="transform 0.3s"
                >
                    <Icon as={icon} w={{ base: 6, sm: 8 }} h={{ base: 6, sm: 8 }} color="purple.400" />
                </Box>
                <Text
                    fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}
                    fontWeight="bold"
                    color="white"
                >
                    {value}
                </Text>
                <Text
                    color="gray.400"
                    fontWeight="300"
                    fontSize={{ base: 'sm', sm: 'base' }}
                >
                    {label}
                </Text>
            </VStack>
        </Box>
    );
});

StatCard.displayName = 'StatCard';

const TestimonialCard = memo(({ name, business, avatar, revenue, growth, testimonial, rating, index, isVisible }: TestimonialCardProps) => {
    return (
        <Box
            bg="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(4px)"
            border="1px solid"
            borderColor="gray.800"
            borderRadius={{ base: 'xl', sm: '2xl' }}
            h="full"
            _hover={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}
            transition="all 0.3s"
            role="group"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
            style={{
                transition: `all 0.6s ease ${1.8 + (index * 0.2)}s, border-color 0.3s`
            }}
        >
            <VStack spacing={{ base: 4, sm: 6 }} p={{ base: 4, sm: 6, lg: 8 }} h="full">
                {/* Quote Icon */}
                <Box
                    alignSelf="flex-start"
                    w={{ base: '40px', sm: '48px' }}
                    h={{ base: '40px', sm: '48px' }}
                    bgGradient="linear(to-br, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))"
                    borderRadius={{ base: 'lg', sm: 'xl' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _groupHover={{ transform: 'scale(1.1)' }}
                    transition="transform 0.3s"
                >
                    <Icon as={Quote} w={{ base: 5, sm: 6 }} h={{ base: 5, sm: 6 }} color="purple.400" />
                </Box>

                {/* Testimonial */}
                <Text
                    color="gray.300"
                    lineHeight="relaxed"
                    fontStyle="italic"
                    fontSize={{ base: 'sm', sm: 'base' }}
                    flex="1"
                >
                    "{testimonial}"
                </Text>

                {/* Rating */}
                <HStack spacing={1} alignSelf="flex-start">
                    {[...Array(rating)].map((_, i) => (
                        <Icon key={i} as={Star} w={{ base: 3, sm: 4 }} h={{ base: 3, sm: 4 }} color="yellow.400" fill="currentColor" />
                    ))}
                </HStack>

                {/* Seller Info */}
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    w="full"
                    pt={{ base: 3, sm: 4 }}
                    borderTop="1px solid"
                    borderColor="gray.800"
                >
                    <Flex alignItems="center" gap={{ base: 2, sm: 3 }}>
                        <Text fontSize={{ base: 'lg', sm: '2xl' }}>{avatar}</Text>
                        <Box>
                            <Text
                                color="white"
                                fontWeight="medium"
                                fontSize={{ base: 'sm', sm: 'base' }}
                            >
                                {name}
                            </Text>
                            <Text
                                color="gray.400"
                                fontSize={{ base: 'xs', sm: 'sm' }}
                            >
                                {business}
                            </Text>
                        </Box>
                    </Flex>

                    <Box textAlign="right">
                        <Text
                            color="green.400"
                            fontWeight="bold"
                            fontSize={{ base: 'sm', sm: 'base' }}
                        >
                            {revenue}
                        </Text>
                        <Text
                            color="purple.400"
                            fontSize={{ base: 'xs', sm: 'sm' }}
                        >
                            {growth}
                        </Text>
                    </Box>
                </Flex>
            </VStack>
        </Box>
    );
});

TestimonialCard.displayName = 'TestimonialCard';

const SuccessStoriesSection = memo(() => {
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
                    Success Stories
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
                    Real Sellers, <Text as="span" color="purple.400" fontWeight="medium">Real Results</Text>
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
                        See how sellers like you are achieving unprecedented growth on Hamza's decentralized marketplace.
                    </Text>
                </Box>

                <Box
                    w={{ base: '48px', sm: '64px', lg: '96px' }}
                    h="1px"
                    bgGradient="linear(to-r, transparent, purple.400, transparent)"
                    mx="auto"
                    mt={{ base: 4, sm: 6, lg: 8 }}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                    transition="all 0.6s ease 0.8s"
                />
            </VStack>

            {/* Stats Section */}
            <SimpleGrid
                columns={{ base: 1, sm: 3 }}
                spacing={{ base: 4, sm: 6, lg: 8 }}
                mb={{ base: 12, sm: 16, lg: 24 }}
            >
                {stats.map((stat, index) => (
                    <StatCard
                        key={stat.label}
                        icon={stat.icon}
                        value={stat.value}
                        label={stat.label}
                        index={index}
                        isVisible={isVisible}
                    />
                ))}
            </SimpleGrid>

            {/* Success Stories */}
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={{ base: 4, sm: 6, lg: 8 }}
                mb={{ base: 12, sm: 16, lg: 24 }}
            >
                {successStories.map((story, index) => (
                    <TestimonialCard
                        key={story.name}
                        name={story.name}
                        business={story.business}
                        avatar={story.avatar}
                        revenue={story.revenue}
                        growth={story.growth}
                        testimonial={story.testimonial}
                        rating={story.rating}
                        index={index}
                        isVisible={isVisible}
                    />
                ))}
            </SimpleGrid>

            {/* Bottom CTA */}
            <VStack
                spacing={{ base: 4, sm: 6 }}
                textAlign="center"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.6s ease 2.4s"
            >
                <Text
                    fontSize={{ base: 'xl', sm: '2xl', lg: '3xl' }}
                    fontWeight="300"
                    color="white"
                >
                    Your Success Story Starts Here
                </Text>
                <Text
                    color="gray.300"
                    maxW="2xl"
                    mx="auto"
                    lineHeight="relaxed"
                    fontSize={{ base: 'sm', sm: 'base' }}
                >
                    Join the growing community of successful sellers who have discovered the power of decentralized commerce.
                </Text>
                <Link href="https://admin.hamza.market/" isExternal>
                    <Button
                        as="span"
                        bgGradient="linear(to-r, #a855f7, #9333ea)"
                        color="white"
                        px={{ base: 6, sm: 8 }}
                        py={{ base: 2, sm: 3 }}
                        borderRadius="full"
                        fontWeight="medium"
                        fontSize={{ base: 'sm', sm: 'base' }}
                        _hover={{
                            bgGradient: "linear(to-r, #9333ea, #7c3aed)",
                            transform: 'scale(1.05)',
                        }}
                        transition="all 0.3s"
                        cursor="pointer"
                    >
                        Start Your Journey
                    </Button>
                </Link>
            </VStack>
        </Box>
    );
});

SuccessStoriesSection.displayName = 'SuccessStoriesSection';

export default SuccessStoriesSection;