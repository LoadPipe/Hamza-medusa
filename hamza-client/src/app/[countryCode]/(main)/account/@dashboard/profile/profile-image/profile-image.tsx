import { Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const ProfileImage = () => {
    return (
        <Flex maxW={'858px'} width={'100%'}>
            <Flex
                width={'151.5px'}
                height={'151.5px'}
                borderRadius={'full'}
                backgroundColor={'white'}
            />
            <Flex
                alignSelf={'center'}
                ml="2rem"
                gap="18px"
                flexDirection={'column'}
            >
                <Flex gap={'15px'}>
                    <Button
                        backgroundColor={'primary.indigo.900'}
                        color={'white'}
                        borderRadius={'37px'}
                        fontSize={'18px'}
                        fontWeight={600}
                        height={'47px'}
                        width={'190px'}
                    >
                        Change Photo
                    </Button>
                    <Button
                        backgroundColor={'primary.indigo.900'}
                        color={'white'}
                        borderRadius={'37px'}
                        fontSize={'18px'}
                        fontWeight={600}
                        height={'47px'}
                        width={'190px'}
                    >
                        Remove Photo
                    </Button>
                </Flex>
                <Text color={'#555555'}>
                    At least 125 x 125 px PNG or JPG file. 1 MB maximum file
                    size
                </Text>
            </Flex>
        </Flex>
    );
};

export default ProfileImage;
