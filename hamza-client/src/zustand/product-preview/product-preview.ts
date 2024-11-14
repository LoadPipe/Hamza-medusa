import { create } from 'zustand';
import { Region } from '@medusajs/medusa'; // Import the Region type

// Define the state and associated actions in an interface
interface ProductPreview {
    productData: Record<string, any>;
    regionId: string | null;
    countryCode: string | null;
    productId: string | null;
    variantId: string | null;
    quantity: number;
    ratingCounter: number;
    ratingAverage: number;
    setProductData: (data: Record<string, any>) => void;
    setProductId: (id: string) => void;
    setQuantity: (amount: number) => void;
    setVariantId: (id: string) => void;
    setRegionId: (region: string) => void; // Use Region type for setter
    setCountryCode: (code: string) => void;
    setRatingCounter: (count: number) => void;
    setRatingAverage: (average: number) => void;
}

// Create the Zustand store
const useProductPreview = create<ProductPreview>((set) => ({
    ratingCounter: 0,
    ratingAverage: 0,
    productData: {}, // Initial state as an empty object
    productId: null,
    regionId: null,
    countryCode: null,
    variantId: null,
    quantity: 1,
    setProductData: (data) => set({ productData: data }), // Method to update the state
    setProductId: (id) => set({ productId: id }),
    setQuantity: (amount) => set({ quantity: amount }),
    setVariantId: (id) => set({ variantId: id }),
    setRegionId: (id) => set({ regionId: id }), // Method to update the region
    setCountryCode: (code) => set({ countryCode: code }), // Method to update the country code
    setRatingCounter: (count) => set({ ratingCounter: count }),
    setRatingAverage: (average) => set({ ratingAverage: average }),
}));

export default useProductPreview;
