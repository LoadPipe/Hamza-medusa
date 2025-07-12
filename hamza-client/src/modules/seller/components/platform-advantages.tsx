import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    SimpleGrid,
    Icon,
} from '@chakra-ui/react';
import { DollarSign, Clock, Globe, Shield } from 'lucide-react';

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    index: number;
    isVisible: boolean;
}

const features = [
    {
        icon: DollarSign,
        title: 'Higher Profits',
        description: 'Keep 97-98% of your sales with our ultra-low fees',
    },
    {
        icon: Clock,
        title: 'Instant Payments',
        description: 'Get paid immediately in cryptocurrency',
    },
    {
        icon: Globe,
        title: 'Global Market',
        description: 'Reach customers worldwide without restrictions',
    },
    {
        icon: Shield,
        title: 'True Ownership',
        description: 'Your store, your data, your rules',
    },
];

const FeatureCard = memo(({ icon, title, description, index, isVisible }: FeatureCardProps) => {
    return (
        <Box
            bg="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(4px)"
            border="1px solid"
            borderColor="gray.800"
            borderRadius={{ base: 'xl', sm: '2xl' }}
            h="100%"
            _hover={{
                borderColor: 'rgba(34, 197, 94, 0.3)',
            }}
            transition="border-color 0.3s"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
            style={{
                transition: `all 0.6s ease ${index * 0.2}s, border-color 0.3s`
            }}
            role="group"
        >
            <VStack
                spacing={{ base: 3, sm: 4 }}
                p={{ base: 4, sm: 6 }}
                textAlign="center"
                h="100%"
            >
                <Box
                    w={{ base: '48px', sm: '64px' }}
                    h={{ base: '48px', sm: '64px' }}
                    mx="auto"
                    bgGradient="linear(to-br, rgba(34, 197, 94, 0.2), rgba(168, 85, 247, 0.2))"
                    borderRadius={{ base: 'xl', sm: '2xl' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _groupHover={{
                        transform: 'scale(1.1)'
                    }}
                    transition="transform 0.3s"
                >
                    <Icon as={icon} w={{ base: 6, sm: 8 }} h={{ base: 6, sm: 8 }} color="green.400" />
                </Box>

                <Text
                    fontSize={{ base: 'base', sm: 'lg' }}
                    fontWeight="medium"
                    color="white"
                >
                    {title}
                </Text>

                <Text
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    color="gray.400"
                    lineHeight="relaxed"
                >
                    {description}
                </Text>
            </VStack>
        </Box>
    );
});

FeatureCard.displayName = 'FeatureCard';

const PlatformAdvantagesSection = memo(() => {
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
            <VStack
                spacing={0}
                textAlign="center"
                mb={{ base: 12, sm: 16, lg: 20, xl: 32 }}
            >
                <Text
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    fontWeight="300"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    color="gray.500"
                    mb={{ base: 3, sm: 4, lg: 6 }}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                    transition="all 0.6s ease 0.2s"
                >
                    Platform Advantages
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
                    Why Sell on <Text as="span" color="green.400" fontWeight="medium">Hamza</Text>?
                </Text>

                <Box maxW="4xl" mx="auto" px={2}>
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
                        Break free from traditional marketplace limitations and maximize your earning potential with
                        blockchain-powered commerce.
                    </Text>
                </Box>

                <Box
                    w={{ base: "5rem", sm: "8rem" }}
                    h="2px"
                    bgGradient="linear(to-r, transparent, green.400, transparent)"
                    mx="auto"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                    transition="all 0.6s ease 0.6s"
                    mt={{ base: 2, sm: 4, lg: 6 }}
                />

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
                columns={{ base: 1, sm: 2, lg: 4 }}
                spacing={{ base: 4, sm: 6 }}
                mb={{ base: 12, sm: 16, lg: 20 }}
            >
                {features.map((feature, index) => (
                    <FeatureCard
                        key={feature.title}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        index={index}
                        isVisible={isVisible}
                    />
                ))}
            </SimpleGrid>
        </Box>
    );
});

PlatformAdvantagesSection.displayName = 'PlatformAdvantagesSection';

export default PlatformAdvantagesSection;