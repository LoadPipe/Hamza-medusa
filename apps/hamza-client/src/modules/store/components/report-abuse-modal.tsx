import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Textarea,
    Select,
    useDisclosure,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    FormErrorMessage,
} from '@chakra-ui/react';

const ReportAbuseModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [abuseReason, setAbuseReason] = useState('');
    const [abuseDetails, setAbuseDetails] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isAttemptedSubmit, setIsAttemptedSubmit] = useState(false);

    const handleSubmit = () => {
        console.log('Abuse Report Submitted');
        console.log('Reason:', abuseReason);
        console.log('Details:', abuseDetails);
        if (!abuseReason) {
            setIsAttemptedSubmit(true);
            return;
        }
        // Reset form values
        setAbuseReason('');
        setAbuseDetails('');
        setIsSubmitted(true);
        setIsAttemptedSubmit(false);

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Report Abuse</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isSubmitted ? (
                        <Alert status="success">
                            <AlertIcon />
                            <AlertTitle mr={2}>Abuse reported!</AlertTitle>
                            <AlertDescription>
                                Your report has been submitted.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <FormControl
                                id="abuse-reason"
                                isRequired
                                isInvalid={!abuseReason && isAttemptedSubmit}
                            >
                                <FormLabel>Reason</FormLabel>
                                <Select
                                    placeholder="Select reason"
                                    value={abuseReason}
                                    onChange={(e) =>
                                        setAbuseReason(e.target.value)
                                    }
                                >
                                    <option value="spam">Spam</option>
                                    <option value="harassment">
                                        Harassment
                                    </option>
                                    <option value="inappropriate">
                                        Inappropriate Content
                                    </option>
                                </Select>
                                {!abuseReason && isAttemptedSubmit && (
                                    <FormErrorMessage>
                                        Reason is required.
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl id="abuse-details" isRequired mt={4}>
                                <FormLabel>Details</FormLabel>
                                <Textarea
                                    placeholder="Provide additional details"
                                    value={abuseDetails}
                                    onChange={(e) =>
                                        setAbuseDetails(e.target.value)
                                    }
                                />
                            </FormControl>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    {!isSubmitted && (
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReportAbuseModal;
