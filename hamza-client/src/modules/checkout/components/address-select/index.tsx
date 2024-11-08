import { Box, Button, VStack, Text, Radio, RadioGroup } from '@chakra-ui/react';
import { ChevronUpDown } from '@medusajs/icons';
import { Address, Cart } from '@medusajs/medusa';
import { useState, useEffect } from 'react';
import compareSelectedAddress from '@/lib/util/compare-address-select';

type AddressSelectProps = {
    addresses: Address[];
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    onSelect?: (addr: string) => void;
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
};

const AddressSelect = ({
    addresses,
    cart,
    onSelect,
    formData,
    setFormData,
}: AddressSelectProps) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage dropdown open/close
    const [selectedId, setSelectedId] = useState<string | null>(null); // State for selected address id

    useEffect(() => {
        if (cart?.shipping_address) {
            const matchingAddress = addresses.find((address) =>
                compareSelectedAddress(address, cart.shipping_address)
            );

            if (matchingAddress) {
                console.log('Matching Address Found:', matchingAddress);
                setSelectedId(matchingAddress.id);
            } else {
                setSelectedId('');
                console.log('No matching address found');
            }
        }
    }, [cart?.shipping_address, addresses]);

    const handleSelect = (id: string) => {
        const selectedAddress = addresses.find((a) => a.id === id);
        if (selectedAddress) {
            // Update form data in AddressModal with selected address details
            setFormData({
                ...formData,
                'shipping_address.first_name': selectedAddress.first_name,
                'shipping_address.last_name': selectedAddress.last_name,
                'shipping_address.address_1': selectedAddress.address_1,
                'shipping_address.address_2': selectedAddress.address_2,
                'shipping_address.company': selectedAddress.company,
                'shipping_address.postal_code': selectedAddress.postal_code,
                'shipping_address.city': selectedAddress.city,
                'shipping_address.country_code': selectedAddress.country_code,
                'shipping_address.province': selectedAddress.province,
                'shipping_address.phone': selectedAddress.phone,
            });

            setSelectedId(id); // Set the selected address ID
            setIsOpen(false); // Close the dropdown after selection

            if (onSelect) onSelect(id);
        }
    };

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
                        value={selectedId ?? ''}
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
                                    onClick={() => handleSelect(address.id)}
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
