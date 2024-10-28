import {
    Box,
    Button,
    IconButton,
    Flex,
    VStack,
    Text,
    Radio,
    RadioGroup,
} from '@chakra-ui/react';
import { ChevronUpDown } from '@medusajs/icons';
import { Address, AddressPayload, Cart } from '@medusajs/medusa';
import { omit } from 'lodash';
import { useState, useMemo } from 'react';

import { cartUpdate } from '@modules/checkout/actions';
import compareAddresses from '@lib/util/compare-addresses';

type AddressSelectProps = {
    addresses: Address[];
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    onSelect?: (addr: string) => void;
};

const AddressSelect = ({ addresses, cart, onSelect }: AddressSelectProps) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage dropdown open/close
    const [selectedId, setSelectedId] = useState<string | null>(null); // State for selected address id

    const handleSelect = (id: string) => {
        const savedAddress = addresses.find((a) => a.id === id);
        if (savedAddress) {
            cartUpdate({
                shipping_address: omit(savedAddress, [
                    'id',
                    'created_at',
                    'updated_at',
                    'country',
                    'deleted_at',
                    'metadata',
                    'customer_id',
                ]) as AddressPayload,
            });
            setSelectedId(id); // Set the selected address ID
            setIsOpen(false); // Close the dropdown after selection

            if (onSelect)
                onSelect(id);
        }
    };

    /*
     const handleSelect = async (id: string) => {
        const savedAddress = addresses.find((a) => a.id === id);

        if (savedAddress) {
            // Create FormData to match the structure expected by setAddresses
            const formData = new FormData();
            formData.append(
                'shipping_address.first_name',
                savedAddress.first_name || ''
            );
            formData.append(
                'shipping_address.last_name',
                savedAddress.last_name || ''
            );
            formData.append(
                'shipping_address.address_1',
                savedAddress.address_1 || ''
            );
            formData.append(
                'shipping_address.address_2',
                savedAddress.address_2 || ''
            );
            formData.append(
                'shipping_address.company',
                savedAddress.company || ''
            );
            formData.append(
                'shipping_address.postal_code',
                savedAddress.postal_code || ''
            );
            formData.append('shipping_address.city', savedAddress.city || '');
            formData.append(
                'shipping_address.country_code',
                savedAddress.country_code || ''
            );
            formData.append(
                'shipping_address.province',
                savedAddress.province || ''
            );
            formData.append('shipping_address.phone', savedAddress.phone || '');

            // Check if the cart already has a shipping address
            const isAddressEmpty = !cart?.shipping_address;

            if (isAddressEmpty) {
                // Use 'add' action type if no shipping address exists
                await setAddresses('add', formData);
            } else {
                // Use 'edit' action type if the shipping address already exists
                await setAddresses('edit', formData);
            }

            setSelectedId(id); // Set the selected address ID
            setIsOpen(false); // Close the dropdown after selection
        }
    };*/

    const selectedAddress = useMemo(() => {
        return addresses.find((a) =>
            compareAddresses(a, cart?.shipping_address)
        );
    }, [addresses, cart?.shipping_address]);

    return (
        <Box position="relative" flex={1}>
            {/* Button to toggle the address selection */}
            <Button
                width="full"
                bg="primary.indigo.900"
                color="white"
                leftIcon={<ChevronUpDown />}
                borderRadius="full"
                height={{ base: '42px', md: '52px' }}
                _hover={{ opacity: 0.5 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                Use Saved Address
            </Button>

            {/* Dropdown (or list) of addresses */}
            {isOpen && (
                <Box
                    position="absolute"
                    zIndex="20"
                    mt={2}
                    width="full"
                    bg="white"
                    border="1px"
                    borderColor="gray.200"
                    color={'black'}
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="md"
                >
                    <RadioGroup
                        onChange={handleSelect}
                        value={selectedId ?? selectedAddress?.id ?? ''}
                    >
                        <VStack align="stretch" spacing={1}>
                            {addresses.map((address) => (
                                <Box
                                    key={address.id}
                                    p={4}
                                    _hover={{ bg: 'gray.50' }}
                                    cursor="pointer"
                                    display="flex"
                                    alignItems="start"
                                >
                                    <Radio value={address.id} />
                                    <Box ml={4}>
                                        <Text fontWeight="semibold">
                                            {address.first_name}{' '}
                                            {address.last_name}
                                        </Text>
                                        {address.company && (
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                {address.company}
                                            </Text>
                                        )}
                                        <Text fontSize="sm" mt={2}>
                                            {address.address_1}{' '}
                                            {address.address_2 && (
                                                <span>
                                                    , {address.address_2}
                                                </span>
                                            )}
                                            <br />
                                            {address.postal_code},{' '}
                                            {address.city}
                                            <br />
                                            {address.province &&
                                                `${address.province}, `}
                                            {address.country_code?.toUpperCase()}
                                        </Text>
                                    </Box>
                                </Box>
                            ))}
                        </VStack>
                    </RadioGroup>
                </Box>
            )}
        </Box>
    );
};

export default AddressSelect;
