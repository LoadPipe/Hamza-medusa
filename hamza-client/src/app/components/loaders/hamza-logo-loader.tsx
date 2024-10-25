'use client';

import { Box, keyframes, Text } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import HamzaLogoBlack from '../../../../public/images/logo/hamza-logo-black.svg'; // Ensure this is a transparent image

// Define the keyframes for the smooth infinite gradient animation
const moveGradient = keyframes`
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
`;

interface HamzaLogoLoaderProps {
    message?: string; // Optional message prop
    messages?: string[]; // Array of messages for rotating text
    textAnimOptions?: { speed: number }; // Text animation options
}

const HamzaLogoLoader: React.FC<HamzaLogoLoaderProps> = ({
                                                             message = 'Processing Order',
                                                             messages = [],
                                                             textAnimOptions = { speed: 2500 }
                                                         }) => {
    // State to track the current message index for rotating text
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    // Effect to rotate through the messages
    useEffect(() => {
        if (messages.length > 0) {
            const intervalId = setInterval(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
            }, textAnimOptions.speed);

            return () => clearInterval(intervalId);
        }
    }, [messages, textAnimOptions.speed]);

    // Determine the message to display
    const displayedMessage = messages.length > 0 ? messages[currentMessageIndex] : message;

    // Create an animation based on the keyframes with a smoother infinite loop
    const gradientAnimation = `${moveGradient} 3s ease-in-out infinite`;

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
              {displayedMessage}
              <Box as="span">...</Box>
          </Text>
      </Box>
    );
};

export default HamzaLogoLoader;
