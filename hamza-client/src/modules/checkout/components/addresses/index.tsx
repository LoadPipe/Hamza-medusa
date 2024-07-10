'use client';

import {
    useSearchParams,
    useRouter,
    usePathname,
    useParams,
} from 'next/navigation';
import { Cart, Customer } from '@medusajs/medusa';
import { CheckCircleSolid } from '@medusajs/icons';
import { Text, useToggleState } from '@medusajs/ui';
import { Heading } from '@chakra-ui/react';

import Divider from '@modules/common/components/divider';
import Spinner from '@modules/common/icons/spinner';

import BillingAddress from '../billing_address';
import ShippingAddress from '../shipping-address';
import { setAddresses } from '../../actions';
import { SubmitButton } from '../submit-button';
import { useFormState } from 'react-dom';
import ErrorMessage from '../error-message';
import compareAddresses from '@lib/util/compare-addresses';

const Addresses = ({
    cart,
    customer,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const countryCode = process.env.NEXT_PUBLIC_FORCE_US_COUNTRY
        ? 'us'
        : (params.countryCode as string);

    const isOpen =
        (searchParams.get('step') && searchParams.get('step') === 'address') ||
        !searchParams.get('step');

    const { state: sameAsSBilling, toggle: toggleSameAsBilling } =
        useToggleState(
            cart?.shipping_address && cart?.billing_address
                ? compareAddresses(
                      cart?.shipping_address,
                      cart?.billing_address
                  )
                : true
        );

    const handleEdit = () => {
        router.push(pathname + '?step=address');
    };

    const [message, formAction] = useFormState(setAddresses, null);

    return (
        <div className="bg-black">
            <div className="flex flex-row items-center justify-between mb-6">
                <Heading
                    className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
                    color={'primary.green.900'}
                >
                    Shipping Address
                    {!isOpen && <CheckCircleSolid />}
                </Heading>
                {!isOpen && cart?.shipping_address && (
                    <Text>
                        <button
                            onClick={handleEdit}
                            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                        >
                            Edit
                        </button>
                    </Text>
                )}
            </div>
            {isOpen ? (
                <form action={formAction}>
                    <div className="pb-8">
                        <ShippingAddress
                            customer={customer}
                            countryCode={countryCode}
                            checked={sameAsSBilling}
                            onChange={toggleSameAsBilling}
                            cart={cart}
                        />
                        <SubmitButton className="mt-6 bg-[#7B61FF] h-[52px] rounded-full py-3 px-6 text-base hover:bg-white hover:text-black text-white ">
                            Continue to delivery
                        </SubmitButton>

                        <ErrorMessage error={message} />
                    </div>
                </form>
            ) : (
                <div className="bg-black text-white p-4 rounded-md shadow-md">
                    <div className="text-small-regular">
                        {cart && cart.shipping_address ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col w-full md:w-1/3 mb-4 md:mb-0 text-white">
                                        <Text
                                            className="text-medium-plus
                                            mb-1"
                                        >
                                            Shipping Address
                                        </Text>
                                        <Text className="text-medium text-white">
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
                                    </div>

                                    <div className="flex flex-col w-full md:w-1/3 mb-4 md:mb-0">
                                        <Text className="text-medium-plus text-white mb-1">
                                            Contact
                                        </Text>
                                        <Text className="text-medium text-white">
                                            {cart.shipping_address.phone}
                                        </Text>
                                        <Text className="text-medium text-white">
                                            {cart.email}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Spinner />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Divider className="mt-8" />
        </div>
    );
};

export default Addresses;
