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
import { PaymentDefinition } from "@/web3/contracts/escrow";

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
	const [order, setOrder] = useState<any>(null);
	const [escrowPayment, setEscrowPayment] = useState<PaymentDefinition | null>(null);

	useEffect(() => {
		const fetchCustomerAndOrder = async () => {
			try {
				if (order) return;
				  const customer = await getHamzaCustomer(true);
					setCustomer(customer);

					if (customer) {
						  const order = await getSingleBucket(customer.id, undefined, undefined, id as string);
							setOrder(order);
					}
			} catch (error) {
				  console.error("Error fetching customer or order:", error);
			}
		};
		fetchCustomerAndOrder();
	}, [id, order, customer]);

	useEffect(() => {
		const fetchEscrowPayment = async () => {
			try {
				if (!order) return;
				const escrow_payment = await getEscrowPayment(order);
				setEscrowPayment(escrow_payment);
				console.log("escrow_payment: ", escrow_payment);
			} catch (error) {
				console.error('Error fetching escrow payment:', error);
			}
		};
		fetchEscrowPayment();
	}, [order]);

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
					{order && <ReleaseEscrowDialog />}

					{escrowPayment && <EscrowStatus payment={escrowPayment} />}
			</Flex>
	);
};
