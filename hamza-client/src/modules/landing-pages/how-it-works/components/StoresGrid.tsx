'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { Star, Filter } from 'lucide-react';

interface Store {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    category: string[];
    productsCount: number;
    verified: boolean;
    totalSales: number;
    location: string;
    activeSince: string;
    level: {
        name: string;
        color: string;
    };
    metrics: {
        responseRate: number;
        shippingTime: string;
        returnRate: number;
    };
}

const categories = [
    { name: 'Filter', icon: Filter },
    { name: 'All', emoji: '🏪' },
    { name: 'Electronics', emoji: '🔌' },
    { name: 'Fashion', emoji: '👕' },
    { name: 'Home', emoji: '🏠' },
    { name: 'Beauty', emoji: '💄' },
    { name: 'Sports', emoji: '⚽' },
    { name: 'Books', emoji: '📚' },
];

const dummyStores: Store[] = [
    {
        id: 1,
        name: 'TechHub Electronics',
        image: '🏪',
        rating: 4.8,
        reviews: 1250,
        category: ['Electronics', 'Gadgets'],
        productsCount: 532,
        verified: true,
        totalSales: 15234,
        location: 'United States',
        activeSince: '2021-06',
        level: {
            name: 'Diamond',
            color: 'text-blue-400',
        },
        metrics: {
            responseRate: 98,
            shippingTime: '2-4 days',
            returnRate: 1.2,
        },
    },
    {
        id: 2,
        name: 'Fashion Forward',
        image: '🛍️',
        rating: 4.6,
        reviews: 890,
        category: ['Fashion', 'Clothing'],
        productsCount: 1205,
        verified: true,
        totalSales: 8765,
        location: 'United Kingdom',
        activeSince: '2020-11',
        level: {
            name: 'Gold',
            color: 'text-yellow-400',
        },
        metrics: {
            responseRate: 95,
            shippingTime: '3-5 days',
            returnRate: 1.8,
        },
    },
    {
        id: 3,
        name: 'Home & Living',
        image: '🏠',
        rating: 4.7,
        reviews: 675,
        category: ['Home', 'Decor'],
        productsCount: 432,
        verified: true,
        totalSales: 12345,
        location: 'Canada',
        activeSince: '2022-03',
        level: {
            name: 'Platinum',
            color: 'text-gray-400',
        },
        metrics: {
            responseRate: 92,
            shippingTime: '1-3 days',
            returnRate: 2.1,
        },
    },
    {
        id: 4,
        name: 'Beauty Haven',
        image: '💄',
        rating: 4.9,
        reviews: 2100,
        category: ['Beauty', 'Cosmetics'],
        productsCount: 890,
        verified: true,
        totalSales: 23456,
        location: 'Australia',
        activeSince: '2019-09',
        level: {
            name: 'Diamond',
            color: 'text-blue-400',
        },
        metrics: {
            responseRate: 99,
            shippingTime: '2-4 days',
            returnRate: 0.9,
        },
    },
    {
        id: 5,
        name: 'Sports World',
        image: '⚽',
        rating: 4.5,
        reviews: 450,
        category: ['Sports', 'Equipment'],
        productsCount: 678,
        verified: false,
        totalSales: 9876,
        location: 'Germany',
        activeSince: '2023-01',
        level: {
            name: 'Silver',
            color: 'text-gray-400',
        },
        metrics: {
            responseRate: 88,
            shippingTime: '5-7 days',
            returnRate: 2.5,
        },
    },
    {
        id: 6,
        name: 'Book Corner',
        image: '📚',
        rating: 4.8,
        reviews: 320,
        category: ['Books', 'Literature'],
        productsCount: 2450,
        verified: true,
        totalSales: 7654,
        location: 'France',
        activeSince: '2021-02',
        level: {
            name: 'Gold',
            color: 'text-yellow-400',
        },
        metrics: {
            responseRate: 96,
            shippingTime: '2-4 days',
            returnRate: 1.5,
        },
    },
    {
        id: 7,
        name: 'Gadget Galaxy',
        image: '📱',
        rating: 4.7,
        reviews: 890,
        category: ['Electronics', 'Gadgets'],
        productsCount: 765,
        verified: true,
        totalSales: 11223,
        location: 'Japan',
        activeSince: '2020-05',
        level: {
            name: 'Platinum',
            color: 'text-gray-400',
        },
        metrics: {
            responseRate: 93,
            shippingTime: '3-5 days',
            returnRate: 1.9,
        },
    },
    {
        id: 8,
        name: 'Style Studio',
        image: '👗',
        rating: 4.6,
        reviews: 567,
        category: ['Fashion', 'Accessories'],
        productsCount: 980,
        verified: false,
        totalSales: 6789,
        location: 'Italy',
        activeSince: '2022-08',
        level: {
            name: 'Silver',
            color: 'text-gray-400',
        },
        metrics: {
            responseRate: 90,
            shippingTime: '4-6 days',
            returnRate: 2.2,
        },
    },
];

