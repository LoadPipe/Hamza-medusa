'use client';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Switch,
    FormControl,
    FormLabel,
    RadioGroup,
    Button,
    Flex,
    Box,
} from '@chakra-ui/react';
import { Region } from '@medusajs/medusa';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import toast from 'react-hot-toast';
import {
    addNotifications,
    getNotifications,
    removeNotifications,
} from '@lib/data';

const ToggleNotifications = ({ region }: { region: Region }) => {
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [notificationMethod, setNotificationMethod] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { authData } = useCustomerAuthStore();

    const disabledStyles = {
        backgroundColor: 'gray.100',
        borderColor: 'gray.100',
        color: 'gray.500',
    };

    useEffect(() => {
        if (authData.customer_id) {
            const fetchNotifications = async () => {
                console.log(
                    `Customer ID in notification toggle: ${authData.customer_id}`
                );
                try {
                    const response = await getNotifications(
                        authData.customer_id
                    );
                    console.log('Notification Data:', response);
                    setSelectedNotifications(response);
                } catch (error) {
                    console.error(
                        'Error fetching notification preferences:',
                        error
                    );
                }
            };
            fetchNotifications();
        }
    }, [authData.customer_id]);

    const handleCheckboxChange = (event: any) => {
        const value = event.target.value;
        setIsSaving(true);
        if (value === 'none') {
            setSelectedNotifications(['none' as never]);
        } else {
            setSelectedNotifications((prevSelected: any) => {
                if (prevSelected.includes(value)) {
                    return prevSelected.filter((item: any) => item !== value);
                } else {
                    return [
                        ...prevSelected.filter((item: any) => item !== 'none'),
                        value,
                    ];
                }
            });
        }
    };

    const handleSave = async () => {
        try {
            if (selectedNotifications.includes('none' as never)) {
                // Call the delete route if 'none' is selected
                await removeNotifications(authData.customer_id);
            } else {
                // Call the add/update route with the selected notifications
                const notificationsString = selectedNotifications.join(', ');
                await addNotifications(
                    authData.customer_id,
                    notificationsString
                );
            }
            toast.success('Notification preferences saved!', {});
            setIsSaving(false); // Reset isSaving to false after saving...
            console.log('Selected Notifications:', selectedNotifications);
            console.log('Notification Method:', notificationMethod);
        } catch (error) {
            console.error('Error saving notification preferences:', error);
        }
    };

    return (
        <FormControl>
            <FormLabel
                fontWeight={'bold'}
                fontSize="lg"
                mb={4}
                color={'primary.green.900'}
            >
                Email notifications
            </FormLabel>
            <FormLabel mb={8}>
                Get emails to find out what’s going on when you’re not online.
                You can turn these off.
            </FormLabel>
            <Stack spacing={3}>
                <Flex>
                    <Switch
                        value="orderShipped"
                        isChecked={selectedNotifications.includes(
                            'orderShipped' as never
                        )}
                        mr={4}
                        colorScheme="primary.green"
                        onChange={handleCheckboxChange}
                    ></Switch>
                    <FormLabel>Notify when order shipped</FormLabel>
                </Flex>

                <Flex>
                    <Switch
                        value="newProduct"
                        isChecked={selectedNotifications.includes(
                            'newProduct' as never
                        )}
                        mr={4}
                        colorScheme="primary.green"
                        onChange={handleCheckboxChange}
                    ></Switch>
                    <FormLabel>
                        Notify when followed sellers post a new product
                    </FormLabel>
                </Flex>

                <Flex>
                    <Switch
                        value="orderStatusChanged"
                        isChecked={selectedNotifications.includes(
                            'orderStatusChanged' as never
                        )}
                        mr={4}
                        colorScheme="primary.green"
                        onChange={handleCheckboxChange}
                    ></Switch>
                    <FormLabel> Notify when order status changed</FormLabel>
                </Flex>

                <Flex>
                    <Switch
                        value="promotions"
                        isChecked={selectedNotifications.includes(
                            'promotions' as never
                        )}
                        mr={4}
                        colorScheme="primary.green"
                        onChange={handleCheckboxChange}
                    ></Switch>
                    <FormLabel>Notify for promotions/discounts</FormLabel>
                </Flex>

                <Flex>
                    <Switch
                        value="surveys"
                        isChecked={selectedNotifications.includes(
                            'surveys' as never
                        )}
                        mr={4}
                        colorScheme="primary.green"
                        onChange={handleCheckboxChange}
                    ></Switch>
                    <FormLabel>Notify for surveys</FormLabel>
                </Flex>

                <Flex>
                    <Switch
                        value="none"
                        isChecked={selectedNotifications.includes(
                            'none' as never
                        )}
                        mr={4}
                        colorScheme="primary.green"
                        onChange={handleCheckboxChange}
                    ></Switch>
                    <FormLabel>
                        No notifications (when this is checked, other checkboxes
                        are cleared)
                    </FormLabel>
                </Flex>
            </Stack>
            <FormLabel
                fontWeight={'bold'}
                fontSize="lg"
                mt={8}
                mb={4}
                color={'primary.green.900'}
            >
                Push Notifications:
            </FormLabel>
            <FormLabel mb={8}>
                Get push notifications to find out what’s going on when you’re
                offline
            </FormLabel>
            <RadioGroup
                mb={8}
                value={notificationMethod}
                onChange={setNotificationMethod}
            >
                <Stack spacing={3} direction="column">
                    <Switch
                        colorScheme="primary.green"
                        onChange={handleCheckboxChange}
                        value="sms"
                    >
                        SMS
                    </Switch>
                    <Switch
                        onChange={handleCheckboxChange}
                        colorScheme="primary.green"
                        value="email"
                    >
                        Email
                    </Switch>
                    <Switch
                        onChange={handleCheckboxChange}
                        colorScheme="primary.green"
                        value="line"
                    >
                        LINE
                    </Switch>
                    <Switch
                        onChange={handleCheckboxChange}
                        colorScheme="primary.green"
                        value="whatsapp"
                    >
                        WhatsApp
                    </Switch>
                </Stack>
            </RadioGroup>
            <Box
                as="button"
                mt={4}
                borderRadius={'37px'}
                backgroundColor={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
                height={'47px'}
                width={'190px'}
                onClick={handleSave}
                disabled={!isSaving}
                _disabled={disabledStyles}
            >
                Save
            </Box>
        </FormControl>
    );
};

export default ToggleNotifications;
