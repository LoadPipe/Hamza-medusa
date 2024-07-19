'use client';

import React, { useState, useEffect } from 'react';
import {
    Checkbox,
    Stack,
    CheckboxGroup,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    Button,
} from '@chakra-ui/react';
import { Region } from '@medusajs/medusa';
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    addNotifications,
    getNotifications,
    removeNotifications,
} from '@lib/data';

const ToggleNotifications = ({ region }: { region: Region }) => {
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [notificationMethod, setNotificationMethod] = useState('');

    const { authData } = useCustomerAuthStore();

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
            console.log('Selected Notifications:', selectedNotifications);
            console.log('Notification Method:', notificationMethod);
        } catch (error) {
            console.error('Error saving notification preferences:', error);
        }
    };

    return (
        <FormControl>
            <FormLabel>Notification Preferences</FormLabel>
            <Stack spacing={3}>
                <Checkbox
                    value="orderShipped"
                    isChecked={selectedNotifications.includes(
                        'orderShipped' as never
                    )}
                    onChange={handleCheckboxChange}
                >
                    Notify when order shipped
                </Checkbox>
                <Checkbox
                    value="newProduct"
                    isChecked={selectedNotifications.includes(
                        'newProduct' as never
                    )}
                    onChange={handleCheckboxChange}
                >
                    Notify when followed sellers post a new product
                </Checkbox>
                <Checkbox
                    value="orderStatusChanged"
                    isChecked={selectedNotifications.includes(
                        'orderStatusChanged' as never
                    )}
                    onChange={handleCheckboxChange}
                >
                    Notify when order status changed
                </Checkbox>
                <Checkbox
                    value="promotions"
                    isChecked={selectedNotifications.includes(
                        'promotions' as never
                    )}
                    onChange={handleCheckboxChange}
                >
                    Notify for promotions/discounts
                </Checkbox>
                <Checkbox
                    value="surveys"
                    isChecked={selectedNotifications.includes(
                        'surveys' as never
                    )}
                    onChange={handleCheckboxChange}
                >
                    Notify for surveys
                </Checkbox>
                <Checkbox
                    value="none"
                    isChecked={selectedNotifications.includes('none' as never)}
                    onChange={handleCheckboxChange}
                >
                    No notifications (when this is checked, other checkboxes are
                    cleared)
                </Checkbox>
            </Stack>
            <FormLabel mt={4}>Notify by:</FormLabel>
            <RadioGroup
                value={notificationMethod}
                onChange={setNotificationMethod}
            >
                <Stack spacing={3} direction="row">
                    <Radio value="sms">SMS</Radio>
                    <Radio value="email">Email</Radio>
                    <Radio value="line">LINE</Radio>
                    <Radio value="whatsapp">WhatsApp</Radio>
                </Stack>
            </RadioGroup>
            <Button mt={4} colorScheme="teal" onClick={handleSave}>
                Save
            </Button>
        </FormControl>
    );
};

export default ToggleNotifications;
