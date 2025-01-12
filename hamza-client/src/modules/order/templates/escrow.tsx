"use client"
import { Box, Flex, Text } from "@chakra-ui/react";
import { MdOutlineHandshake } from "react-icons/md";
import { OrderComponent } from "@/modules/order/components/order-overview/order-component";
import { useParams } from 'next/navigation';
import { getHamzaCustomer, getSingleBucket } from "@/lib/data";
import { useEffect, useState } from "react";
import { ReleaseEscrowDialog } from "../components/escrow/release-escrow-dialog";
import EscrowStatus from "../components/order-overview/escrow-status";
import { getEscrowPayment } from "@/utils/order-escrow";
import { Order, PaymentDefinition } from "@/web3/contracts/escrow";
import { Order as MedusaOrder } from "@medusajs/medusa";

interface Customer {
	id: string;
	// ... other properties
}

// TODO: need to get the escrow address and chain id for releasing
// TODO: user must connect the chain id that belongs to the order?
// TODO: the escrow contract is queried to make sure that the specified order exists in escrow, that it hasn’t yet been released, and that there is money to release
// TODO: API call to release escrow
// TODO: When escrow completes, api should be made to sync with the order table escrow_status 
export const Escrow = () => {
	const { id } = useParams();
	const [customer, setCustomer] = useState<Customer | null>(null);
	const [order, setOrder] = useState<Order | null>(null);
	const [escrowPayment, setEscrowPayment] = useState<PaymentDefinition | null>(null);
	const [hasFetchedOrder, setHasFetchedOrder] = useState(false);
	const [hasFetchedOrderEscrow, setHasFetchedOrderEscrow] = useState(false);

	useEffect(() => {
		if (hasFetchedOrder) return;
		const fetchCustomerAndOrder = async () => {
			try {
				  const customer = await getHamzaCustomer(true);
					setCustomer(customer);

					if (customer) {
						  const order = await getSingleBucket(customer.id, undefined, undefined, id as string);
							setOrder(order);
					}
			} catch (error) {
				  console.error("Error fetching customer or order:", error);
			} finally {
				setHasFetchedOrder(true);
			}
		};
		fetchCustomerAndOrder();
	}, [id, order, customer, hasFetchedOrder]);

	useEffect(() => {
		if (!order) return;
		if (escrowPayment) return;
		if (hasFetchedOrderEscrow) return;
		const fetchEscrowPayment = async () => {
			try {
				const escrow_payment = await getEscrowPayment(order);
				console.log("escrow_payment: ", escrow_payment);
				setEscrowPayment(escrow_payment);
				setHasFetchedOrderEscrow(true);
			} catch (error) {
				console.error('Error fetching escrow payment:', error);
			}
		};
		fetchEscrowPayment();
	}, [order, escrowPayment, hasFetchedOrderEscrow]);

	return (
		<Flex
				flexDir={'column'}
				width={'100%'}
				maxW={'1024px'}
				mt="3rem"
				mb="5rem"
				mx="auto"
				p={{ base: '16px', md: '40px' }}
				borderRadius={'16px'}
				color="white"
				justifyContent={'center'}
				alignItems={'center'}
				backgroundColor={'#121212'}>
					<Box
						color="primary.green.900"
						mb="1rem"
						fontSize={{ base: '40px', md: '72px' }}>
							<MdOutlineHandshake />
					</Box>
					<Text fontSize={'24px'} fontWeight={700}>
							Escrow
					</Text>
					{/* {customer && customer.id} */}
					{!order && <Text>Order loading...</Text>}
					{order && order.id}
					
					{/* <OrderComponent order={order} /> */}
					{order && escrowPayment && <ReleaseEscrowDialog order={order} escrowPayment={escrowPayment} />}

					{escrowPayment && <EscrowStatus payment={escrowPayment} />}
			</Flex>
	);
};
