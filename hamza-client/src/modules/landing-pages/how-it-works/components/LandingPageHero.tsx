import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  SimpleGrid,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { ArrowDown } from 'lucide-react';
import currencyIcons from '@/images/currencies/crypto-currencies';

interface LandingPageHeroProps {
  selectedLanguage: string;
}

const LandingPageHero = memo(({ selectedLanguage }: LandingPageHeroProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const cryptoLogos = [
    { name: "Bitcoin", icon: currencyIcons['btc'].src },
    { name: "Ethereum", icon: currencyIcons.eth.src },
    { name: "USDT", icon: currencyIcons.usdt.src },
    { name: "USDC", icon: currencyIcons.usdc.src },
  ];

  // Mount animation trigger
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = () => {
    document.getElementById("what-is-hamza")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      ref={sectionRef}
      as="section"
      position="relative"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      bg="black"
      color="white"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        inset="0"
        opacity={isVisible ? 0.1 : 0}
        transition="opacity 2s ease-out"
      >
        <Box
          position="absolute"
          inset="0"
          bgGradient="linear(to-br, rgba(34, 197, 94, 0.2), transparent, rgba(147, 51, 234, 0.2))"
        />
        <Box
          position="absolute"
          inset="0"
          background={`radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 0%, transparent 50%), 
                               radial-gradient(circle at 75% 75%, rgba(128, 0, 128, 0.1) 0%, transparent 50%)`}
        />
      </Box>

      {/* Desktop/Web Version - Hidden on mobile */}
      <Box
        display={{ base: 'none', sm: 'block' }}
        maxW="1200px"
        mx="auto"
        textAlign="center"
        position="relative"
        w="100%"
      >
        <VStack spacing={{ base: 12, lg: 16 }}>
          {/* Typography Hierarchy - Primary Headline */}
          <VStack spacing={{ base: 6, sm: 8 }}>
            {/* Overline - Small caps with tracking */}
            <Text
              color="gray.400"
              fontSize={{ base: 'xs', sm: 'sm' }}
              fontWeight="300"
              letterSpacing="0.2em"
              textTransform="uppercase"
              mb={{ base: 6, sm: 8 }}
              opacity={isVisible ? 1 : 0}
              transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
              transition="all 0.8s ease-out 0.1s"
            >
              The Future of Commerce
            </Text>

            {/* Primary Display Type */}
            <VStack as="h1" spacing={{ base: 2, sm: 4, lg: 6 }}>
              <Box
                fontSize={{ base: '4xl', sm: '6xl', lg: '8xl', xl: '9xl' }}
                fontWeight="200"
                lineHeight="0.9"
                letterSpacing="tight"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.8s ease-out 0.3s"
              >
                <Text
                  as="span"
                  bgGradient="linear(to-r, green.400, purple.500)"
                  bgClip="text"
                >
                  Decentralized
                </Text>
              </Box>

              <Text
                fontSize={{ base: '3xl', sm: '5xl', lg: '7xl', xl: '8xl' }}
                fontWeight="300"
                lineHeight="0.9"
                letterSpacing="tight"
                color="white"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.8s ease-out 0.5s"
              >
                E-Commerce
              </Text>

              {/* Reimagined with crypto icons */}
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                align="center"
                justify="center"
                gap={{ base: 4, sm: 8, lg: 12 }}
                pt={{ base: 2, sm: 4 }}
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.8s ease-out 0.7s"
              >
                <Text
                  fontSize={{ base: '2xl', sm: '4xl', lg: '6xl', xl: '7xl' }}
                  fontWeight="300"
                  color="white"
                  letterSpacing="tight"
                >
                  Reimagined
                </Text>

                {/* Crypto Icons */}
                <HStack
                  spacing={{ base: 4, sm: 6, lg: 8 }}
                  opacity={isVisible ? 1 : 0}
                  transform={isVisible ? 'translateX(0)' : 'translateX(20px)'}
                  transition="all 0.8s ease-out 0.9s"
                >
                  {cryptoLogos.map((crypto, index) => (
                    <Box
                      key={crypto.name}
                      opacity={isVisible ? 1 : 0}
                      transform={isVisible ? 'scale(1)' : 'scale(0.8)'}
                      transition={`all 0.6s ease-out ${1.1 + (index * 0.1)}s`}
                      _hover={{
                        transform: 'scale(1.15)',
                        filter: 'brightness(1.3)',
                      }}
                      cursor="pointer"
                      sx={{
                        animation: isVisible ? `float${index} 3s ease-in-out infinite ${1.5 + (index * 0.2)}s` : 'none',
                        '@keyframes float0': {
                          '0%, 100%': { transform: 'translateY(0px)' },
                          '50%': { transform: 'translateY(-8px)' },
                        },
                        '@keyframes float1': {
                          '0%, 100%': { transform: 'translateY(0px)' },
                          '50%': { transform: 'translateY(-6px)' },
                        },
                        '@keyframes float2': {
                          '0%, 100%': { transform: 'translateY(0px)' },
                          '50%': { transform: 'translateY(-10px)' },
                        },
                        '@keyframes float3': {
                          '0%, 100%': { transform: 'translateY(0px)' },
                          '50%': { transform: 'translateY(-7px)' },
                        },
                      }}
                    >
                      <Image
                        src={crypto.icon || "/placeholder.svg"}
                        alt={`${crypto.name} logo`}
                        w={{ base: 10, sm: 12, lg: 14 }}
                        h={{ base: 10, sm: 12, lg: 14 }}
                        opacity="0.8"
                      />
                    </Box>
                  ))}
                </HStack>
              </Flex>
            </VStack>

            {/* Subtitle */}
            <Box
              pt={{ base: 6, sm: 8, lg: 12 }}
              opacity={isVisible ? 1 : 0}
              transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
              transition="all 0.8s ease-out 1.5s"
            >
              <Text
                fontSize={{ base: 'lg', sm: 'xl', lg: '3xl' }}
                fontWeight="300"
                lineHeight="relaxed"
                color="gray.300"
                maxW="4xl"
                mx="auto"
                letterSpacing="wide"
                px={4}
              >
                The world's first truly decentralized marketplace where buyers and sellers trade directly, securely, and
                transparently on the blockchain.
              </Text>
            </Box>
          </VStack>

          {/* Call to Action */}
          <Box
            pt={{ base: 12, lg: 20 }}
            display="flex"
            justifyContent="center"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
            transition="all 0.8s ease-out 1.7s"
          >
            <VStack
              as="button"
              onClick={scrollToSection}
              spacing={{ base: 4, sm: 6 }}
              color="gray.400"
              cursor="pointer"
              _hover={{
                color: "green.400",
                transform: "translateY(-8px)",
              }}
              transition="all 0.5s ease"
            >
              <VStack spacing={2} textAlign="center">
                <Text
                  fontSize={{ base: 'xs', sm: 'sm' }}
                  fontWeight="500"
                  letterSpacing="0.15em"
                  textTransform="uppercase"
                >
                  Learn More
                </Text>
                <Box
                  w={{ base: 12, sm: 16 }}
                  h="1px"
                  bg="gray.600"
                  _groupHover={{ bg: "green.400" }}
                  transition="background-color 0.5s ease"
                  mx="auto"
                />
              </VStack>
              <Box
                sx={{
                  animation: `smoothBounce 2.5s ease-in-out infinite`,
                  '@keyframes smoothBounce': {
                    '0%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '50%': {
                      transform: 'translateY(12px)',
                    },
                  },
                }}
              >
                <Icon as={ArrowDown} w={{ base: 5, sm: 6 }} h={{ base: 5, sm: 6 }} />
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Mobile Version - Only visible on mobile */}
      <Box
        display={{ base: 'block', sm: 'none' }}
        maxW="400px"
        mx="auto"
        textAlign="center"
        position="relative"
        zIndex={10}
        w="100%"
        py={8}
      >
        <VStack spacing={8}>
          {/* Typography Hierarchy - Mobile Optimized */}
          <VStack spacing={6}>
            {/* Overline */}
            <Text
              color="gray.400"
              fontSize="xs"
              fontWeight="300"
              letterSpacing="0.2em"
              textTransform="uppercase"
              opacity={isVisible ? 1 : 0}
              transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
              transition="all 0.8s ease-out 0.1s"
            >
              The Future of Commerce
            </Text>

            {/* Mobile-optimized heading stack */}
            <VStack spacing={3}>
              <Text
                fontSize="3xl"
                fontWeight="200"
                lineHeight="0.9"
                letterSpacing="tight"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                transition="all 0.8s ease-out 0.3s"
              >
                <Text
                  as="span"
                  bgGradient="linear(to-r, green.400, purple.500)"
                  bgClip="text"
                >
                  Decentralized
                </Text>
              </Text>

              <Text
                fontSize="2xl"
                fontWeight="300"
                lineHeight="0.9"
                letterSpacing="tight"
                color="white"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                transition="all 0.8s ease-out 0.5s"
              >
                E-Commerce
              </Text>

              <Text
                fontSize="xl"
                fontWeight="300"
                color="white"
                letterSpacing="tight"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                transition="all 0.8s ease-out 0.7s"
              >
                Reimagined
              </Text>
            </VStack>

            {/* Mobile crypto icons - 4x1 grid */}
            <SimpleGrid
              columns={4}
              spacing={4}
              maxW="48"
              mx="auto"
              pt={4}
              opacity={isVisible ? 1 : 0}
              transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
              transition="all 0.8s ease-out 0.9s"
            >
              {cryptoLogos.map((crypto, index) => (
                <Box
                  key={crypto.name}
                  opacity={isVisible ? 1 : 0}
                  transform={isVisible ? 'scale(1)' : 'scale(0.8)'}
                  transition={`all 0.6s ease-out ${1.1 + (index * 0.1)}s`}
                  _hover={{
                    transform: 'scale(1.1)',
                    filter: 'brightness(1.2)',
                  }}
                  cursor="pointer"
                >
                  <Image
                    src={crypto.icon || "/placeholder.svg"}
                    alt={`${crypto.name} logo`}
                    w={8}
                    h={8}
                    opacity="0.8"
                  />
                </Box>
              ))}
            </SimpleGrid>

            {/* Mobile subtitle */}
            <Box
              pt={4}
              opacity={isVisible ? 1 : 0}
              transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
              transition="all 0.8s ease-out 1.5s"
            >
              <Text
                fontSize="sm"
                fontWeight="300"
                lineHeight="relaxed"
                color="gray.300"
                letterSpacing="wide"
                px={2}
              >
                The world's first truly decentralized marketplace where buyers and sellers trade directly, securely, and
                transparently on the blockchain.
              </Text>
            </Box>
          </VStack>

          {/* Mobile Call to Action */}
          <Box
            pt={8}
            display="flex"
            justifyContent="center"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
            transition="all 0.8s ease-out 1.7s"
          >
            <VStack
              as="button"
              onClick={scrollToSection}
              spacing={3}
              color="gray.400"
              cursor="pointer"
              _hover={{
                color: "green.400",
                transform: "translateY(-4px)",
              }}
              transition="all 0.5s ease"
            >
              <VStack spacing={2} textAlign="center">
                <Text
                  fontSize="xs"
                  fontWeight="500"
                  letterSpacing="0.15em"
                  textTransform="uppercase"
                >
                  Learn More
                </Text>
                <Box
                  w={10}
                  h="1px"
                  bg="gray.600"
                  _groupHover={{ bg: "green.400" }}
                  transition="background-color 0.5s ease"
                  mx="auto"
                />
              </VStack>
              <Box
                sx={{
                  animation: `bounceSmall 2.5s ease-in-out infinite`,
                  '@keyframes bounceSmall': {
                    '0%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '50%': {
                      transform: 'translateY(8px)',
                    },
                  },
                }}
              >
                <Icon as={ArrowDown} w={4} h={4} />
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
});

LandingPageHero.displayName = 'LandingPageHero';

export default LandingPageHero;