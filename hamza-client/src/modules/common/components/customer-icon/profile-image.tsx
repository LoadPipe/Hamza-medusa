'use client';

import { useState } from 'react';
import { Image, Flex, Avatar } from '@chakra-ui/react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';

type ProfileImageProps = {
    centered?: boolean; // Optional prop to control centering, defaults to false
};

const ProfileImage = ({ centered = false }: ProfileImageProps) => {
    const [imageError, setImageError] = useState(false);
    const { authData, hnsAvatar } = useCustomerAuthStore();

    const handleImageError = () => {
        setImageError(true); // Set error state when the image fails to load
    };

    // Check if valid HNS
    const validAvatar = hnsAvatar && hnsAvatar !== '' ? hnsAvatar : null;

    // Ternary HNS : Dicebear
    const imageUrl =
        validAvatar ??
        `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${authData?.wallet_address ?? ''}`;

    return (
        <Flex
            maxW={'858px'}
            width={'100%'}
            justifyContent={centered ? 'center' : 'flex-start'}
            alignItems={centered ? 'center' : 'flex-start'}
        >
            {!imageError ? (
                <Image
                    src={imageUrl} // Check for empty string
                    style={{ width: '120px' }}
                    borderRadius={'full'}
                    objectFit="cover"
                    alt="Profile Icon"
                    onError={handleImageError}
                />
            ) : (
                <Avatar
                    name="Customer Avatar"
                    size="sm"
                    borderRadius={'full'}
                    objectFit="cover"
                />
            )}
        </Flex>
    );
};

export default ProfileImage;
