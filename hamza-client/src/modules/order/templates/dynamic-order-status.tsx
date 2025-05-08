import React from 'react';
import { Flex, Text, Divider } from '@chakra-ui/react';
import { LuBox } from 'react-icons/lu'; // Assuming LuBox is an icon
import { IoMdInformationCircleOutline } from 'react-icons/io';

const DynamicOrderStatus = ({
    paymentStatus,
    fulfillmentStatus,
}: {
    paymentStatus?: string;
    fulfillmentStatus?: string;
}) => {
    const capitalizeFirstLetter = (str?: string) =>
        str ? str.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()) : ''; // Capitalize every word's first char

    const removeUnderscores = (s?: string) => (s ? s.replaceAll('_', ' ') : '');

    return (
        <Flex
            justifyContent={{ sm: 'center', md: 'flex-end' }}
            direction={'row'}
            fontSize={{ sm: '14px', md: '16px' }}
            fontWeight="bold"
            alignItems={'center'}
            ml={'auto'}
            gap={1}
            my={'4'}
        >
            <LuBox width="18px" height="20px" />

            <Text>Payment {capitalizeFirstLetter(paymentStatus)}</Text>

            <IoMdInformationCircleOutline
                color="94D42A"
                width="12px"
                height="12px"
            />

            <Divider
                orientation="vertical"
                height="16px"
                borderColor="gray.400"
                mx={1}
            />

            <Text color={'primary.green.900'}>
                {capitalizeFirstLetter(removeUnderscores(fulfillmentStatus))}
            </Text>
        </Flex>
    );
};

export default DynamicOrderStatus;
