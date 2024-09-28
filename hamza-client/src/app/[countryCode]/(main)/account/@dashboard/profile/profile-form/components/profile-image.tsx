'use client';

import { Button, Flex, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { Avatar } from '@chakra-ui/react';
import { size } from 'lodash';

type Profile = {
    firstName: string;
    lastName: string;
    walletAddress?: string
};

// Props get passed from form into image component
const ProfileImage: React.FC<Profile> = ({ firstName, lastName, walletAddress }) => {
    return (
        <Flex maxW={'858px'} width={'100%'}>
            <Image src={`https://api.dicebear.com/9.x/bottts/svg?seed=${walletAddress ?? ''}`} style={{ width: '120px' }}></Image>
        </Flex >
    );
};

export default ProfileImage;
