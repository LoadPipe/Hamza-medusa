import React from 'react';

type OrderDetails = {
    thumbnail: string;
    title: string;
    description: string;
};
import OrderLeftColumn from '@modules/order/templates/order-left-column';
import OrderRightAddress from '@modules/order/templates/order-right-address';
import { Flex, Text, Link, Image } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

type Order = {
    id: string;
    display_id: string;
    created_at: string;
    details: OrderDetails;
    quantity: string;
    paid_total: number;
    currency_code: string;
    unit_price: number;
    thumbnail: string;
    title: string;
    description: string;
    variant: {
        product_id: string;
        metadata: {
            imgUrl?: string;
        };
    };
    region: {
        id: string;
        name: string;
    };
};

type OrderCardProps = {
    order: Order;
    handle: string;
    storeName: string;
    icon: string;
    address: any;
};

const ProcessingOrderCard = ({
    order,
    handle,
    storeName,
    icon,
    address,
}: OrderCardProps) => {
    if (!order) {
        return <div>Loading...</div>; // Display loading message if order is undefined
    }

    return (
        <Flex
            mb={4}
            color={'white'}
            justifyContent="space-between"
            maxWidth="100%"
            // flexDirection={{ base: 'column', md: 'row' }}
            flexDirection={'column'}
            gap={2}
        >
            <Flex
                mx={{ base: 'auto', md: 0 }}
                my={'10px'}
                display={{ base: 'flex' }}
                alignItems="center"
                gap={3}
            >
                <Link
                    href={`/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/store/${storeName}`}
                >
                    <Image
                        src={icon}
                        alt="Light Logo"
                        boxSize={{ base: '32px' }}
                        borderRadius="full"
                    />
                </Link>
                <Text
                    fontSize={{ base: '18px', md: '24px' }}
                    fontWeight="bold"
                    noOfLines={1}
                >
                    {storeName}
                </Text>
                <FaCheckCircle size={16} color="#3196DF" />
            </Flex>
            {/* Left Side: Default  */}

            <Flex
                justifyContent={{ base: 'center', md: 'unset' }}
                flexDir={{ base: 'column', md: 'row' }}
            >
                <OrderLeftColumn
                    order={order}
                    handle={handle}
                    showDate={false}
                />

                {/* Right Side: Address */}
                <OrderRightAddress address={address} />
            </Flex>
        </Flex>
    );
};

export default ProcessingOrderCard;
