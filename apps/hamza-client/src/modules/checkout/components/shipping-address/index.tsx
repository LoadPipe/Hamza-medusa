import React, { useState, useEffect, useMemo } from 'react';
import { Address, Cart, Customer } from '@medusajs/medusa';
import Checkbox from '@modules/common/components/checkbox';
import Input from '@modules/common/components/input';
import AddressSelect from '../address-select';
import CountrySelect from '../country-select';
import { Container } from '@medusajs/ui';

// This is the Checkout Shipping Form
const ShippingAddress = ({
    customer,
    cart,
    checked,
    onChange,
    countryCode,
}: {
    customer: Omit<Customer, 'password_hash'> | null;
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    checked: boolean;
    onChange: () => void;
    countryCode: string;
}) => {
    const [formData, setFormData] = useState({
        'shipping_address.first_name': cart?.shipping_address?.first_name || '',
        'shipping_address.last_name': cart?.shipping_address?.last_name || '',
        'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
        'shipping_address.address_2': cart?.shipping_address?.address_2 || '',
        'shipping_address.company': cart?.shipping_address?.company || '',
        'shipping_address.postal_code':
            cart?.shipping_address?.postal_code || '',
        'shipping_address.city': cart?.shipping_address?.city || '',
        'shipping_address.country_code':
            cart?.shipping_address?.country_code || countryCode || '',
        'shipping_address.province': cart?.shipping_address?.province || '',
        email: cart?.email || '',
        'shipping_address.phone': cart?.shipping_address?.phone || '',
    });
    // TODO (For G), take a look at what obj / type we are sending instead of passing any
    const countriesInRegion = useMemo(
        () => cart?.region.countries.map((c: any) => c.iso_2),
        [cart?.region]
    );

    // check if customer has saved addresses that are in the current region
    const addressesInRegion = useMemo(
        () =>
            customer?.shipping_addresses?.filter(
                (a) =>
                    a.country_code &&
                    countriesInRegion?.includes(a.country_code)
            ),
        [customer?.shipping_addresses, countriesInRegion]
    );

    useEffect(() => {
        setFormData({
            'shipping_address.first_name':
                cart?.shipping_address?.first_name || '',
            'shipping_address.last_name':
                cart?.shipping_address?.last_name || '',
            'shipping_address.address_1':
                cart?.shipping_address?.address_1 || '',
            'shipping_address.address_2':
                cart?.shipping_address?.address_2 || '',
            'shipping_address.company': cart?.shipping_address?.company || '',
            'shipping_address.postal_code':
                cart?.shipping_address?.postal_code || '',
            'shipping_address.city': cart?.shipping_address?.city || '',
            'shipping_address.country_code':
                cart?.shipping_address?.country_code || '',
            'shipping_address.province': cart?.shipping_address?.province || '',
            email: cart?.email || '',
            'shipping_address.phone': cart?.shipping_address?.phone || '',
        });
    }, [cart]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLInputElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            {customer &&
                (customer?.shipping_addresses?.length ?? 0) &&
                (addressesInRegion?.length || 0) > 0 && (
                    <Container className="mb-6 flex flex-col gap-y-4 p-5">
                        <p className="text-small-regular">
                            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
                        </p>
                        {/* <AddressSelect
                        addresses={customer.shipping_addresses}
                        cart={cart}
                    /> */}
                    </Container>
                )}
            <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First name"
                        name="shipping_address.first_name"
                        autoComplete="given-name"
                        value={formData['shipping_address.first_name']}
                        onChange={handleChange}
                        maxLength={50}
                        required
                    />
                    <Input
                        label="Last name"
                        name="shipping_address.last_name"
                        autoComplete="family-name"
                        value={formData['shipping_address.last_name']}
                        onChange={handleChange}
                        maxLength={50}
                        required
                    />
                    <Input
                        label="Address"
                        name="shipping_address.address_1"
                        autoComplete="address-line1"
                        value={formData['shipping_address.address_1']}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Apartment, suite, etc"
                        name="shipping_address.address_2"
                        autoComplete="address-line2"
                        value={formData['shipping_address.address_2']}
                        onChange={handleChange}
                        maxLength={50}
                    />
                    <Input
                        label="Company"
                        name="shipping_address.company"
                        value={formData['shipping_address.company']}
                        onChange={handleChange}
                        autoComplete="organization"
                        maxLength={50}
                    />
                    <Input
                        label="Postal code"
                        name="shipping_address.postal_code"
                        autoComplete="postal-code"
                        value={formData['shipping_address.postal_code']}
                        onChange={handleChange}
                        maxLength={50}
                        required
                    />
                    <Input
                        label="City"
                        name="shipping_address.city"
                        autoComplete="address-level2"
                        value={formData['shipping_address.city']}
                        onChange={handleChange}
                        maxLength={50}
                        required
                    />
                    <CountrySelect
                        className="bg-white"
                        name="shipping_address.country_code"
                        autoComplete="country"
                        region={cart?.region}
                        value={formData['shipping_address.country_code']}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="State / Province"
                        name="shipping_address.province"
                        autoComplete="address-level1"
                        value={formData['shipping_address.province']}
                        onChange={handleChange}
                        maxLength={50}
                        required
                    />
                </div>
            </div>
            <div className="my-8">
                {/* <Checkbox
                    label="Same as billing address"
                    name="same_as_billing"
                    checked={checked}
                    onChange={onChange}
                /> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    title="Enter a valid email address."
                    autoComplete="email"
                    value={
                        formData.email.includes('@evm.blockchain')
                            ? ''
                            : formData.email
                    }
                    onChange={handleChange}
                    maxLength={50}
                    required
                />
                <Input
                    label="Phone"
                    name="shipping_address.phone"
                    autoComplete="tel"
                    value={formData['shipping_address.phone']}
                    onChange={handleChange}
                    maxLength={50}
                />
            </div>
        </>
    );
};

export default ShippingAddress;
