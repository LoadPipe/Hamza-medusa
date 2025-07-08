'use client';

import React, { memo } from 'react';
import { Box } from '@chakra-ui/react';
import HeroSection from './components/hero-section';
import WhyChooseSection from './components/why-choose-section';
import ComparisonTable from './components/conparison-table';
import CategorySection from './components/category-section';
import FinalCTASection from './components/final-section';
import HowItWorksSection from './components/how-it-works-section';
import PaymentMethodsSection from './components/payment-methods-section';
import PopularBrandsSection from './components/popular-brands-section';

const GiftCardsPromoTemplate = memo(() => {
    return (
        <Box width="100%" overflow="hidden">
            {/* Hero Section */}
            <HeroSection />

            {/* Why Choose Hamza */}
            <WhyChooseSection />

            {/* Platform Comparison */}
            <ComparisonTable />

            {/* How It Works */}
            <HowItWorksSection />

            {/* Browse by Category */}
            <CategorySection />

            {/* Popular Brands */}
            <PopularBrandsSection />

            {/* Payment Methods */}
            <PaymentMethodsSection />

            {/* Final section */}
            <FinalCTASection />
        </Box>
    );
});

GiftCardsPromoTemplate.displayName = 'GiftCardsPromoTemplate';

export default GiftCardsPromoTemplate;