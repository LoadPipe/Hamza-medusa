import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import React from 'react';

const JurisdictionalRestrictions = () => {
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
                Jurisdictional Restrictions
            </Text>
            <Text mb={4}>
                Due to local cryptocurrency laws and sanctions, users from
                certain countries are restricted from using our platform. At
                this time, you agree that you are not a citizen of the following
                countries:
            </Text>

            {/* Restricted Countries List */}
            <UnorderedList ml={8} mb={4}>
                <ListItem>Afghanistan</ListItem>
                <ListItem>Algeria</ListItem>
                <ListItem>Bangladesh</ListItem>
                <ListItem>Bolivia</ListItem>
                <ListItem>China</ListItem>
                <ListItem>Egypt</ListItem>
                <ListItem>Ghana</ListItem>
                <ListItem>Iraq</ListItem>
                <ListItem>Kuwait</ListItem>
                <ListItem>Lesotho</ListItem>
                <ListItem>Libya</ListItem>
                <ListItem>Nepal</ListItem>
                <ListItem>North Macedonia</ListItem>
                <ListItem>Morocco</ListItem>
                <ListItem>Myanmar</ListItem>
                <ListItem>Pakistan</ListItem>
                <ListItem>Republic of Congo</ListItem>
                <ListItem>Saudi Arabia</ListItem>
                <ListItem>Sierra Leone</ListItem>
                <ListItem>Tunisia</ListItem>
                <ListItem>Iran</ListItem>
                <ListItem>North Korea</ListItem>
            </UnorderedList>

            <Text mb={4}>
                If you are a resident or citizen of any of these countries, you
                are not permitted to create an account or engage in any
                transactions on our platform. If detected, the Platform can
                suspend or terminate your account.
            </Text>
            <Text mb={4}>
                In certain cases, when a non-citizen of the aforementioned
                countries transacts with the platform, it can be allowed to ship
                packages to some of these countries. Please consult directly
                with the Seller under such circumstances.
            </Text>
            <Text mb={4}>
                By using our platform, you agree to comply with all applicable
                local and international cryptocurrency regulations.
            </Text>
        </Flex>
    );
};

export default JurisdictionalRestrictions;
