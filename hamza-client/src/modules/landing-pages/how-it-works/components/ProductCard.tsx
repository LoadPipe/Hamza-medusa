'use client';

import { useState } from 'react';
import type { Product } from '../types';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { Star, AlertTriangle } from 'lucide-react';
import { translate } from '../translations';

interface ProductCardProps {
    product: Product;
    currency: string;
    language: string;
    shipping: string;
    chainCryptocurrencies: { name: string; logo: string }[];
    selectedChain: string;
}

export default function ProductCard({
    product,
    currency,
    language,
    shipping,
    chainCryptocurrencies,
    selectedChain,
}: ProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatPrice = (price: number, currency: string) => {
        const currencySymbols: { [key: string]: string } = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            CAD: 'C$',
        };
        return `${currencySymbols[currency] || '$'}${price.toFixed(2)}`;
    };

    const isAvailable = product.chains.includes(selectedChain);

    // Simulated additional images for the product
    const productImages = [product.image, '📱', '📷', '🎧'];

    return (
        <Card
            className="bg-black rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-800"
            onMouseEnter={() => {
                setCurrentImageIndex(
                    (prevIndex) => (prevIndex + 1) % productImages.length
                );
            }}
            onMouseLeave={() => setCurrentImageIndex(0)}
        >
            <div className="w-full h-[295px] flex items-center justify-center text-8xl bg-white rounded-t-2xl relative overflow-hidden">
                {productImages[currentImageIndex]}
            </div>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">
                    {translate(product.name, language)}
                </h3>
                <div className="flex items-center mb-2">
                    <Star className="text-[#FEC84B] mr-1" size={16} />
                    <span className="text-sm text-white">{product.rating}</span>
                    <span className="text-sm text-gray-400 ml-1">
                        ({product.reviews} {translate('reviews', language)})
                    </span>
                </div>
                <p className="text-xl font-bold mb-4 text-white">
                    {formatPrice(product.price, currency)}
                </p>
                {isAvailable ? (
                    <div className="flex space-x-2">
                        {chainCryptocurrencies.map((crypto) => (
                            <div
                                key={crypto.name}
                                className="bg-gray-900 text-xs px-2 py-1 rounded-full text-white flex items-center"
                            >
                                {crypto.name}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-red-500">
                        <AlertTriangle size={16} />
                        <span className="text-sm font-medium">
                            {translate(
                                'Product not available on this chain',
                                language
                            )}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
