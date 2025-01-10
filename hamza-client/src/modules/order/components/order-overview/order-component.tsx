import { Box, Button, Divider, Flex, Link, Text } from '@chakra-ui/react';
import DynamicOrderStatus from '@/modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@/modules/order/templates/order-total-amount';
import DeliveredCard from '@modules/account/components/delivered-card';
import {
    Collapse,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    VStack,
} from '@chakra-ui/react';
import OrderTimeline from '../order-timeline';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { upperCase } from 'lodash';
import { useState } from 'react';
import router from 'next/router';
import { toast } from 'react-hot-toast';
import { addToCart, enrichLineItems } from '@/modules/cart/actions';
import { LineItem } from '@medusajs/medusa';
import { retrieveOrder } from '@/lib/data';
import { Order } from '@medusajs/medusa';
import { notFound } from 'next/navigation';

export const OrderComponent = ({ order }: { order: any }) => {
    // console.log('order: ', JSON.stringify(order));
    // const [expandViewOrder, setExpandViewOrder] = useState(false);

    // const toggleViewOrder = (orderId: any) => {
    //     setExpandViewOrder(expandViewOrder === orderId ? null : orderId);
    // };

    // const subTotal = order.items.reduce(
    //     (acc: number, item: any) => acc + item.unit_price * item.quantity,
    //     0
    // );

    return <div>OrderComponent {order.id}</div>;
};
