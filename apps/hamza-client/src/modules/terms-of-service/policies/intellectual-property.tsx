import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import React from 'react';

const IntellectualProperty = () => {
    return (
        <Flex
            flexDirection="column"
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            {/* Header */}
            <Text
                fontWeight="bold"
                fontSize={{ base: '18px', md: '20px' }}
                mb={4}
            >
                Intellectual Property
            </Text>
            <Text mb={4}>
                Our marketplace respects the intellectual property rights of all
                users and strives to protect both the platform's and users'
                content. Please read the following carefully to understand how
                intellectual property is handled on our platform.
            </Text>

            {/* Platform Intellectual Property */}
            <Text fontWeight="bold" mb={4}>
                1. Platform Intellectual Property (Platform IP)
            </Text>
            <Text mb={4}>
                The marketplace and its related content, including but not
                limited to trademarks, logos, platform design, layout, and
                source code (where applicable), are the exclusive property of
                the platform. You may not use, copy, modify, or distribute any
                part of the platform’s intellectual property without our prior
                written permission.
            </Text>
            <Text mb={4}>
                By using the platform, you agree not to engage in any activity
                that would infringe upon or violate the intellectual property
                rights of the marketplace. Unauthorized use of our intellectual
                property may result in legal action.
            </Text>

            {/* User-Generated Content */}
            <Text fontWeight="bold" mb={4}>
                2. User-Generated Content
            </Text>
            <Text mb={4}>
                As a decentralized platform, user-generated content—such as
                product listings, reviews, and feedback—remains the property of
                the user who created it, whether that be the seller or the
                buyer, depending on the circumstances. This means that sellers
                retain ownership of their product listings and product reviews.
            </Text>
            <Text mb={4}>
                However, by using the platform, both buyers and sellers grant
                the platform a{' '}
                <strong>
                    non-exclusive, irrevocable, worldwide, royalty-free license
                </strong>{' '}
                to use, display, and promote their user-generated content for
                marketing or promotional purposes. This includes, but is not
                limited to, the use of listings, reviews, or images in
                advertisements, social media posts, and newsletters.
            </Text>

            {/* Infringements */}
            <Text fontWeight="bold" mb={4}>
                3. Infringements
            </Text>
            <Text mb={4}>
                If you believe that your intellectual property rights, such as
                copyrights or trademarks, have been infringed upon by product
                listings or any other content on the platform, please notify our
                customer support team as soon as possible.
            </Text>
            <Text mb={4}>
                To report an infringement, please provide the following details:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>
                    A description of the intellectual property that you believe
                    has been violated.
                </ListItem>
                <ListItem>
                    Specific details of the infringing content, including
                    product listings or user-generated content involved.
                </ListItem>
                <ListItem>
                    Any supporting evidence of your intellectual property
                    rights, such as trademarks or copyrights.
                </ListItem>
            </UnorderedList>
            <Text mb={4}>
                We will promptly investigate all infringement claims and take
                appropriate action, which may include removing the offending
                content or suspending accounts that violate intellectual
                property rights.
            </Text>
        </Flex>
    );
};

export default IntellectualProperty;
