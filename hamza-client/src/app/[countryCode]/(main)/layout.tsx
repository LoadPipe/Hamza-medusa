import { Metadata } from 'next';
import Footer from '@modules/layout/templates/footer';
import Nav from '@modules/layout/templates/nav';
import { Box } from '@chakra-ui/react';

const MEDUSA_CLIENT_URL =
    process.env.NEXT_PUBLIC_MEDUSA_CLIENT_URL || 'https://localhost:8000';

export const metadata: Metadata = {
    metadataBase: new URL(MEDUSA_CLIENT_URL),
};

export default async function PageLayout(props: { children: React.ReactNode }) {
    return (
        <div
            style={{
                background:
                    'linear-gradient(to bottom, #020202 20vh, #2C272D 40vh)',
            }}
        >
            <Nav />
            {props.children}
            <Footer />
        </div>
    );
}
