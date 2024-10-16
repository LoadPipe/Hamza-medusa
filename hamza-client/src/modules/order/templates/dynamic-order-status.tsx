import React from 'react';
import { Flex, Text, Divider } from '@chakra-ui/react';
import { LuBox } from 'react-icons/lu'; // Assuming LuBox is an icon
import { IoMdInformationCircleOutline } from 'react-icons/io';

const DynamicOrderStatus = ({
    paymentStatus,
    paymentType,
}: {
    paymentStatus?: string;
    paymentType?: string;
}) => {
    const capitalizeFirstLetter = (str?: string) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; // Handle undefined

    return (
        <Flex
            justifyContent={'flex-end'}
            direction={'row'}
            fontSize={'16px'}
            fontWeight="bold"
            alignItems={'center'}
            ml={'auto'}
            gap={1}
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

            <Text color={'primary.green.900'}>{paymentType}</Text>
        </Flex>
    );
};

export default DynamicOrderStatus;
