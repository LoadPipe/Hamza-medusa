'use client';
import React, { useState } from 'react';
import {
    Flex,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react';
import ShippingPolicy from '../policies/shipping-policy';
import PaymentPolicy from '../policies/payment-policy';
import ReturnPolicy from '../policies/return-policy';
import DisclaimerPolicy from '@modules/terms-of-service/policies/disclaimer-policy';
import BuyerSellerProtection from '@modules/terms-of-service/policies/buyer-seller-protection';
import LimitationOfLiability from '@modules/terms-of-service/policies/limitation-of-liability';
import PrivacyPolicy from '@modules/terms-of-service/policies/privacy-policy';
import IntellectualProperty from '@modules/terms-of-service/policies/intellectual-property';
import TerminationAndSuspension from '@modules/terms-of-service/policies/termination-and-suspension';
import ComplianceWithCryptoRegulations from '@modules/terms-of-service/policies/compliance-with-crypto-regulations';
import JurisdictionalRestrictions from '@modules/terms-of-service/policies/jurisdictional-restrictions';
import DisputeResolution from '@modules/terms-of-service/policies/dispute-resolution';
import ChangesToTermsOfService from '@modules/terms-of-service/policies/changes-to-terms-of-service';

const CheckoutTermsOfService = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Flex
                mt="1rem"
                flexDir={'column'}
                gap={{ base: 3, md: 5 }}
                alignItems="center" // Centers content horizontally
                justifyContent="center" // Centers content vertically
            >
                {/* Modal Trigger */}
                <Text
                    as="span"
                    color="primary.indigo.900"
                    cursor={'pointer'}
                    opacity={1}
                    _hover={{ opacity: 0.7 }}
                    onClick={openModal}
                    textAlign="center" // Centers text
                >
                    Terms and Conditions
                </Text>

                {/* Modal */}
                <Modal isOpen={isOpen} onClose={closeModal} size="lg">
                    <ModalOverlay />
                    <ModalContent
                        maxWidth={{ base: 'calc(100% - 3rem)', md: '760px' }}
                        backgroundColor={'#121212'}
                        color={'white'}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center" // Centers content vertically
                        alignItems="center" // Centers content horizontally
                        textAlign="center" // Centers text
                    >
                        <ModalHeader
                            maxW={{ base: '253px' }}
                            width={'100%'}
                            textAlign="center" // Centers text
                        >
                            Terms of Service
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {/* Render All Policies */}
                            <DisclaimerPolicy />
                            <ShippingPolicy is_checkout={true} />
                            <ReturnPolicy is_checkout={true} />
                            <PaymentPolicy is_checkout={true} />
                            {/*<ReturnPolicy />*/}
                            <BuyerSellerProtection />
                            <LimitationOfLiability />
                            <PrivacyPolicy is_checkout={true} />
                            <IntellectualProperty />
                            <TerminationAndSuspension />
                            <ComplianceWithCryptoRegulations />
                            <JurisdictionalRestrictions />
                            <DisputeResolution />
                            <ChangesToTermsOfService />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                fontSize={{ base: '14px', md: '16px' }}
                                backgroundColor={'primary.green.900'}
                                onClick={closeModal}
                                mx="auto" // Centers button horizontally in the modal footer
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Flex>
        </>
    );
};

export default CheckoutTermsOfService;
