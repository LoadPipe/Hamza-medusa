import { Metadata } from 'next';
import Footer from '@/modules/nav/templates/footer';
import Nav from '@/modules/nav/templates/nav';
import HeroBanner from '@/modules/home/components/hero-banner';
import Faq from '@/modules/nav/templates/faq';
import TwitterFeed from '@/modules/twitter/templates/twitter-feed';

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
            <HeroBanner />
            <Nav />
            {props.children}
            <TwitterFeed />
            <Faq />
            <Footer />
        </div>
    );
}
