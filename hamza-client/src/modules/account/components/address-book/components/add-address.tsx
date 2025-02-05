'use client';

import { Region } from '@medusajs/medusa';
import { Plus } from '@medusajs/icons';
import { Heading } from '@medusajs/ui';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { Flex, Text } from '@chakra-ui/react';
import useToggleState from '@lib/hooks/use-toggle-state';
import CountrySelect from '@modules/checkout/components/country-select';
import Input from '@modules/common/components/input';
import Modal from '@modules/common/components/modal';
import { SubmitButton } from '@modules/checkout/components/submit-button';
import { addCustomerShippingAddress } from '@modules/account/actions';
import toast from 'react-hot-toast';

const AddAddress = ({ region }: { region: Region }) => {
    const [successState, setSuccessState] = useState(false);
    const { state, open, close: closeModal } = useToggleState(false);

    const [formState, formAction] = useFormState(addCustomerShippingAddress, {
        success: false,
        error: null,
    });

    const close = () => {
        setSuccessState(false);
        closeModal();
    };

    useEffect(() => {
        if (successState) {
            toast.success('Address added!');
            close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successState]);

    useEffect(() => {
        if (formState.success) {
            setSuccessState(true);
        }
    }, [formState]);

    return (
        <>
            <button
                className="border border-ui-border-base rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between"
                onClick={open}
            >
                <span className="text-base-semi">New address</span>
                <Plus />
            </button>

            <Modal isOpen={state} close={close}>
                <Modal.Title>
                    <Heading style={{ color: '#7B61FF' }} className="mb-2">
                        Add New Address
                    </Heading>
                </Modal.Title>
                <form action={formAction}>
                    <Modal.Body>
                        <Flex flexDir={'column'} className="gap-y-2">
                            <div className="grid grid-cols-2 gap-x-2 mt-4">
                                <Input
                                    label="First name"
                                    name="first_name"
                                    required
                                    autoComplete="given-name"
                                />
                                <Input
                                    label="Last name"
                                    name="last_name"
                                    required
                                    autoComplete="family-name"
                                />
                            </div>
                            <Input
                                label="Company"
                                name="company"
                                autoComplete="organization"
                            />
                            <Input
                                label="Address"
                                name="address_1"
                                required
                                autoComplete="address-line1"
                            />
                            <Input
                                label="Apartment, suite, etc."
                                name="address_2"
                                autoComplete="address-line2"
                            />
                            <div className="grid grid-cols-[144px_1fr] gap-x-2">
                                <Input
                                    label="Postal code"
                                    name="postal_code"
                                    required
                                    autoComplete="postal-code"
                                />
                                <Input
                                    label="City"
                                    name="city"
                                    required
                                    autoComplete="locality"
                                />
                            </div>
                            <Input
                                label="Province / State"
                                name="province"
                                required
                                autoComplete="address-level1"
                            />
                            <CountrySelect
                                region={region}
                                name="country_code"
                                required
                                autoComplete="country"
                            />
                            <Input
                                label="Phone"
                                name="phone"
                                autoComplete="phone"
                            />
                        </Flex>
                        {formState.error && (
                            <div className="text-rose-500 text-small-regular py-2">
                                {formState.error}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex gap-3 mt-6">
                            {/* <Button
                                type="reset"
                                variant="secondary"
                                onClick={close}
                                style={{
                                    backgroundColor: '#7B61FF',
                                    fontSize: '16px',
                                }}
                                className="h-10"
                            >
                                <Text alignSelf={'center'}>Cancel</Text>
                            </Button> */}
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

export default AddAddress;
