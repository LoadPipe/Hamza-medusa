'use client';

import { useState } from 'react';
import { Image, Flex, Avatar } from '@chakra-ui/react';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

const ProfileImage = () => {
    const [imageError, setImageError] = useState(false);
    const { authData } = useCustomerAuthStore();

    const handleImageError = () => {
        setImageError(true); // Set error state when the image fails to load
    };
    const imageUrl = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${authData?.wallet_address ?? ''}`;

    return (
        <Flex maxW={'858px'} width={'100%'}>
            {!imageError ? (
                <Image
                    src={imageUrl}
                    style={{ width: '120px' }}
                    borderRadius={'full'}
                    objectFit="cover"
                    alt="Profile Icon"
                    onError={handleImageError}
                />
            ) : (
                <Avatar
                    name="Customer Avatar"
                    size="xl"
                    bg="gray.300"
                    src="" // Avatar fallback, empty src
                />
            )}
        </Flex>
    );
};

export default ProfileImage;
