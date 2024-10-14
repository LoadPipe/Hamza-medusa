'use client';

import { Box, keyframes, Text } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import HamzaLogoBlack from '../../../../public/images/logo/hamza-logo-black.svg'; // Ensure this is a transparent image

// Define the keyframes for the gradient animation (top to bottom)
const moveGradient = keyframes`
  0% {
    background-position: 50% 100%;  // Start at the bottom
  }
  100% {
    background-position: 50% 0%;    // Move to the top
  }
`;

interface HamzaLogoLoaderProps {
    message?: string; // Optional message prop
}

const HamzaLogoLoader: React.FC<HamzaLogoLoaderProps> = ({
    message = 'Processing Order',
}) => {
    // Create an animation based on the keyframes with a faster speed
    const gradientAnimation = `${moveGradient} 0.75s ease-in-out infinite`;

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            zIndex="9999"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor="#040404"
            flexDirection={'column'}
        >
            <Box
                position="relative"
                width="100px"
                height="100px"
                overflow="hidden"
                borderRadius="12px"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                {/* Gradient animation */}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    background="linear-gradient(180deg, #84C441 0%,  #7B61FF 100%)"
                    backgroundSize="200% 200%" // Adjusted for smoother blending
                    animation={gradientAnimation}
                    zIndex="1"
                />

                {/* Image container */}
                <Image
                    src={HamzaLogoBlack}
                    alt="H"
                    width={50}
                    height={50} // Set a fixed width and height
                    style={{ zIndex: 2, position: 'relative' }} // Ensure image is above the gradient
                />
            </Box>
            <Text color="white" mt={2}>
                {message}
                <Box as="span">...</Box>
            </Text>
        </Box>
    );
};

export default HamzaLogoLoader;
