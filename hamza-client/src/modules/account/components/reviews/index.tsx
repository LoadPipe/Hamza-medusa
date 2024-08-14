import { Customer, Region } from '@medusajs/medusa';
import React from 'react';
import ReviewPage from '../review-page';
import { Box } from '@chakra-ui/react';
type ReviewProps = {
    customer: Omit<Customer, 'password_hash'>;
    region: Region;
};

const Review: React.FC<ReviewProps> = ({ customer, region }) => {
    return (
        <Box>
            <Box>
                <ReviewPage region={region} />
            </Box>
        </Box>
    );
};

export default Review;
