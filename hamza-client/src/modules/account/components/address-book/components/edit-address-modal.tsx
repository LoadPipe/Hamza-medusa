'use client';

import React, { useEffect, useState } from 'react';
import { PencilSquare as Edit, Trash } from '@medusajs/icons';
import { Heading, clx } from '@medusajs/ui';
import { Address, Region } from '@medusajs/medusa';
import useToggleState from '@lib/hooks/use-toggle-state';
import CountrySelect from '@modules/checkout/components/country-select';
import Input from '@modules/common/components/input';
import Modal from '@modules/common/components/modal';
import {
    deleteCustomerShippingAddress,
    updateCustomerShippingAddress,
} from '@modules/account/actions';
import Spinner from '@modules/common/icons/spinner';
import { useFormState } from 'react-dom';
import { SubmitButton } from '@modules/checkout/components/submit-button';
import toast from 'react-hot-toast';
import { Flex, Text, Button } from '@chakra-ui/react';

type EditAddressProps = {
    region: Region;
    address: Address;
    isActive?: boolean;
};

const EditAddress: React.FC<EditAddressProps> = ({
    region,
    address,
    isActive = false,
}) => {
    const [removing, setRemoving] = useState(false);
    const [successState, setSuccessState] = useState(false);
    const { state, open, close: closeModal } = useToggleState(false);

    const [formState, formAction] = useFormState(
        updateCustomerShippingAddress,
        {
            success: false,
            error: null,
            addressId: address.id,
        }
    );
    console.log(formState.success);

    const close = () => {
        setSuccessState(false);
        closeModal();
    };

    useEffect(() => {
        if (successState) {
            toast.success('Address updated!');
            close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successState]);

    useEffect(() => {
        if (formState.success) {
            setSuccessState(true);
        }
    }, [formState]);

    const removeAddress = async () => {
        setRemoving(true);
        await deleteCustomerShippingAddress(address.id);
        toast.success('Address removed!');
        setRemoving(false);
    };

    return (
        <>
            <div
                className={clx(
                    'border rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between transition-colors',
                    {
                        'border-gray-900': isActive,
                    }
                )}
            >
                <div className="flex flex-col">
                    <Heading
                        style={{ color: '#7B61FF' }}
                        className="text-left text-base-semi"
                    >
                        {address.first_name} {address.last_name}
                    </Heading>
                    {address.company && (
                        <Text className="txt-compact-small text-ui-fg-base">
                            {address.company}
                        </Text>
                    )}
                    <Text className="flex flex-col text-left text-base-regular mt-2">
                        <span>
                            {address.address_1}{' '}
                            {address.address_2 && (
                                <span>, {address.address_2}</span>
                            )}
                        </span>
                        <span>
                            {address.postal_code}, {address.city}
                        </span>
                        <span>
                            {address.province && `${address.province}, `}
                            {address.country_code?.toUpperCase()}
                        </span>
                    </Text>
                </div>
                <div className="flex items-center gap-x-4">
                    <Button
                        onClick={open}
                        variant="outline"
                        colorScheme="white"
                        size="sm"
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <Edit />
                        <Text>Edit</Text>
                    </Button>

                    <Button
                        onClick={removeAddress}
                        variant="outline"
                        colorScheme="white"
                        size="sm"
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        {removing ? <Spinner size="xs" /> : <Trash />}
                        <Text>Remove</Text>
                    </Button>
                </div>
            </div>

            <Modal isOpen={state} close={close}>
                <Modal.Title>
                    <Heading style={{ color: '#7B61FF' }} className="mb-2">
                        Edit Address
                    </Heading>
                </Modal.Title>
                <form action={formAction}>
                    <Modal.Body>
                        <div className="grid grid-cols-1 gap-y-2 mt-4">
                            <div className="grid grid-cols-2 gap-x-2">
                                <Input
                                    label="First name"
                                    name="first_name"
                                    required
                                    autoComplete="given-name"
                                    defaultValue={
                                        address.first_name || undefined
                                    }
                                />
                                <Input
                                    label="Last name"
                                    name="last_name"
                                    required
                                    autoComplete="family-name"
                                    defaultValue={
                                        address.last_name || undefined
                                    }
                                />
                            </div>
                            <Input
                                label="Company"
                                name="company"
                                autoComplete="organization"
                                defaultValue={address.company || undefined}
                            />
                            <Input
                                label="Address"
                                name="address_1"
                                required
                                autoComplete="address-line1"
                                defaultValue={address.address_1 || undefined}
                            />
                            <Input
                                label="Apartment, suite, etc."
                                name="address_2"
                                autoComplete="address-line2"
                                defaultValue={address.address_2 || undefined}
                            />
                            <div className="grid grid-cols-[144px_1fr] gap-x-2">
                                <Input
                                    label="Postal code"
                                    name="postal_code"
                                    required
                                    autoComplete="postal-code"
                                    defaultValue={
                                        address.postal_code || undefined
                                    }
                                />
                                <Input
                                    label="City"
                                    name="city"
                                    required
                                    autoComplete="locality"
                                    defaultValue={address.city || undefined}
                                />
                            </div>
                            <Input
                                label="Province / State"
                                name="province"
                                required
                                autoComplete="address-level1"
                                defaultValue={address.province || undefined}
                            />
                            <CountrySelect
                                name="country_code"
                                region={region}
                                required
                                autoComplete="country"
                                defaultValue={address.country_code || undefined}
                            />
                            <Input
                                label="Phone"
                                name="phone"
                                autoComplete="phone"
                                defaultValue={address.phone || undefined}
                            />
                        </div>
                        {formState.error && (
                            <div className="text-rose-500 text-small-regular py-2">
                                {formState.error}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex gap-3 mt-6">
                            <Flex
                                backgroundColor={'#7B61FF'}
                                className="h-10"
                                width={'80px'}
                                justifyContent={'center'}
                                borderRadius={'5px'}
                                cursor={'pointer'}
                                onClick={close}
                            >
                                <Text
                                    fontWeight={600}
                                    alignSelf={'center'}
                                    color={'white'}
                                >
                                    Cancel
                                </Text>
                            </Flex>
                            {/* <SubmitButton>Save</SubmitButton> */}

                            <SubmitButton>
                                <Flex
                                    border={'1px'}
                                    borderRadius={'5px'}
                                    width={'80px'}
                                    justifyContent={'center'}
                                    borderColor={'#7B61FF'}
                                    className="h-10"
                                    px="0.7rem"
                                    alignItems={'center'}
                                >
                                    <Text
                                        fontWeight={600}
                                        style={{
                                            color: '#7B61FF',
                                            fontSize: '16px',
                                        }}
                                    >
                                        Save
                                    </Text>
                                </Flex>
                            </SubmitButton>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};

export default EditAddress;
