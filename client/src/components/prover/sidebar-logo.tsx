'use client';

import * as React from 'react';
// import Image from 'next/image';
import { FaUser } from 'react-icons/fa';

import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function SidebarLogo() {
    const { open } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem
                className={cn('grid place-content-center transition-all duration-300', open ? 'my-7' : 'mb-5 mt-1')}
            >
                {/* <Image
                    width={70}
                    height={70}
                    src={'/logo.svg'}
                    alt="logo"
                    priority
                /> */}
                <FaUser
                    className={cn(
                        'h-full w-full bg-green-100/10 rounded-full p-2 transition-all duration-300',
                        open ? 'size-24' : '',
                    )}
                />
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
