import type React from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { ArrowRight, Award } from 'lucide-react';

interface Seller {
    id: string;
    name: string;
    image: string;
    sales: number;
    rating: number;
}

interface TopSellersProps {
    sellers: Seller[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const TopSellers: React.FC<TopSellersProps> = ({
    sellers,
    translate,
    selectedLanguage,
    selectedCurrency,
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(selectedLanguage, {
            style: 'currency',
            currency: selectedCurrency,
        }).format(amount);
    };

    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                    <Award className="mr-2 h-8 w-8 text-[#BB86FC]" />
                    {translate('Top Sellers', selectedLanguage)}
                </h2>
                <button className="text-[#BB86FC] hover:text-[#9D4EDD] transition-colors flex items-center">
                    {translate('View All', selectedLanguage)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sellers.map((seller, index) => (
                    <Card
                        key={seller.id}
                        className="bg-[#121212] rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center mb-4">
                                <div className="relative">
                                    <img
                                        src={seller.image || '/placeholder.svg'}
                                        alt={seller.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div className="absolute -top-2 -left-2 bg-[#BB86FC] text-black font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        {translate(
                                            seller.name,
                                            selectedLanguage
                                        )}
                                    </h3>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < seller.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">
                                    {translate('Total Sales', selectedLanguage)}
                                </span>
                                <span className="text-sm font-medium text-white">
                                    {formatCurrency(seller.sales)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TopSellers;
