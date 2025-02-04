import { Customer, Region } from '@medusajs/medusa';
import React from 'react';

import AddAddress from '../address-card/add-address';
import EditAddress from '../address-card/edit-address-modal';
import NotificationToggle from '../notification-toggle';
// import

type NotificationProps = {
    customer: Omit<Customer, 'password_hash'>;
    region: Region;
};

const Notification: React.FC<NotificationProps> = ({ customer, region }) => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mt-4">
                <NotificationToggle region={region} />
            </div>
        </div>
    );
};

export default Notification;
