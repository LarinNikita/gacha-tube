import Link from 'next/link';
import Image from 'next/image';

import { SearchInput } from './search-input';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { AuthButton } from '@/modules/auth/ui/components/aut-button';

export const HomeNavbar = () => {
    return (
        <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center bg-white px-2 pr-5">
            <div className="flex w-full items-center gap-4">
                {/* Menu and Logo */}
                <div className="flex flex-shrink-0 items-center">
                    <SidebarTrigger />
                    <Link href="/">
                        <div className="flex items-center gap-1 p-4">
                            <Image
                                src="/logo.svg"
                                alt="logo"
                                width={40}
                                height={40}
                            />
                            <p className="text-xl font-semibold tracking-tighter">
                                GachaTube
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Search bar */}
                <div className="mx-auto flex max-w-[720px] flex-1 justify-center">
                    <SearchInput />
                </div>

                {/* Auth button */}
                <div className="flex flex-shrink-0 items-center gap-4">
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
};
