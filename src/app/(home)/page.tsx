import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { PageClient } from './client';

import { HydrateClient } from '@/trpc/server';

export default async function Home() {
    return (
        <HydrateClient>
            <Suspense fallback={<p>Loading...</p>}>
                <ErrorBoundary fallback={<p>Error...</p>}>
                    <PageClient />
                </ErrorBoundary>
            </Suspense>
        </HydrateClient>
    );
}