interface StoresGridProps {
    translate: (key: string, lang?: string) => string;
    language: string;
}

export default function StoresGrid({ translate, language }: StoresGridProps) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [visibleStores, setVisibleStores] = useState(8);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const filteredStores =
        selectedCategory === 'All' || selectedCategory === 'Filter'
            ? dummyStores
            : dummyStores.filter((store) =>
                  store.category.includes(selectedCategory)
              );

    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                    Featured Stores
                </h2>
                <button className="text-gray-400 hover:text-white">
                    View All
                </button>
            </div>

            <div className="mb-8 flex items-center gap-2 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide relative z-20">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-sm sm:text-lg whitespace-nowrap ${
                            category.name === 'Filter'
                                ? 'border border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                                : category.name === selectedCategory
                                  ? 'bg-green-400 text-black'
                                  : 'bg-gray-900 text-white hover:bg-green-400 hover:text-black'
                        } transition-colors`}
                        onClick={() => setSelectedCategory(category.name)}
                    >
                        {category.name === 'Filter' ? (
                            <>
                                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>{category.name}</span>
                            </>
                        ) : (
                            <>
                                <span className="text-lg sm:text-xl">
                                    {category.emoji}
                                </span>
                                <span>{category.name}</span>
                            </>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredStores.slice(0, visibleStores).map((store) => (
                    <Card
                        key={store.id}
                        className="bg-black rounded-2xl overflow-hidden transition-all duration-300 ease-in-out group relative border border-gray-800"
                    >
                        <div className="w-full h-[400px] flex items-center justify-center text-8xl bg-white rounded-t-2xl transition-opacity duration-300 group-hover:opacity-0">
                            {store.image}
                            {store.verified && (
                                <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-1">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-6 h-[400px] overflow-y-auto absolute top-0 left-0 w-full bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-white">
                                    {store.name}
                                </h3>
                                <span
                                    className={`text-sm font-medium ${store.level.color}`}
                                >
                                    {store.level.name}
                                </span>
                            </div>

                            <div className="flex items-center mb-4">
                                <Star
                                    className="text-[#FEC84B] mr-1"
                                    size={16}
                                />
                                <span className="text-sm text-white">
                                    {store.rating}
                                </span>
                                <span className="text-sm text-gray-400 ml-1">
                                    ({formatNumber(store.reviews)} reviews)
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">
                                        Total Sales
                                    </span>
                                    <span className="text-white font-medium">
                                        {formatNumber(store.totalSales)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">
                                        Response Rate
                                    </span>
                                    <span className="text-white font-medium">
                                        {store.metrics.responseRate}%
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">
                                        Shipping Time
                                    </span>
                                    <span className="text-white font-medium">
                                        {store.metrics.shippingTime}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">
                                        Return Rate
                                    </span>
                                    <span className="text-white font-medium">
                                        {store.metrics.returnRate}%
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">
                                        Location
                                    </span>
                                    <span className="text-white font-medium">
                                        {store.location}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">
                                        Active Since
                                    </span>
                                    <span className="text-white font-medium">
                                        {formatDate(store.activeSince)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">
                                        Products Count
                                    </span>
                                    <span className="text-white font-medium">
                                        {store.productsCount}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="text-white font-medium mb-2">
                                    Categories:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {store.category.map((cat, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-xs bg-[#242424] text-gray-300 rounded-full"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {visibleStores < filteredStores.length && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setVisibleStores((prev) => prev + 8)}
                        className="px-8 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-400 transition-colors"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
