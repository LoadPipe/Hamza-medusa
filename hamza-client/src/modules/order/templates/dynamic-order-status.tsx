import React from 'react';
import { Flex, Text, Divider, Stack } from '@chakra-ui/react';
import { LuBox } from 'react-icons/lu';
import { IoMdInformationCircleOutline } from 'react-icons/io';

const DynamicOrderStatus = ({
    orderDate,
    paymentStatus,
    paymentType: paymentType,
    cartId,
}: {
    orderDate?: string;
    paymentStatus?: string;
    paymentType?: string;
    cartId?: string;
}) => {
    const capitalizeFirstLetter = (str?: string) =>
        str ? str.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()) : '';

    const removeUnderscores = (s?: string) => (s ? s.replaceAll('_', ' ') : '');

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
        }).format(date);
    };

    return (
        <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            align={{ base: 'flex-start', md: 'center' }}
        >
            {orderDate && (
                <Flex>
                    <Text>Order Date: {formatDate(orderDate)}</Text>
                </Flex>
            )}
            <Flex
                justifyContent={{ sm: 'center', md: 'flex-end' }}
                direction={'row'}
                fontSize={{ sm: '14px', md: '16px' }}
                fontWeight="bold"
                alignItems={'center'}
                ml={{ base: 0, md: 'auto' }}
                gap={1}
                my={'4'}
            >
                <LuBox width="18px" height="20px" />

                {paymentStatus === 'awaiting' && cartId ? (
                    <a
                        href={`http://localhost:8000/en/order/processing/${cartId}?paywith=evm&openqrmodal=true&checkout=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            background: '#94D42A',
                            color: 'black',
                            border: 'none',
                            borderRadius: '16px',
                            padding: '4px 12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Payment Awaiting
                    </a>
                ) : (
                    <Text>Payment {capitalizeFirstLetter(paymentStatus)}</Text>
                )}

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
                    {capitalizeFirstLetter(removeUnderscores(paymentType))}
                </Text>
            </Flex>
        </Stack>
    );
};

export default DynamicOrderStatus;
