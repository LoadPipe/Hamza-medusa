import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    SimpleGrid,
    Button,
} from '@chakra-ui/react';
import Link from 'next/link';

interface BrandCardProps {
    name: string;
    category: string;
    href: string;
    index: number;
    isVisible: boolean;
}

const brands = [
    {
        name: 'Amazon',
        category: 'E-commerce',
        href: '/category/gift-cards?subcategory=amazon',
    },
    {
        name: 'Apple',
        category: 'Technology',
        href: '/category/gift-cards?subcategory=apple',
    },
    {
        name: 'Steam',
        category: 'Gaming',
        href: '/category/gift-cards?subcategory=steam',
    },
    {
        name: 'Netflix',
        category: 'Streaming',
        href: '/category/gift-cards?subcategory=netflix',
    },
    {
        name: 'Spotify',
        category: 'Music',
        href: '/category/gift-cards?subcategory=spotify',
    },
    {
        name: 'Google',
        category: 'Apps & Games',
        href: '/category/gift-cards?subcategory=google',
    },
    {
        name: 'PlayStation',
        category: 'Gaming',
        href: '/category/gift-cards?subcategory=playstation',
    },
    {
        name: 'Uber',
        category: 'Transportation',
        href: '/category/gift-cards?subcategory=uber',
    },
    {
        name: 'Starbucks',
        category: 'Food & Drink',
        href: '/category/gift-cards?subcategory=starbucks',
    },
    {
        name: 'Nike',
        category: 'Fashion',
        href: '/category/gift-cards?subcategory=nike',
    },
    {
        name: 'Walmart',
        category: 'Retail',
        href: '/category/gift-cards?subcategory=walmart',
    },
    {
        name: 'eBay',
        category: 'Marketplace',
        href: '/category/gift-cards?subcategory=ebay',
    },
];

const BrandCard = memo(
    ({ name, category, index, isVisible, href }: BrandCardProps) => {
        return (
            <Box
                bg="rgba(255, 255, 255, 0.02)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                p={6}
                backdropFilter="blur(10px)"
                position="relative"
                overflow="hidden"
                cursor="pointer"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                transition={`all 0.6s ease ${1.2 + index * 0.1}s`}
                _hover={{
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    bg: 'rgba(255, 255, 255, 0.05)',
                }}
                role="group"
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)"
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                    transition="opacity 0.3s ease"
                />

                <Link href={href} passHref>
                    <VStack
                        spacing={3}
                        align="center"
                        justify="center"
                        position="relative"
                        zIndex={1}
                        h="100%"
                    >
                        <Text
                            fontSize={{ base: 'lg', md: 'xl' }}
                            fontWeight="bold"
                            color="white"
                            textAlign="center"
                            _groupHover={{ color: 'green.300' }}
                            transition="color 0.3s ease"
                        >
                            {name}
                        </Text>

                        <Box
                            w="40px"
                            h="1px"
                            bg="gray.700"
                            _groupHover={{ bg: 'green.400' }}
                            transition="background-color 0.3s ease"
                        />

                        <Text
                            fontSize="sm"
                            color="gray.400"
                            fontWeight="medium"
                            textAlign="center"
                        >
                            {category}
                        </Text>
                    </VStack>
                </Link>
            </Box>
        );
    }
);

BrandCard.displayName = 'BrandCard';

const PopularBrandsSection = memo(() => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const handleIntersection = useCallback(
        ([entry]: IntersectionObserverEntry[]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        },
        []
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
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
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.1}
                bg="radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)"
            />

            <Container maxW="6xl" position="relative" zIndex={1}>
                <VStack spacing={16}>
                    <VStack
                        spacing={0}
                        textAlign="center"
                        opacity={isVisible ? 1 : 0}
                        transform={
                            isVisible ? 'translateY(0)' : 'translateY(30px)'
                        }
                        transition="all 0.6s ease 0.2s"
                    >
                        <Text
                            fontSize={{ base: '2xl', md: '3xl', lg: '3xl' }}
                            fontWeight="300"
                            fontFamily="Arial, Helvetica, sans-serif"
                            letterSpacing="0.025em"
                            color="#FFFFFF"
                            lineHeight="2.25rem"
                            marginBottom="1rem"
                        >
                            Most Popular Brands
                        </Text>

                        <Box w="4rem" h="1px" bg="#875BB1" mx="auto" />
                    </VStack>

                    <SimpleGrid
                        columns={{ base: 2, sm: 3, lg: 4 }}
                        spacing={{ base: 4, md: 6 }}
                        w="100%"
                    >
                        {brands.map((brand, index) => (
                            <BrandCard
                                key={brand.name}
                                name={brand.name}
                                href={brand.href}
                                category={brand.category}
                                index={index}
                                isVisible={isVisible}
                            />
                        ))}
                    </SimpleGrid>

                    <Box
                        w="100%"
                        bg="linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        borderRadius="2xl"
                        p={{ base: 8, md: 12 }}
                        backdropFilter="blur(10px)"
                        textAlign="center"
                        position="relative"
                        overflow="hidden"
                        opacity={isVisible ? 1 : 0}
                        transform={
                            isVisible ? 'translateY(0)' : 'translateY(50px)'
                        }
                        transition="all 0.6s ease 2.4s"
                    >
                        <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            width="300px"
                            height="300px"
                            borderRadius="50%"
                            bg="linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(168, 85, 247, 0.1))"
                            filter="blur(80px)"
                            opacity={0.6}
                        />

                        <VStack spacing={6} position="relative" zIndex={1}>
                            <VStack spacing={4}>
                                <Text
                                    fontSize={{ base: 'xl', md: '2xl' }}
                                    fontWeight="bold"
                                    color="white"
                                >
                                    Can't find your favorite brand?
                                </Text>

                                <Text
                                    fontSize={{ base: 'md', md: 'lg' }}
                                    color="gray.300"
                                    maxW="2xl"
                                    lineHeight="1.6"
                                >
                                    We're constantly adding new brands and
                                    retailers to Hamza. Contact us to request a
                                    specific gift card.
                                </Text>
                            </VStack>

                            {/* TODO: Replace with actual form URL once available */}
                            <Link
                                href="https://secure.hamza.market/request-product/"
                                passHref
                            >
                                <Button
                                    as="a"
                                    size="lg"
                                    bg="linear-gradient(135deg, #22c55e, #16a34a)"
                                    color="white"
                                    fontWeight="bold"
                                    px={8}
                                    py={6}
                                    borderRadius="full"
                                    _hover={{
                                        bg: 'linear-gradient(135deg, #16a34a, #15803d)',
                                        transform: 'translateY(-2px)',
                                    }}
                                    _active={{
                                        transform: 'translateY(0)',
                                    }}
                                    transition="all 0.3s ease"
                                    rightIcon={
                                        <Box
                                            as="span"
                                            fontSize="lg"
                                            transform="rotate(-45deg)"
                                            transition="transform 0.3s ease"
                                            _groupHover={{
                                                transform: 'rotate(0deg)',
                                            }}
                                        >
                                            →
                                        </Box>
                                    }
                                >
                                    Request a Brand
                                </Button>
                            </Link>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
});

PopularBrandsSection.displayName = 'PopularBrandsSection';

export default PopularBrandsSection;
