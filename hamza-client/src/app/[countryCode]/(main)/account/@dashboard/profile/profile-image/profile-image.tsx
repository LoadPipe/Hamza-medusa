'use client';

import { Button, Flex, Text, Image } from '@chakra-ui/react';
import React, { useEffect } from 'react';
// import { Avatar } from '@medusajs/ui';
import { Avatar } from '@chakra-ui/react';
import useProfile from '@store/profile/profile';

type Customer = {
    first_name: string;
    last_name: string;
};

const ProfileImage = ({ customer }: { customer: Customer }) => {
    const { firstName, lastName, setFirstName, setLastName } = useProfile();

    useEffect(() => {
        setFirstName(customer.first_name);
        setLastName(customer.last_name);
    }, [customer, setFirstName, setLastName]);
    return (
        <Flex maxW={'858px'} width={'100%'}>
            <Avatar
                name={`${firstName} ${lastName}`}
                size="2xl"
                // src="https://bit.ly/ryan-florence"
                width={'151.5px'}
                height={'151.5px'}
                bgColor={'primary.green.900'}
            />
            <Flex
                alignSelf={'center'}
                ml="2rem"
                gap="18px"
                flexDirection={'column'}
            >
                <Flex gap={'15px'}>
                    {/* <Button
                        backgroundColor={'primary.indigo.900'}
                        color={'white'}
                        borderRadius={'37px'}
                        fontSize={'18px'}
                        fontWeight={600}
                        height={'47px'}
                        width={'190px'}
                    >
                        Change Photo
                    </Button> */}
                    {/* <Button
                        backgroundColor={'primary.indigo.900'}
                        color={'white'}
                        borderRadius={'37px'}
                        fontSize={'18px'}
                        fontWeight={600}
                        height={'47px'}
                        width={'190px'}
                    >
                        Remove Photo
                    </Button> */}
                </Flex>
                {/* <Text color={'#555555'}>
                    At least 125 x 125 px PNG or JPG file. 1 MB maximum file
                    size
                </Text> */}
            </Flex>
        </Flex>
    );
};

export default ProfileImage;
