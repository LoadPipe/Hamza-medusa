import { Suspense } from 'react';
import ClientErrorSimulator from './client-error-simulator';

export default function ErrorPage() {
    return (
        <div>
            <h1>This is a Server Component</h1>
            <Suspense fallback={<h2>Loading client-side error...</h2>}>
                {/* Pass the client component as a child */}
                <ClientErrorSimulator />
            </Suspense>
        </div>
    );
}
