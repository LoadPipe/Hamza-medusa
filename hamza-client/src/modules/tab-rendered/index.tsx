import React from 'react';
import All from '@modules/order/templates/all';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@modules/order/templates/refund';

export const TABS = {
    ALL: 'All Orders',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUND: 'Refund',
};

export const renderTabContent = (activeTab: any, orders: any) => {
    switch (activeTab) {
        case TABS.ALL:
            return <All orders={orders} />;
        case TABS.PROCESSING:
            return <Processing orders={orders} />;
        case TABS.SHIPPED:
            return <Shipped orders={orders} />;
        case TABS.DELIVERED:
            return <Delivered />;
        case TABS.CANCELLED:
            return <Cancelled orders={orders} />;
        case TABS.REFUND:
            return <Refund orders={orders} />;
        default:
            return <div>Select a tab to view orders.</div>;
    }
};
