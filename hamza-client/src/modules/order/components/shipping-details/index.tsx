import { Order } from '@medusajs/medusa';
import { Heading } from '@medusajs/ui';
import { Text } from '@chakra-ui/react';
import { formatAmount } from '@lib/util/prices';
import Divider from '@modules/common/components/divider';

type ShippingDetailsProps = {
    order: Order;
};

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
    return (
        <div>
            <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
                Delivery
            </Heading>
            <div className="flex items-start gap-x-8">
                <div className="flex flex-col w-1/3">
                    <Text
                        className="txt-medium-plus mb-1"
                        color={'primary.green.900'}
                    >
                        Shipping Address
                    </Text>
                    <Text className="txt-medium ">
                        {order.shipping_address.first_name}{' '}
                        {order.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium ">
                        {order.shipping_address.address_1}{' '}
                        {order.shipping_address.address_2}
                    </Text>
                    <Text className="txt-medium ">
                        {order.shipping_address.postal_code},{' '}
                        {order.shipping_address.city}
                    </Text>
                    <Text className="txt-medium ">
                        {order.shipping_address.country_code?.toUpperCase()}
                    </Text>
                </div>

                <div className="flex flex-col w-1/3 ">
                    <Text className="txt-medium-plus  mb-1">Contact</Text>
                    <Text className="txt-medium ">
                        {order.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium ">
                        {order.email.includes('@evm.blockchain')
                            ? ''
                            : order.email}
                    </Text>
                </div>

                <div className="flex flex-col w-1/3">
                    <Text className="txt-medium-plus  mb-1">Method</Text>
                    <Text className="txt-medium ">
                        {order.shipping_methods?.length
                            ? order.shipping_methods[0].shipping_option?.name
                            : ''}{' '}
                        (
                        {formatAmount({
                            amount: order.shipping_methods?.length
                                ? order.shipping_methods[0].price
                                : 0,
                            region: order.region,
                            includeTaxes: false,
                            currency_code: '',
                        })}
                        )
                    </Text>
                </div>
            </div>
            <Divider className="mt-8" />
        </div>
    );
};

export default ShippingDetails;
