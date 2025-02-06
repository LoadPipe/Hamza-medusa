import { useEffect, useState } from 'react';
import { getAllStoreNames } from '@/lib/server';

const useVendors = () => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchVendors = async () => {
            let storeList = [];

            // Fetch the vendor names from the backend
            const storeNames = await getAllStoreNames();

            // Format the vendors
            storeList = storeNames.map((vendor: string, index: number) => ({
                id: index + 1,
                vendorName: vendor,
                vendorType: vendor.toLowerCase().replace(/\s+/g, '_'),
            }));

            // Add the 'All' option at the beginning
            storeList.unshift({
                id: 0,
                vendorName: 'All',
                vendorType: 'all',
            });

            setStores(storeList);
        };

        fetchVendors();
    }, []);

    return stores;
};

export default useVendors;
