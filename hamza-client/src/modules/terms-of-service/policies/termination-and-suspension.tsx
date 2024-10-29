import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import React from 'react';

const TerminationAndSuspension = () => {
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
                Termination & Suspension
            </Text>
            <Text mb={4}>
                We take the safety and integrity of our marketplace seriously.
                In certain cases, we may suspend or terminate user accounts.
                Please read the following to understand when and why this might
                happen, and what it means for you.
            </Text>

            {/* Grounds for Suspension */}
            <Text fontWeight="bold" mb={4}>
                1. Grounds for Suspension
            </Text>
            <Text mb={4}>
                Your account may be suspended or terminated if you:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>Violate the Terms of Service (ToS),</ListItem>
                <ListItem>
                    Engage in illegal activities, including fraud or suspicious
                    behavior,
                </ListItem>
                <ListItem>
                    Post inflammatory, discriminatory, or harmful comments
                    against other platform users and/or staff
                </ListItem>
                <ListItem>
                    Repeatedly breach the rules or exhibit harmful behavior on
                    the platform.
                </ListItem>
            </UnorderedList>
            <Text mb={4}>
                These actions are considered serious offenses and may result in
                immediate suspension or termination of your account.
            </Text>

            {/* Suspension Process */}
            <Text fontWeight="bold" mb={4}>
                2. Suspension Process
            </Text>
            <Text mb={4}>
                If your account is suspended, you will receive a notification
                explaining the reason for the suspension and the procedure to
                follow. You will also be given the opportunity to appeal the
                decision by contacting our support team.
            </Text>
            <Text mb={4}>
                If the issue that caused your suspension is not resolved, or if
                the same behavior is repeated, your account may be permanently
                terminated.
            </Text>

            {/* Consequences of Termination */}
            <Text fontWeight="bold" mb={4}>
                3. Consequences of Termination
            </Text>
            <Text mb={4}>
                If your account is suspended or terminated while you have funds
                held in escrow, the platform will determine whether the funds
                should be refunded to the buyer or paid to the seller, depending
                on the situation.
            </Text>
            <Text mb={4}>
                In cases involving gross illegal activities or violations of
                regulations, the platform may choose to forfeit the funds due to
                regulatory compliance. The final decision on how funds are
                handled will be based on the specific circumstances of the case.
            </Text>
        </Flex>
    );
};

export default TerminationAndSuspension;
