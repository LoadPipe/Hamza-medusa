import {
    Box,
    Flex,
    Grid,
    GridItem,
    Image,
    useBreakpointValue,
} from '@chakra-ui/react';
import { getObjectFit } from '@modules/get-object-fit';
import useProductPreview from '@store/product-preview/product-preview';
import React, { useEffect, useState } from 'react';

const PreviewGallery = () => {
    const { productData } = useProductPreview();
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (productData !== null) {
            setImages(productData?.images || []);
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

    //TODO: If each product needs 5 images how will we handle blank images?
    return (
        <Flex maxWidth={'1280px'} width={'100%'} flexDirection={'column'}>
            <Grid templateColumns={gridTemplate} gap={4}>
                <GridItem display={'flex'}>
                    <Flex
                        backgroundColor={'white'}
                        width={'100%'}
                        minH={'312.22px'}
                        maxH={'504.11px'}
                        maxW={'736.04px'}
                        overflow="hidden"
                        borderLeftRadius={'16px'}
                        borderRightRadius={{ base: '16px', md: 'none' }}
                    >
                        {images.length > 0 && (
                            <Image
                                src={(images[0] as any).url}
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
                        <GridItem>
                            <Flex
                                backgroundColor={'white'}
                                width={{ base: '100%', md: '257.4px' }}
                                minW="80px"
                                minH={'80px'}
                                maxH={'245.18px'}
                                borderRadius={{ base: '16px', md: 'none' }}
                                overflow={'hidden'}
                            >
                                {images.length > 0 && (
                                    <Image
                                        // src="path/to/your/image2.jpg"
                                        src={images.length > 1 ? (images[1] as any).url : (images[0] as any).url}
                                        alt="Top Left Image"
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                    />
                                )}
                            </Flex>
                        </GridItem>
                        <GridItem>
                            <Flex
                                borderRadius={{
                                    base: '16px',
                                    md: '0px 16px 0px 0px',
                                }}
                                backgroundColor={'white'}
                                width={{ base: '100%', md: '257.4px' }}
                                minW="80px"
                                minH={'80px'}
                                maxH={'245.18px'}
                                overflow={'hidden'}
                            >
                                {images.length > 0 && (
                                    <Image
                                        // src="path/to/your/image2.jpg"
                                        src={images.length > 2 ? (images[2] as any).url : (images[0] as any).url}
                                        alt="Top Right Image"
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                    />
                                )}
                            </Flex>
                        </GridItem>
                        <GridItem>
                            <Flex
                                backgroundColor={'white'}
                                width={{ base: '100%', md: '257.4px' }}
                                minW="80px"
                                minH={'80px'}
                                maxH={'245.18px'}
                                borderRadius={{ base: '16px', md: 'none' }}
                                overflow={'hidden'}
                            >
                                {images.length > 0 && (
                                    <Image
                                        // src="path/to/your/image2.jpg"
                                        src={images.length > 3 ? (images[3] as any).url : (images[0] as any).url}
                                        alt="Bottom Left Image"
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                    />
                                )}
                            </Flex>
                        </GridItem>
                        <GridItem>
                            <Flex
                                borderRadius={{
                                    base: '16px',
                                    md: '0px 0px 16px 0px',
                                }}
                                backgroundColor={'white'}
                                width={{ base: '100%', md: '257.4px' }}
                                minW="80px"
                                minH={'80px'}
                                maxH={'245.18px'}
                                overflow={'hidden'}
                            >
                                {images.length > 0 && (
                                    <Image
                                        // src="path/to/your/image2.jpg"
                                        src={images.length > 4 ? (images[4] as any).url : (images[0] as any).url}
                                        alt="Bottom Right Image"
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                    />
                                )}
                            </Flex>
                        </GridItem>
                    </Grid>
                </GridItem>
            </Grid>
        </Flex>
    );
};

export default PreviewGallery;
