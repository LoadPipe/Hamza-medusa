'use client';

import type React from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { ArrowRight } from 'lucide-react';
import {
    ShoppingBag,
    Shirt,
    Gamepad2,
    BookOpen,
    Laptop,
    Gem,
    Footprints,
} from 'lucide-react'; // Example icons

interface Category {
    id: string;
    name: string;
    icon?: React.ElementType; // Lucide icon component
    emoji?: string; // Fallback if no icon
    itemCount: number;
}

interface CategoriesGridProps {
    categories: Category[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
}

const iconMap: { [key: string]: React.ElementType } = {
    All: ShoppingBag,
    Clothes: Shirt,
    Games: Gamepad2,
    Books: BookOpen,
    Electronics: Laptop,
    Jewelry: Gem,
    Shoes: Footprints,
};

const CategoriesGrid: React.FC<CategoriesGridProps> = ({
    categories,
    translate,
    selectedLanguage,
}) => {
    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">
                    {translate('Shop by Category', selectedLanguage)}
                </h2>
                <button className="flex items-center text-green-400 hover:text-green-300 transition-colors">
                    {translate('View All', selectedLanguage)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 sm:gap-6">
                {categories.map((category) => {
                    const IconComponent = iconMap[category.name] || ShoppingBag;
                    return (
                        <Card
                            key={category.id}
                            className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:border-green-400 cursor-pointer group"
                        >
                            <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center">
                                <div className="p-3 rounded-full bg-gray-800 group-hover:bg-green-400 mb-3 transition-colors">
                                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 group-hover:text-black transition-colors" />
                                </div>
                                <h3
                                    className="text-sm sm:text-base font-semibold text-white mb-1 truncate w-full"
                                    title={translate(
                                        category.name,
                                        selectedLanguage
                                    )}
                                >
                                    {translate(category.name, selectedLanguage)}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {category.itemCount}{' '}
                                    {translate('items', selectedLanguage)}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoriesGrid;
