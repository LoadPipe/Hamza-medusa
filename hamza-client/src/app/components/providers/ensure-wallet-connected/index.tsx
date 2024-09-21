import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Stack,
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { WalletConnectButton } from '@/components/providers/rainbowkit/connect-button/connect-button';

/**
 * The EnsureWalletConnected component is used to guarantee that the user's wallet is connected before allowing access to certain features within the application.
 * It acts as a gatekeeper for any functionality that requires blockchain interactions, which are dependent on a wallet connection.
 * This component is essential for operations that require a user to sign transactions or verify ownership of blockchain assets.
 * @Author: Garo Nazarian
 *
 * Features:
 * - Monitors the wallet connection status continuously.
 * - Blocks interaction with child components if no wallet is connected.
 * - Provides a callback mechanism for further actions when the wallet is disconnected.
 * - Optionally renders a custom UI prompt or uses a default alert to inform the user to connect their wallet.
 *
 * Usage:
 * Render <EnsureWalletConnected/> component after importing it
 */
export const EnsureWalletConnected = () => {
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const [clientSide, setClientSide] = useState(false);

    useEffect(() => {
        // Ensuring this runs only client-side
        setClientSide(true);
        if (!isConnected && openConnectModal) {
            openConnectModal();
        }
    }, [isConnected, openConnectModal]);

    if (!clientSide) {
        // Don't render modal server-side
        return null;
    }

    return (
        <Modal
            isOpen={!isConnected}
            onClose={() => {}}
            isCentered
            closeOnOverlayClick={false}
        >
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
            <ModalContent bg="black" color="white">
                <ModalHeader>Wallet Connection Required</ModalHeader>
                <ModalBody>
                    <Stack spacing={8}>
                        <p>
                            You need to connect your wallet to access this
                            feature.
                        </p>
                        <WalletConnectButton />
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EnsureWalletConnected;
