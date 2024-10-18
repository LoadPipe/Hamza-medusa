'use client';

import {
    useSearchParams,
    useRouter,
    usePathname,
    useParams,
} from 'next/navigation';
import { Cart, Customer } from '@medusajs/medusa';
import { CheckCircleSolid } from '@medusajs/icons';
import { useToggleState } from '@medusajs/ui';
import {
    Flex,
    Heading,
    Text,
    Box,
    useDisclosure,
    Button,
} from '@chakra-ui/react';

import Divider from '@modules/common/components/divider';
import Spinner from '@modules/common/icons/spinner';

import BillingAddress from '../billing_address';
import ShippingAddress from '../shipping-address';
import { setAddresses } from '../../actions';
import { SubmitButton } from '../submit-button';
import { useFormState } from 'react-dom';
import ErrorMessage from '../error-message';
import compareAddresses from '@lib/util/compare-addresses';
import { BiPencil } from 'react-icons/bi';
import AddressModal from '../address-modal';
import { IoLocationOutline } from 'react-icons/io5';
import { CiSaveDown2 } from 'react-icons/ci';
import AddressSelect from '../address-select';

const Addresses = ({
    cart,
    customer,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
        ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
        : (params.countryCode as string);

    const { state: sameAsSBilling, toggle: toggleSameAsBilling } =
        useToggleState(
            cart?.shipping_address && cart?.billing_address
                ? compareAddresses(
                      cart?.shipping_address,
                      cart?.billing_address
                  )
                : true
        );

    // const [message, formAction] = useFormState(setAddresses, null);

    const [message, onSubmit] = useFormState(setAddresses, null);

    const contactEmail = cart?.email
        ? cart.email.endsWith('@evm.blockchain')
            ? ''
            : cart.email
        : '';

    const contactPhone = cart?.shipping_address?.phone ?? '';

    return (
        <div>
            <Flex mt="2rem" width={'100%'} flexDir={'row'}>
                <Text
                    color={'primary.green.900'}
                    fontSize={{ base: '16px', md: '18px' }}
                    fontWeight={600}
                >
                    Shipping To:
                </Text>
                <Flex
                    flexDir={'row'}
                    cursor={'pointer'}
                    ml="auto"
                    alignSelf={'center'}
                    color="white"
                    _hover={{ color: 'primary.green.900' }}
                    onClick={onOpen}
                    gap={2}
                >
                    <Text alignSelf={'center'}>Edit</Text>
                    <BiPencil size={23} />
                </Flex>
            </Flex>

            <div>
                {cart && cart.shipping_address ? (
                    <Flex flexDir={'column'} color="primary.green.900">
                        <Text className="text-medium text-white  font-bold">
                            {cart.shipping_address.first_name}{' '}
                            {cart.shipping_address.last_name}
                        </Text>
                        <Text className="text-medium text-white">
                            {cart.shipping_address.address_1}{' '}
                            {cart.shipping_address.address_2}
                        </Text>
                        <Text className="text-medium text-white">
                            {cart.shipping_address.postal_code},{' '}
                            {cart.shipping_address.city}
                        </Text>
                        <Text className="text-medium text-white">
                            {cart.shipping_address.country_code?.toUpperCase()}
                        </Text>
                        <Text className="text-medium text-white">
                            {contactEmail}
                        </Text>

                        <Flex
                            mt="2rem"
                            flexDir={{ base: 'column', md: 'row' }}
                            gap={5}
                        >
                            <Button
                                leftIcon={<IoLocationOutline size={20} />}
                                flex={{ base: 'unset', md: 1 }}
                                borderRadius={'full'}
                                height={{ base: '52px', md: '52px' }}
                                borderWidth={'1px'}
                                borderColor={'primary.indigo.900'}
                                color={'primary.indigo.900'}
                                backgroundColor={'transparent'}
                                opacity={1}
                                _hover={{
                                    opacity: 0.5,
                                }}
                                onClick={onOpen}
                            >
                                Change Shipping Address
                            </Button>

                            <AddressSelect
                                cart={cart}
                                addresses={customer?.shipping_addresses}
                            />
                        </Flex>
                    </Flex>
                ) : (
                    <Flex
                        mt="2rem"
                        flexDir={{ base: 'column', md: 'row' }}
                        gap={5}
                    >
                        <Button
                            leftIcon={<IoLocationOutline size={20} />}
                            flex={1}
                            borderRadius={'full'}
                            height={'52px'}
                            borderWidth={'1px'}
                            borderColor={'primary.indigo.900'}
                            color={'primary.indigo.900'}
                            backgroundColor={'transparent'}
                            opacity={1}
                            _hover={{
                                opacity: 0.5,
                            }}
                            onClick={onOpen}
                        >
                            Add Shipping Address
                        </Button>
                        <Button
                            leftIcon={<CiSaveDown2 size={20} />}
                            flex={1}
                            borderRadius={'full'}
                            height={'52px'}
                            color={'white'}
                            backgroundColor={'primary.indigo.900'}
                            opacity={1}
                            _hover={{
                                opacity: 0.5,
                            }}
                            onClick={onOpen}
                        >
                            Use Saved Address
                        </Button>
                    </Flex>
                )}
            </div>
            <AddressModal
                customer={customer}
                countryCode={countryCode}
                checked={sameAsSBilling}
                onChange={toggleSameAsBilling}
                cart={cart}
                isOpen={isOpen}
                onClose={onClose}
            />
        </div>
    );
};

export default Addresses;
