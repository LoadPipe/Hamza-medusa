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
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import toast from 'react-hot-toast';
import {
    addNotifications,
    getNotifications,
    deleteNotifications,
} from '@/lib/server';

const NotificationToggle = ({ region }: { region: Region }) => {
    // Explicitly typing `selectedNotifications` as an array of strings
    const [selectedNotifications, setSelectedNotifications] = useState<
        string[]
    >([]);
    const [notificationMethod, setNotificationMethod] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { authData } = useCustomerAuthStore();

    const disabledStyles = {
        backgroundColor: 'gray.600',
        borderColor: 'gray.600',
        color: 'gray.700',
    };

    useEffect(() => {
        if (authData.customer_id) {
            const fetchNotifications = async () => {
                console.log(
                    `Customer ID in notification toggle: ${authData.customer_id}`
                );
                try {
                    const notifications = await getNotifications(
                        authData.customer_id
                    );
                    console.log('Notification Data:', notifications);
                    setSelectedNotifications(notifications);
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

    // Ensure that `selectedNotifications` is always an array in case of undefined or null
    const handleCheckboxChange = (event: any) => {
        const value = event.target.value;
        setIsSaving(true);
        if (value === 'none') {
            setSelectedNotifications(['none' as never]);
        } else {
            setSelectedNotifications((prevSelected: any) => {
                const notifications = Array.isArray(prevSelected)
                    ? prevSelected
                    : [];
                if (notifications.includes(value)) {
                    return notifications.filter((item: any) => item !== value);
                } else {
                    return [
                        ...notifications.filter((item: any) => item !== 'none'),
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
                await deleteNotifications(authData.customer_id);
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
                        id="orderShipped"
                        value="orderShipped"
                        isChecked={
                            Array.isArray(selectedNotifications) &&
                            selectedNotifications.includes(
                                'orderShipped' as never
                            )
                        }
                        mr={4}
                        colorScheme="switchBackground"
                        onChange={handleCheckboxChange}
                    />
                    <FormLabel htmlFor="orderShipped">
                        Notify when order shipped
                    </FormLabel>
                </Flex>

                <Flex>
                    <Switch
                        id="orderStatusChanged"
                        value="orderStatusChanged"
                        isChecked={
                            Array.isArray(selectedNotifications) &&
                            selectedNotifications.includes(
                                'orderStatusChanged' as never
                            )
                        }
                        mr={4}
                        colorScheme="switchBackground"
                        onChange={handleCheckboxChange}
                    />
                    <FormLabel htmlFor="orderStatusChanged">
                        Notify when order status changed
                    </FormLabel>
                </Flex>

                <Flex>
                    <Switch
                        id="promotions"
                        value="promotions"
                        isChecked={
                            Array.isArray(selectedNotifications) &&
                            selectedNotifications.includes(
                                'promotions' as never
                            )
                        }
                        mr={4}
                        colorScheme="switchBackground"
                        onChange={handleCheckboxChange}
                    />
                    <FormLabel htmlFor="promotions">
                        Notify for promotions/discounts
                    </FormLabel>
                </Flex>

                <Flex>
                    <Switch
                        id="surveys"
                        value="surveys"
                        isChecked={
                            Array.isArray(selectedNotifications) &&
                            selectedNotifications.includes('surveys' as never)
                        }
                        mr={4}
                        colorScheme="switchBackground"
                        onChange={handleCheckboxChange}
                    />
                    <FormLabel htmlFor="surveys">Notify for surveys</FormLabel>
                </Flex>

                <Flex>
                    <Switch
                        id="none"
                        value="none"
                        isChecked={
                            Array.isArray(selectedNotifications) &&
                            selectedNotifications.includes('none' as never)
                        }
                        mr={4}
                        colorScheme="switchBackground"
                        onChange={handleCheckboxChange}
                    />
                    <FormLabel htmlFor="none">
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
            <Stack spacing={3} direction="column">
                {/*
                <Switch
                    isChecked={
                        Array.isArray(selectedNotifications) &&
                        selectedNotifications.includes('sms' as never)
                    }
                    colorScheme="switchBackground"
                    onChange={handleCheckboxChange}
                    value="sms"
                >
                    SMS
                </Switch>
                */}
                <Switch
                    isChecked={
                        Array.isArray(selectedNotifications) &&
                        selectedNotifications.includes('email' as never)
                    }
                    onChange={handleCheckboxChange}
                    colorScheme="switchBackground"
                    value="email"
                >
                    Email
                </Switch>
                {/*
                <Switch
                    isChecked={
                        Array.isArray(selectedNotifications) &&
                        selectedNotifications.includes('line' as never)
                    }
                    onChange={handleCheckboxChange}
                    colorScheme="switchBackground"
                    value="line"
                >
                    LINE
                </Switch>
                <Switch
                    isChecked={
                        Array.isArray(selectedNotifications) &&
                        selectedNotifications.includes('whatsapp' as never)
                    }
                    onChange={handleCheckboxChange}
                    colorScheme="primary.green"
                    value="whatsapp"
                >
                    WhatsApp
                </Switch>
                */}
            </Stack>
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

export default NotificationToggle;
