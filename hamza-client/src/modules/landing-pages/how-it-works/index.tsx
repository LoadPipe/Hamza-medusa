'use client';

import React, { memo } from 'react';
import { Box } from '@chakra-ui/react';
import LandingPageHero from './components/LandingPageHero';
import WhatIsHamza from './components/WhatIsHamza';
import HowHamzaWorks from './components/HowHamzaWorks';
import EscrowExplanation from './components/EscrowExplanation';
import AcceptedCrypto from './components/AcceptedCrypto';
import InfographicSection from './components/InfographicSection';
import AboutUsAccordion from './components/AboutUsAccordion';
import CallToAction from './components/CallToAction';

const HowItWorksTemplate = memo(() => {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
                <div className="relative z-10">
                    {/* Main content without navbar padding */}
                    <div className="space-y-32 lg:space-y-48">
                        <LandingPageHero selectedLanguage={'en'} />
                        <WhatIsHamza selectedLanguage={'en'} />
                        <HowHamzaWorks selectedLanguage={'en'} />
                        <EscrowExplanation selectedLanguage={'en'} />
                        <AcceptedCrypto selectedLanguage={'en'} />
                        <InfographicSection selectedLanguage={'en'} />
                        <AboutUsAccordion selectedLanguage={'en'} />
                        <CallToAction selectedLanguage={'en'} />
                    </div>
                </div>
            </div>
        </div>
    );
});

HowItWorksTemplate.displayName = 'HowItWorksTemplate';

export default HowItWorksTemplate;
