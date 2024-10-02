'use client';

import { useEffect, useState } from 'react';
import { Image, Flex } from '@chakra-ui/react';
import { getHamzaCustomer } from '@lib/data';

const ProfileImage = () => {
    const [customerId, setCustomerId] = useState<string | null>(null);

    // Fetch customer data on the client side
    useEffect(() => {
        async function fetchCustomer() {
            const customer = await getHamzaCustomer();
            if (customer) {
                setCustomerId(customer.id);
            }
        }
        fetchCustomer();
    }, []);

    const imageUrl = `https://api.dicebear.com/9.x/bottts/svg?seed=${customerId ?? ''}`;

    return (
        <Flex maxW={'858px'} width={'100%'}>
            <Image
                src={imageUrl}
                style={{ width: '120px' }}
                borderRadius={'full'}
                objectFit="cover"
                alt="Profile Icon"
            />
        </Flex>
    );
};

export default ProfileImage;
