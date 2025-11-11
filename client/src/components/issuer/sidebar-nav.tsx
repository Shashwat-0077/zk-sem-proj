'use client';

import { Settings2, LayoutDashboard } from 'lucide-react';
import { VscIssueDraft } from 'react-icons/vsc';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

import { SidebarLogo } from './sidebar-logo';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/issuer',
            icon: <LayoutDashboard className="text-primary" />,
        },
        {
            title: 'Issue Credential',
            url: '/issuer/issue',
            icon: <VscIssueDraft className="text-primary" />,
        },
        {
            title: 'Settings',
            url: '/issuer/settings',
            icon: <Settings2 className="text-primary" />,
        },
    ],
};

export function SidebarNav({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible="icon"
            {...props}
            className="!border-0 shadow-sm"
        >
            <SidebarHeader>
                <SidebarLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
