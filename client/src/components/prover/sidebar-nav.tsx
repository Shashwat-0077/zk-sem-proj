'use client';

import { Home, UploadCloud, FileSignature, Eye } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

import { SidebarLogo } from './sidebar-logo';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/prover',
            icon: <Home className="text-primary" />,
        },
        {
            title: 'Upload Credentials',
            url: '/prover/upload',
            icon: <UploadCloud className="text-primary" />,
        },
        {
            title: 'Generate Proof',
            url: '/prover/proofs/generate',
            icon: <FileSignature className="text-primary" />,
        },
        {
            title: 'View Proof',
            url: '/prover/proofs/example-proof',
            icon: <Eye className="text-primary" />,
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
