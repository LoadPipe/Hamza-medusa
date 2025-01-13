"use client"
import { Button, Box, Flex, Text } from "@chakra-ui/react";
import { MdOutlineHandshake } from "react-icons/md";
import { OrderComponent } from "@/modules/order/components/order-overview/order-component";
import { useParams } from 'next/navigation';
import { getHamzaCustomer, getSingleBucket } from "@/lib/data";
import { useEffect, useState } from "react";
import { ReleaseEscrowDialog } from "../components/escrow/release-escrow-dialog";
import EscrowStatus from "../components/order-overview/escrow-status";
import { getEscrowPayment } from "@/utils/order-escrow";
import { Order, PaymentDefinition } from "@/web3/contracts/escrow";
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Loading from "@/app/[countryCode]/(main)/account/loading";

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
    const [isClient, setIsClient] = useState(false); // New state to track client-side rendering

    const { isConnected, status } = useAccount();

    useEffect(() => {
        setIsClient(true); // Set to true when the component is mounted on the client
    }, []);

    useEffect(() => {
        if (!isConnected) {
            console.log("User is not connected");
            return;
        }

		const fetchCustomerAndOrder = async () => {
			try {
				// Fetch customer
				const customer = await getHamzaCustomer(true);
				setCustomerExist(!!customer);
				if (!customer) {
                    setOrderExist(false);
                    setEscrowPaymentExist(false);
                    return;
                };
				setCustomer(customer);

				// Fetch order
				const order = await getSingleBucket(customer.id, undefined, undefined, id as string);
				setOrderExist(!!order);
				if (!order) {
                    setEscrowPaymentExist(false);
                    return;
                };
				setOrder(order);

				// Fetch escrow payment
				const escrowPayment = await getEscrowPayment(order);
				setEscrowPaymentExist(!!escrowPayment);
				if (!escrowPayment) return;
				setEscrowPayment(escrowPayment);
			} catch (error) {
				console.error("Error fetching customer, order, or escrow payment:", error);
			}
		};

		fetchCustomerAndOrder();
	}, [id, isConnected]);
	
    if (!isClient) {
        return <LoginBox isClient={isClient} />; // Render nothing on the server
    } 

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
            {!isConnected ? (
                <LoginBox isClient={isClient} />
            ) : (
                <>
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

                    {/* Customer and Order Status */}
                    {customerExist === null ? (
                        <Text>Customer loading...</Text>
                    ) : customerExist === false ? (
                        <Text>Customer not found</Text>
                    ) : orderExist === null ? (
                        <Text>Order loading...</Text>
                    ) : orderExist === false ? (
                        <Text>Order not found</Text>
                    ) : orderExist === true && !order ? (
                        <Text>The order ({id}) does not belong to this customer</Text>
                    ) : order &&(
                        <>
                            {order.id}
                            <OrderComponent order={order} />
                        </>
                    )}

                    {/* Escrow Payment Status */}
                    {escrowPaymentExist === null ? (
                        <Text>Escrow status loading...</Text>
                    ) : orderExist === true && escrowPaymentExist === false && order ? (
                        <Text>
                            Order found for ({order.id}) but escrow payment not found
                        </Text>
                    ) : escrowPaymentExist === true && escrowPayment && order ? (
                        <>
                            {escrowPayment.payerReleased === false && (
                                <ReleaseEscrowDialog
                                    order={order}
                                    escrowPayment={escrowPayment}
                                />
                            )}
                            <EscrowStatus payment={escrowPayment} />
                        </>
                    ) : null}
                </>
            )}
        </Flex>
    );
};

const LoginBox = ({ isClient }: { isClient: boolean }) => {
    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            zIndex="9999"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor="#040404"
            color={'white'}
            flexDirection={'column'}
        >
            <Flex
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'12px'}
                gap={5}
                backgroundColor={'#121212'}
                height={'400px'}
                width={'500px'}
            >
                <Text
                    color={'white'}
                    fontSize={'24px'}
                >
                    Proceed to Escrow
                </Text>
                <Text
                    color={'white'}
                    textAlign={'center'}
                >
                    To view escrow details, please connect your wallet
                </Text>
                <ConnectButton.Custom>
                    {({ openConnectModal, authenticationStatus }) => {
                        if (authenticationStatus === 'unauthenticated' && isClient) {
                            return (
                                <Button
                                    borderRadius={'30px'}
                                    backgroundColor={'primary.green.900'}
                                    onClick={openConnectModal}
                                    ml="1rem"
                                    height="54px"
                                    fontSize={'20px'}
                                >
                                    Connect Wallet
                                </Button>
                            );
                        } else {
                            return <Loading style={{ padding: 0, margin: 0, height: '50px' }} />;
                        }
                    }}
                </ConnectButton.Custom>
            </Flex>
        </Box>
    );
};