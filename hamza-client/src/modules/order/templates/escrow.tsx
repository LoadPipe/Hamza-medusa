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
	const [customerExist, setCustomerExist] = useState<true | false | null>(null);
	const [orderExist, setOrderExist] = useState<true | false | null>(null);
	const [escrowPaymentExist, setEscrowPaymentExist] = useState<true | false | null>(null);

	useEffect(() => {
		const fetchCustomerAndOrder = async () => {
			try {
					//customer
				  const customer = await getHamzaCustomer(true);
					if (!customer) {
						setCustomerExist(false);
						return;
					}
					setCustomerExist(true);
					setCustomer(customer);
					
					//order
					const order = await getSingleBucket(customer.id, undefined, undefined, id as string);			
					if (!order) {
						setOrderExist(false);
						return;
					}
					setOrderExist(true);
					setOrder(order);

					// escrow payment
					const escrowPayment = await getEscrowPayment(order);
					if (!escrowPayment) {
                        setEscrowPaymentExist(false);
					}
                    console.log("escrowPayment: ", escrowPayment);
					setEscrowPaymentExist(true);
					setEscrowPayment(escrowPayment);
			} catch (error) {
				  console.error("Error fetching customer or order:", error);
			}
		};

		fetchCustomerAndOrder();
	}, [id]);
	
	return (
        <Flex
            flexDir={'column'}
            width={'100%'}
            maxW={'800px'}
            mt="3rem"
            mb="5rem"
            mx="auto"
            p={{ base: '16px', md: '40px' }}
            borderRadius={'16px'}
            color="white"
            justifyContent={'center'}
            alignItems={'center'}
            backgroundColor={'#121212'}
        >
            <Box
                color="primary.green.900"
                mb="1rem"
                fontSize={{ base: '40px', md: '72px' }}
            >
                <MdOutlineHandshake />
            </Box>
            <Text fontSize={'24px'} fontWeight={700}>
                Escrow
            </Text>

						{/* customer and order */}
            {customerExist === null && <Text>Customer loading...</Text>}
            {customerExist === false && <Text>Customer not found</Text>}

            {orderExist === null && <Text>Order loading...</Text>}
            {orderExist === false && <Text>Order not found</Text>}
            {customerExist === true && orderExist === false && (
                <Text>The order ({id}) does not belong to this customer</Text>
            )}

            {orderExist === true && order && order.id}
            {orderExist === true && order && <OrderComponent order={order} />}

						{/* escrow payment */}
            {escrowPaymentExist === null && (
                <Text>Escrow status loading...</Text>
            )}
            {orderExist === true && escrowPaymentExist === false && order && (
                <Text>
                    Order found for ({order.id}) but escrow payment not found
                </Text>
            )}
            {orderExist === true &&
                escrowPaymentExist === true &&
                order &&
                escrowPayment && (escrowPayment.payerReleased === false) && (
                    <ReleaseEscrowDialog
                        order={order}
                        escrowPayment={escrowPayment}
                    />
                )}
            {escrowPaymentExist === true && escrowPayment && (
                <EscrowStatus payment={escrowPayment} />
            )}
        </Flex>
    );
};
