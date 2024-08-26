import { useEffect, useState } from 'react';
import { getAllStoreNames } from '@lib/data';

const useVendors = () => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        const fetchVendors = async () => {
            let vendorList = [];

            // Fetch the vendor names from the backend
            const vendorNames = await getAllStoreNames();

            // Format the vendors
            vendorList = vendorNames.map((vendor: string, index: number) => ({
                id: index + 1,
                vendorName: vendor,
                vendorType: vendor.toLowerCase().replace(/\s+/g, '_'),
            }));

            // Add the 'All' option at the beginning
            vendorList.unshift({
                id: 0,
                vendorName: 'All',
                vendorType: 'all',
            });

            // Check for the environment variable and adjust vendors
            if (process.env.NEXT_PUBLIC_ALT_SEED === '1') {
                vendorList = [
                    {
                        id: 1,
                        vendorName: 'All',
                        vendorType: 'all',
                    },
                ];
            }

            setVendors(vendorList);
        };

        fetchVendors();
    }, []);

    return vendors;
};

export default useVendors;
