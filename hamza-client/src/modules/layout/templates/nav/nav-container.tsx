'use client';
import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function NavContainer(props: { children: React.ReactNode }) {
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsHidden(window.innerWidth < 500);
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Flex
            userSelect={'none'}
            zIndex={'2'}
            className="sticky top-0"
            width="100%"
            height={{ base: '60px', md: '125px' }}
            justifyContent={'center'}
            alignItems={'center'}
            backgroundColor={'#020202'}
            display={isHidden ? 'none' : 'flex'}
        >
            {props.children}
        </Flex>
    );
}
