'use client';

import { trpc } from '@/trpc/client';

export const PageClient = () => {
    const [data] = trpc.hello.useSuspenseQuery({
        text: '(╯°□°）╯︵ ┻━┻',
    });

    return (
        <div>
            <h1>Client component: {data.greeting}</h1>
        </div>
    );
};
