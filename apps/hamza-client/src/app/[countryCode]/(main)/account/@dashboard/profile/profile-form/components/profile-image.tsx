'use client';

import { Button, Flex, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { Avatar } from '@chakra-ui/react';
import { size } from 'lodash';

type Profile = {
    firstName: string;
    lastName: string;
    uniqueKey?: string;
};

// Props get passed from form into image component
const ProfileImage: React.FC<Profile> = ({
    firstName,
    lastName,
    uniqueKey,
}) => {
    return (
        <Flex maxW={'120px'} width={'100%'}>
            <Image
                src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${uniqueKey ?? ''}`}
                style={{ width: '120px' }}
            ></Image>
        </Flex>
    );
};

export default ProfileImage;
