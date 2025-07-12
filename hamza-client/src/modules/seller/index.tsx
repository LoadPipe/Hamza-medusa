'use client';

import React, { useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';

import HeroSection from './components/hero-section';
import PlatformAdvantagesSection from './components/platform-advantages';
import ComparisonTable from './components/comparison-table';
import HowSellingWorksSection from './components/how-selling-works';
import SellerAdvantagesSection from './components/seller-advantages';
import SuccessStoriesSection from './components/success-stories';
import PricingComparisonSection from './components/pricing-comparison';
import GettingStartedSection from './components/getting-started';
import SellerFinalCTASection from './components/final-cta';

interface StartSellingTemplateProps {
    selectedLanguage?: string;
}

const StartSellingTemplate: React.FC<StartSellingTemplateProps> = ({
    selectedLanguage = "EN"
}) => {
    return (
        <Box minH="100vh" bg="black" color="white">
            <VStack
                spacing={{ base: 16, sm: 24, lg: 32, xl: 40 }}
                as="main"
                align="stretch"
            >
                {/* Hero Section */}
                <HeroSection />

                {/* Platform Advantages - Why Sell on Hamza */}
                <PlatformAdvantagesSection />

                {/* Comparison Table */}
                <ComparisonTable />

                {/* How Selling Works */}
                <HowSellingWorksSection />

                {/* Seller Benefits/Advantages */}
                <SellerAdvantagesSection />

                {/* Success Stories */}
                <SuccessStoriesSection />

                {/* Pricing Comparison */}
                <PricingComparisonSection />

                {/* Getting Started/Onboarding */}
                <GettingStartedSection />

                {/* Final Call to Action */}
                <SellerFinalCTASection />
            </VStack>
        </Box>
    );
};

export default StartSellingTemplate;