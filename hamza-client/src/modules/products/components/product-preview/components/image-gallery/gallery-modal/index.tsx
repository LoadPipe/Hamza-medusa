import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    Image,
    Box,
    Grid,
    Flex,
    IconButton,
} from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FaCircle } from 'react-icons/fa';

interface ImageGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[]; // Array of image URLs
    selectedImageIndex: number; // Selected image index passed from PreviewGallery
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
    isOpen,
    onClose,
    images,
    selectedImageIndex, // Use this index to initialize the selected image
}) => {
    const [selectedImage, setSelectedImage] = useState<string>(
        images[selectedImageIndex]
    );
    const [currentIndex, setCurrentIndex] =
        useState<number>(selectedImageIndex);

    useEffect(() => {
        setSelectedImage(images[selectedImageIndex]);
        setCurrentIndex(selectedImageIndex);
    }, [selectedImageIndex, images]);

    const handlePrevious = () => {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent
                width="100%"
                height="100%"
                maxW={{ base: '338px', md: '1030px' }} // Make modal width responsive
                maxH={{ base: '409px', md: '883px' }} // Make modal height responsive
                px={{ base: '29.63px', md: '40px' }} // Adjust padding for mobile
                py={{ base: '29.63px', md: '24px' }} // Adjust vertical padding
                backgroundColor="#121212"
            >
                <ModalCloseButton color="white" />
                <ModalBody>
                    <Flex
                        flexDir={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        height={'100%'}
                        position="relative"
                    >
                        <Box
                            mb={4}
                            maxH={'598px'}
                            minH={'242px'}
                            maxWidth="840px"
                            width={'100%'}
                            aspectRatio={'1 / 1'}
                            mx="auto"
                        >
                            <Image
                                src={selectedImage}
                                alt="Selected Image"
                                width="100%"
                                height="100%"
                                borderRadius="md"
                                objectFit="fill"
                            />
                        </Box>

                        {/* Left and Right Navigation Buttons */}
                        <IconButton
                            aria-label="Previous Image"
                            icon={<MdChevronLeft size={'40px'} />}
                            position="absolute"
                            top="40%"
                            left={{ base: '-40px', md: '-40px' }} // Adjust button position for mobile
                            transform="translateY(-50%)"
                            size="lg"
                            onClick={handlePrevious}
                            backgroundColor="rgba(0, 0, 0, 0.5)"
                            _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                            color="white"
                            borderRadius="full"
                        />
                        <IconButton
                            aria-label="Next Image"
                            icon={<MdChevronRight size={'40px'} />}
                            position="absolute"
                            top="40%"
                            right={{ base: '-40px', md: '-40px' }} // Adjust button position for mobile
                            transform="translateY(-50%)"
                            onClick={handleNext}
                            backgroundColor="rgba(0, 0, 0, 0.5)"
                            _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                            color="white"
                            borderRadius="full"
                        />

                        {/* Thumbnail Images */}
                        <Grid
                            templateColumns="repeat(5, 1fr)" // Always 5 images per row
                            justifyContent="center"
                            justifyItems="center"
                            gap={{ base: 3, md: 7 }} // Adjust gap for mobile and larger screens
                            mt={4}
                            width="100%"
                            maxWidth="840px"
                        >
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    border={
                                        selectedImage === image
                                            ? '2px solid primary.indigo.900'
                                            : '2px solid transparent'
                                    }
                                    borderRadius="md"
                                    overflow="hidden"
                                    cursor="pointer"
                                    aspectRatio={'1 / 1'}
                                    width="100%" // Make sure each image takes up the full space within its grid cell
                                    maxW={'145px'} // Control max width for images
                                    onClick={() => {
                                        setSelectedImage(image);
                                        setCurrentIndex(index);
                                    }}
                                >
                                    <Image
                                        src={image}
                                        alt={`Image ${index + 1}`}
                                        width="100%"
                                        height="100%"
                                        objectFit="fill"
                                    />
                                </Box>
                            ))}
                        </Grid>

                        {/* Dots Indicator */}
                        <Flex
                            justifyContent="center"
                            position="absolute"
                            bottom={{ base: '-17px', md: '-5px' }}
                            mt={2}
                        >
                            {images.map((_, index) => (
                                <Box key={index} mx={1.5}>
                                    <FaCircle
                                        size={9}
                                        color={
                                            index === currentIndex
                                                ? 'green'
                                                : '#666'
                                        }
                                    />
                                </Box>
                            ))}
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ImageGalleryModal;
