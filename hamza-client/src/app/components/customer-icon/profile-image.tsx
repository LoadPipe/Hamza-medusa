'use client';

import { useState } from 'react';
import { Image, Flex, Avatar } from '@chakra-ui/react';

const ProfileImage = ({ customerId }: { customerId?: string | null }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true); // Set error state when the image fails to load
    };
    const imageUrl = `https://api.dicebear.com/9.x/bottts/svg?seed=${customerId ?? ''}`;

    return (
        <Flex maxW={'858px'} width={'100%'}>
            {!imageError ? (
                <Image
                    src={imageUrl}
                    style={{ width: '120px' }}
                    borderRadius={'full'}
                    objectFit="cover"
                    alt="Profile Icon"
                    onError={handleImageError} // If image fails, trigger error
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
