// SkeletonProductGrid.js
import { Box, SimpleGrid, Container } from '@chakra-ui/react';

const SkeletonProductGrid = () => {
    return (
        <Container maxW="1280px" py="8" backgroundColor={'transparent'}>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                spacing="1.25rem"
                rowGap="2.5rem"
                placeItems="center"
            >
                {[...Array(8)].map((_, index) => (
                    <Box
                        key={index}
                        width="100%"
                        height="300px"
                        bg="gray.200"
                        borderRadius="md"
                    />
                ))}
            </SimpleGrid>
        </Container>
    );
};

export default SkeletonProductGrid;
