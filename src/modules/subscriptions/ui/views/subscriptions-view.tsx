import { SubscriptionsSection } from '../sections/subscriptions-section';

export const SubscriptionsView = () => {
    return (
        <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
            <div className="">
                <h1 className="text-2xl font-bold">All subscriptions</h1>
                <p className="text-muted-foreground text-xs">
                    View and manage all your subscriptions
                </p>
            </div>
            <SubscriptionsSection />
        </div>
    );
};
