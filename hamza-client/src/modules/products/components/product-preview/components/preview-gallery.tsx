import {
    Box,
    Flex,
    Grid,
    GridItem,
    Image,
    useDisclosure,
    useBreakpointValue,
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
            setImages(
                productData?.images?.map((img: { url: any }) => img.url) || []
            );
        }
    }, [productData]);

    const objectFit = getObjectFit(productData.handle);

    const openGallery = (index: number) => {
        setSelectedImageIndex(index);
        onOpen();
    };

    // Responsive layout adjustment for the grid
    const gridTemplateColumns = useBreakpointValue({
        base: '1fr', // On mobile, only 1 column
        md: '1fr 1fr', // On medium screens and up, 2 columns
    });

    const gridTemplateRows = useBreakpointValue({
        base: 'auto auto', // On mobile, stack the big image on top of the small images
        md: '1fr', // On medium screens and up, 1 row for side-by-side layout
    });

    return (
        <Flex maxWidth={'1280px'} width={'100%'} flexDirection={'column'}>
            <Grid
                templateColumns={gridTemplateColumns}
                templateRows={gridTemplateRows}
                gap={4}
            >
                {/* Main Square Image on the top (mobile) or left (desktop) */}
                <GridItem>
                    <Box
                        minWidth={'300px'}
                        width={'100%'}
                        aspectRatio="1 / 1"
                        overflow="hidden"
                        onClick={() => openGallery(0)}
                        cursor="pointer"
                        borderRadius={{ base: '16px', md: '16px 0 0 16px' }}
                        backgroundColor={
                            objectFit === 'cover' ? 'black' : 'white'
                        }
                    >
                        {images.length > 0 && (
                            <Image
                                src={images[0]}
                                alt="Main Image"
                                width="100%"
                                height="100%"
                                objectFit={'fill'}
                            />
                        )}
                    </Box>
                </GridItem>

                {/* 4 Square Images below (mobile) or to the right (desktop) */}
                <GridItem>
                    <Grid
                        templateColumns={{
                            base: 'repeat(4, 1fr)', // 4 columns on mobile
                            md: 'repeat(2, 1fr)', // 2 columns on desktop
                        }}
                        templateRows={{
                            base: 'repeat(1, 1fr)', // 1 row on mobile
                            md: 'repeat(2, 1fr)', // 2 rows on desktop
                        }}
                        gap={4}
                    >
                        {images.slice(1, 5).map((image, index) => (
                            <GridItem key={index}>
                                <Box
                                    minWidth={'50px'}
                                    width={'100%'}
                                    aspectRatio="1 / 1"
                                    overflow="hidden"
                                    borderRadius={{
                                        base: '16px',
                                        md: 'none',
                                    }}
                                    borderTopRightRadius={{
                                        md: index === 1 ? '16px' : 'none',
                                    }}
                                    borderBottomRightRadius={{
                                        md: index === 3 ? '16px' : 'none',
                                    }}
                                    onClick={() => openGallery(index + 1)}
                                    cursor="pointer"
                                    backgroundColor="white"
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        width="100%"
                                        height="100%"
                                        objectFit={'fill'}
                                    />
                                </Box>
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
                    selectedImageIndex={selectedImageIndex} // Pass the selected image index
                />
            )}
        </Flex>
    );
};

export default PreviewGallery;
