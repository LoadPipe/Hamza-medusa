import {
    Box,
    Flex,
    Grid,
    GridItem,
    Image,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react';
import { getObjectFit } from '@modules/get-object-fit';
import useProductPreview from '@store/product-preview/product-preview';
import React, { useEffect, useState } from 'react';
import ImageGalleryModal from './image-gallery/gallery-modal';

const PreviewGallery = () => {
    const { productData } = useProductPreview();
    const [images, setImages] = useState<string[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    useEffect(() => {
        if (productData !== null) {
            setImages(productData?.images?.map((img) => img.url) || []);
        }
    }, [productData]);

    const gridTemplate = useBreakpointValue(
        {
            base: '1fr', // On mobile, stack vertically
            md: '2fr 1fr', // On medium screens and up, use 2 columns
        },
        {
            fallback: 'md',
        }
    );

    const objectFit = getObjectFit(productData.handle);

    const openGallery = (index: number) => {
        setSelectedImageIndex(index);
        onOpen();
    };

    return (
        <Flex maxWidth={'1280px'} width={'100%'} flexDirection={'column'}>
            <Grid templateColumns={gridTemplate} gap={4}>
                <GridItem display={'flex'}>
                    <Flex
                        backgroundColor={
                            objectFit === 'cover' ? 'black' : 'white'
                        }
                        width={'100%'}
                        minH={'312.22px'}
                        maxH={'504.11px'}
                        maxW={'736.04px'}
                        overflow="hidden"
                        borderLeftRadius={'16px'}
                        borderRightRadius={{ base: '16px', md: 'none' }}
                        onClick={() => openGallery(0)} // Open gallery on click
                        cursor="pointer"
                    >
                        {images.length > 0 && (
                            <Image
                                src={images[0]}
                                alt="Left Image"
                                width="100%"
                                height="100%"
                                objectFit={objectFit}
                            />
                        )}
                    </Flex>
                </GridItem>
                <GridItem>
                    <Grid
                        templateColumns={{
                            base: 'repeat(4, 1fr)',
                            md: '1fr 1fr',
                        }}
                        gap={3.5}
                    >
                        {images.slice(1, 5).map((image, index) => (
                            <GridItem key={index}>
                                <Flex
                                    backgroundColor={'white'}
                                    width={{ base: '100%', md: '257.4px' }}
                                    minW="80px"
                                    minH={'80px'}
                                    maxH={'245.18px'}
                                    borderRadius={{ base: '16px', md: 'none' }}
                                    overflow={'hidden'}
                                    onClick={() => openGallery(index + 1)} // Open gallery on click
                                    cursor="pointer"
                                >
                                    <Image
                                        src={image}
                                        alt={`Image ${index + 1}`}
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                    />
                                </Flex>
                            </GridItem>
                        ))}
                    </Grid>
                </GridItem>
            </Grid>

            {/* Image Gallery Modal */}
            {images.length > 0 && (
                <ImageGalleryModal
                    isOpen={isOpen}
                    onClose={onClose}
                    images={images}
                    initialIndex={selectedImageIndex} // Pass the selected image index
                />
            )}
        </Flex>
    );
};

export default PreviewGallery;
