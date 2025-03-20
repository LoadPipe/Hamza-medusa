import ShopTemplate from '@/modules/shop';
import { Box } from '@chakra-ui/react';
import { redirect } from 'next/navigation';

type Params = {
    params: {
        countryCode: string;
        handle: string;
    };
};

export default function CategoryShopPage({ params }: Params) {
    const { handle, countryCode } = params;

    const decodedHandle = decodeURIComponent(handle);
    const normalizedHandle = decodedHandle.trim().replace(/[\s_]+/g, '-').toLowerCase();

    if (handle !== normalizedHandle) {
        redirect(`/${countryCode}/category/${normalizedHandle}`);
    }

    return (
        <Box
            style={{
                background: 'linear-gradient(to bottom, #020202 20vh, #2C272D 70vh)',
            }}
        >
            <ShopTemplate category={handle} />
        </Box>
    );
}
