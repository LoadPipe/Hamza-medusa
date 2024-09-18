import React, { useEffect } from 'react';
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

export const EnsureWalletConnected = () => {
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    useEffect(() => {
        if (!isConnected && openConnectModal) {
            openConnectModal(); // Optionally ensure the modal logic is handled if not already by WalletConnectButton
        }
    }, [isConnected, openConnectModal]);

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
