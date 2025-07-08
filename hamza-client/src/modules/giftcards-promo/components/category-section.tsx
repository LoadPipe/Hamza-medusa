import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    SimpleGrid,
    Icon,
} from '@chakra-ui/react';
import {
    Gamepad2,
    ShoppingBag,
    Tv,
    Coffee,
    Shirt,
    Smartphone,
} from 'lucide-react';
import Link from 'next/link';

interface CategoryCardProps {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    color: string;
    bgGradient: string;
    index: number;
    isVisible: boolean;
}

const categories = [
    {
        icon: Gamepad2,
        title: 'Gaming',
        subtitle: 'Popular',
        color: 'purple',
        bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))',
    },
    {
        icon: ShoppingBag,
        title: 'E-commerce',
        subtitle: 'Popular',
        color: 'blue',
        bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
    },
    {
        icon: Tv,
        title: 'Streaming',
        subtitle: 'Popular',
        color: 'red',
        bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 127, 0.2))',
    },
    {
        icon: Coffee,
        title: 'Food & Drink',
        subtitle: 'Popular',
        color: 'orange',
        bgGradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.2))',
    },
    {
        icon: Shirt,
        title: 'Fashion',
        subtitle: 'Popular',
        color: 'pink',
        bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2))',
    },
    {
        icon: Smartphone,
        title: 'Technology',
        subtitle: 'Popular',
        color: 'green',
        bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',
    },
];

const CategoryCard = memo(({ icon, title, subtitle, color, index, isVisible }: CategoryCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isIconHovered, setIsIconHovered] = useState(false);
    const [hasInitialAnimationCompleted, setHasInitialAnimationCompleted] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const handleIconMouseEnter = useCallback(() => setIsIconHovered(true), []);
    const handleIconMouseLeave = useCallback(() => setIsIconHovered(false), []);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setHasInitialAnimationCompleted(true);
            }, 1200 + (index * 150));
            return () => clearTimeout(timer);
        }
    }, [isVisible, index]);

    return (
        <Link href="/en/category/gift-cards" passHref>
            <VStack
                spacing={2}
                align="center"
                cursor="pointer"
                opacity={isVisible ? 1 : 0}
                transform={
                    isVisible
                        ? isHovered
                            ? 'translateY(-4px) scale(1)'
                            : 'translateY(0) scale(1)'
                        : 'translateY(50px) scale(0.8)'
                }
                transition={
                    hasInitialAnimationCompleted
                        ? 'all 0.3s ease'
                        : `all 0.6s ease ${1.2 + (index * 0.15)}s`
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Box
                    w={20}
                    h={20}
                    borderRadius="xl"
                    bg={`${color}.500`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={2}
                    onMouseEnter={handleIconMouseEnter}
                    onMouseLeave={handleIconMouseLeave}
                    transform={isIconHovered ? 'rotate(5deg)' : 'rotate(0deg)'}
                    transition="transform 0.3s ease"
                >
                    <Icon
                        as={icon}
                        w={8}
                        h={8}
                        color="white"
                    />
                </Box>

                <VStack spacing={0} textAlign="center">
                    <Text
                        fontSize="md"
                        fontWeight="500"
                        fontFamily="Arial, Helvetica, sans-serif"
                        letterSpacing="0.025em"
                        color="rgb(255 255 255)"
                        lineHeight="1.5rem"
                        marginBottom="0.25rem"
                    >
                        {title}
                    </Text>

                    <Text
                        fontSize="xs"
                        fontFamily="Arial, Helvetica, sans-serif"
                        color="gray.400"
                        fontWeight="normal"
                        lineHeight="1rem"
                    >
                        {subtitle}
                    </Text>
                </VStack>
            </VStack>
        </Link>
    );
});

CategoryCard.displayName = 'CategoryCard';

const CategorySection = memo(() => {
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
            position="relative"
            bg="black"
        >
            <Box
                position="absolute"
                top="10%"
                left="5%"
                width="200px"
                height="200px"
                borderRadius="50%"
                bg="linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1))"
                filter="blur(80px)"
                opacity={0.6}
            />
            <Box
                position="absolute"
                bottom="10%"
                right="5%"
                width="250px"
                height="250px"
                borderRadius="50%"
                bg="linear-gradient(225deg, rgba(34, 197, 94, 0.1), rgba(168, 85, 247, 0.1))"
                filter="blur(100px)"
                opacity={0.6}
            />

            <Container maxW="6xl" position="relative" zIndex={1}>
                <VStack spacing={16}>
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
                            Popular Brands
                        </Text>

                        <VStack spacing={4}>
                            <Text
                                fontSize={{ base: '2xl', md: '3xl', lg: '6xl' }}
                                fontWeight="300"
                                fontFamily="Arial, Helvetica, sans-serif"
                                letterSpacing="-0.025em"
                                color="white"
                                lineHeight="1"
                                px={2}
                                marginBottom="1rem"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.4s"
                            >
                                <Text as="span" color="#4ADE80">Popular</Text> Gift Cards Available
                            </Text>

                            <Text
                                fontSize={{ base: 'xl', md: '2xl' }}
                                fontFamily="Arial, Helvetica, sans-serif"
                                color="white"
                                maxW="3xl"
                                lineHeight="1.4"
                                px={2}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.6s"
                            >
                                Choose from the world's most popular brands and retailers on
                                Hamza. From gaming to shopping, streaming to dining - we've got
                                you covered.
                            </Text>
                        </VStack>
                    </VStack>

                    <VStack
                        spacing={4}
                        textAlign="center"
                        mt={8}
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                        transition="all 0.6s ease 0.8s"
                    >
                        <Text
                            fontSize={{ base: '2xl', md: '3xl' }}
                            fontWeight="300"
                            fontFamily="Arial, Helvetica, sans-serif"
                            letterSpacing="0.025em"
                            color="#FFFFFF"
                            lineHeight="2.25rem"
                        >
                            Browse by Category
                        </Text>

                        <Box
                            w="4rem"
                            h="1px"
                            bg="#319C58"
                            mx="auto"
                        />
                    </VStack>

                    <SimpleGrid
                        columns={{ base: 2, md: 3, lg: 6 }}
                        spacing={{ base: 4, md: 6, lg: 8 }}
                        w="100%"
                    >
                        {categories.map((category, index) => (
                            <CategoryCard
                                key={category.title}
                                icon={category.icon}
                                title={category.title}
                                subtitle={category.subtitle}
                                color={category.color}
                                bgGradient={category.bgGradient}
                                index={index}
                                isVisible={isVisible}
                            />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
});

CategorySection.displayName = 'CategorySection';

export default CategorySection;