import {
    Box,
    Flex,
    Text,
    Heading,
    Button,
    Link as ChakraLink,
} from '@chakra-ui/react';
import React from 'react';
import { MdErrorOutline } from 'react-icons/md';

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
                <MdErrorOutline
                    size={72}
                    color="#E23636"
                    style={{ margin: '0 auto' }}
                />

                <Heading
                    textAlign={'center'}
                    as="h2"
                    size="lg"
                    variant="semi-bold"
                    fontSize={'24px'}
                >
                    {title}
                </Heading>

                <Text textAlign={'center'}>
                    We couldn’t verify your email address. Please check the
                    verification link and try again, or request a new link
                    below.
                </Text>

                <Flex flexDirection={'row'} gap={'16px'}>
                    <Button
                        flex="1 1 auto"
                        borderColor={'primary.green.900'}
                        color={'primary.green.900'}
                        borderWidth={'1px'}
                        backgroundColor={'transparent'}
                        borderRadius={'full'}
                    >
                        Cancel
                    </Button>
                    <ChakraLink
                        href={resendLink}
                        flex="1 1 auto"
                        _hover={{ textDecoration: 'none' }}
                    >
                        <Button
                            backgroundColor={'primary.green.900'}
                            borderRadius={'full'}
                            width="100%"
                        >
                            Resend
                        </Button>
                    </ChakraLink>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default VerifySuccess;
