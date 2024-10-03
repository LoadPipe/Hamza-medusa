import {
    Box,
    Flex,
    Text,
    Heading,
    Button,
    Link as ChakraLink,
} from '@chakra-ui/react';
import React from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';

interface VerifyFailProps {
    title: string;
    message: string;
    resendMessage: string;
    resendLink: string;
}

const VerifySuccess: React.FC<VerifyFailProps> = ({
    title = 'Verification Failed',
    message = ' We couldn’t verify your email address. Please check the verification link and try again, or request a new link below.',
    resendMessage,
    resendLink,
}) => {
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
            <Flex gap={'32px'} flexDir={'column'}>
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
                    Account Verified
                </Heading>

                <Text textAlign={'center'}>
                    Congratulations your account has now been verified.
                </Text>

                <Flex flexDirection={'row'} gap={'16px'}>
                    <ChakraLink
                        href={'/account/profile'}
                        flex="1 1 auto"
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
        </Flex>
    );
};

export default VerifySuccess;
