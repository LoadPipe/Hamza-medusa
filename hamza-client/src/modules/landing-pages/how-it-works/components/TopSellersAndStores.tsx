'use client';

import type React from 'react';
import { useState } from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { Star, ArrowRight, Store, Award } from 'lucide-react';

interface Seller {
    id: string;
    name: string;
    image: string;
    sales: number;
    rating: number;
}

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

interface TopSellersAndStoresProps {
    sellers: Seller[];
    stores: Store[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const TopSellersAndStores: React.FC<TopSellersAndStoresProps> = ({
    sellers,
    stores,
    translate,
    selectedLanguage,
    selectedCurrency,
}) => {
    const [activeTab, setActiveTab] = useState<'sellers' | 'stores'>('sellers');
    const [visibleItems, setVisibleItems] = useState(4);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(selectedLanguage, {
            style: 'currency',
            currency: selectedCurrency,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(selectedLanguage, {
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                    {activeTab === 'sellers' ? (
                        <Award className="mr-2 h-8 w-8 text-[#BB86FC]" />
                    ) : (
                        <Store className="mr-2 h-8 w-8 text-[#BB86FC]" />
                    )}
                    {translate(
                        activeTab === 'sellers'
                            ? 'Top Sellers'
                            : 'Featured Stores',
                        selectedLanguage
                    )}
                </h2>
                <div className="flex space-x-4">
                    <button
                        className={`px-4 py-2 rounded-full ${
                            activeTab === 'sellers'
                                ? 'bg-[#BB86FC] text-black'
                                : 'bg-[#121212] text-white'
                        }`}
                        onClick={() => setActiveTab('sellers')}
                    >
                        {translate('Sellers', selectedLanguage)}
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full ${
                            activeTab === 'stores'
                                ? 'bg-[#BB86FC] text-black'
                                : 'bg-[#121212] text-white'
                        }`}
                        onClick={() => setActiveTab('stores')}
                    >
                        {translate('Stores', selectedLanguage)}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeTab === 'sellers'
                    ? sellers.slice(0, visibleItems).map((seller) => (
                          <Card
                              key={seller.id}
                              className="bg-[#121212] rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105"
                          >
                              <CardContent className="p-6">
                                  <div className="flex items-center mb-4">
                                      <img
                                          src={
                                              seller.image ||
                                              '/placeholder.svg?height=100&width=100'
                                          }
                                          alt={seller.name}
                                          className="w-16 h-16 rounded-full object-cover mr-4"
                                      />
                                      <div>
                                          <h3 className="text-lg font-semibold text-white">
                                              {translate(
                                                  seller.name,
                                                  selectedLanguage
                                              )}
                                          </h3>
                                          <div className="flex items-center">
                                              {[...Array(5)].map((_, i) => (
                                                  <Star
                                                      key={i}
                                                      className={`w-4 h-4 ${i < seller.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                      fill="currentColor"
                                                  />
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-400">
                                          {translate(
                                              'Total Sales',
                                              selectedLanguage
                                          )}
                                      </span>
                                      <span className="text-sm font-medium text-white">
                                          {formatCurrency(seller.sales)}
                                      </span>
                                  </div>
                              </CardContent>
                          </Card>
                      ))
                    : stores.slice(0, visibleItems).map((store) => (
                          <Card
                              key={store.id}
                              className="bg-[#121212] rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105"
                          >
                              <CardContent className="p-6">
                                  <div className="flex items-center justify-between mb-4">
                                      <h3 className="text-lg font-semibold text-white">
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
                                          ({formatNumber(store.reviews)}{' '}
                                          reviews)
                                      </span>
                                  </div>
                                  <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                          <span className="text-gray-400">
                                              {translate(
                                                  'Total Sales',
                                                  selectedLanguage
                                              )}
                                          </span>
                                          <span className="text-white">
                                              {formatNumber(store.totalSales)}
                                          </span>
                                      </div>
                                      <div className="flex justify-between">
                                          <span className="text-gray-400">
                                              {translate(
                                                  'Products',
                                                  selectedLanguage
                                              )}
                                          </span>
                                          <span className="text-white">
                                              {store.productsCount}
                                          </span>
                                      </div>
                                      <div className="flex justify-between">
                                          <span className="text-gray-400">
                                              {translate(
                                                  'Active Since',
                                                  selectedLanguage
                                              )}
                                          </span>
                                          <span className="text-white">
                                              {formatDate(store.activeSince)}
                                          </span>
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}
            </div>
            {visibleItems <
                (activeTab === 'sellers' ? sellers.length : stores.length) && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setVisibleItems((prev) => prev + 4)}
                        className="px-6 py-2 bg-[#BB86FC] text-black rounded-full hover:bg-[#9D4EDD] transition-colors flex items-center mx-auto"
                    >
                        {translate('View More', selectedLanguage)}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TopSellersAndStores;
