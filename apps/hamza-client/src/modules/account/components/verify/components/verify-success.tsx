import {
    Flex,
    Text,
    Heading,
    Button,
    Link as ChakraLink,
} from '@chakra-ui/react';
import React from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';

const VerifySuccess = () => {
    return (
        <Flex
            maxW={'496px'}
            height={'auto'}
            borderRadius="8px"
            flexDirection="column"
            alignItems="center"
            justifyContent={'center'}
            p={'40px'}
            color="white"
        >
            <Flex
                gap={'32px'}
                justifyContent={'center'}
                alignItems={'center'}
                flexDir={'column'}
            >
                <FaRegCheckCircle
                    size={72}
                    color="green"
                    style={{ margin: '0 auto' }}
                />
                <Heading
                    textAlign={'center'}
                    as="h2"
                    size="lg"
                    variant="semi-bold"
                    fontSize={'24px'}
                >
                    Your account has been verified!
                </Heading>
                <Text textAlign={'center'}>
                    Your account is now fully activated, and you can start
                    enjoying all the features.
                </Text>

                <ChakraLink
                    href={'/'}
                    width={'162px'}
                    _hover={{ textDecoration: 'none' }}
                >
                    <Button
                        backgroundColor={'primary.green.900'}
                        borderRadius={'full'}
                        width="100%"
                    >
                        Explore
                    </Button>
                </ChakraLink>
            </Flex>
        </Flex>
    );
};

export default VerifySuccess;
