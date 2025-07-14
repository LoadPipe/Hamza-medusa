'use client';

import React, { memo } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import LandingPageHero from './components/LandingPageHero';
import WhatIsHamza from './components/WhatIsHamza';
import HowHamzaWorks from './components/HowHamzaWorks';
import EscrowExplanation from './components/EscrowExplanation';
import AcceptedCrypto from './components/AcceptedCrypto';
import InfographicSection from './components/InfographicSection';
import AboutUsAccordion from './components/AboutUsAccordion';
import CallToAction from './components/CallToAction';

interface HowItWorksTemplateProps {
    selectedLanguage?: string;
}

const HowItWorksTemplate = memo<HowItWorksTemplateProps>(({
    selectedLanguage = 'en'
}) => {
    return (
        <Box minH="100vh" bg="black" color="white">
            <VStack
                spacing={{ base: 16, sm: 24, lg: 32, xl: 40 }}
                as="main"
                align="stretch"
            >
                <LandingPageHero selectedLanguage={selectedLanguage} />
                <WhatIsHamza selectedLanguage={selectedLanguage} />
                <HowHamzaWorks selectedLanguage={selectedLanguage} />
                <EscrowExplanation selectedLanguage={selectedLanguage} />
                <AcceptedCrypto selectedLanguage={selectedLanguage} />
                <InfographicSection selectedLanguage={selectedLanguage} />
                <AboutUsAccordion selectedLanguage={selectedLanguage} />
                <CallToAction selectedLanguage={selectedLanguage} />
            </VStack>
        </Box>
    );
});

HowItWorksTemplate.displayName = 'HowItWorksTemplate';

export default HowItWorksTemplate;