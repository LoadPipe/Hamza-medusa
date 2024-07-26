'use client';

import { Button, Flex, Text, Image } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Avatar } from '@chakra-ui/react';
import { getCustomer, listRegions, updateCustomer } from '@lib/data';

type Customer = {
    first_name: string;
    last_name: string;
};

const ProfileImage = (props: any) => {
    return (
        <Flex maxW={'858px'} width={'100%'}>
            <Avatar
                name={`${props.firstName} ${props.lastName}`}
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
