'use client';

import { ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { authClient } from '@/modules/auth/client';

export function NavUser() {
    const router = useRouter();
    const { isMobile } = useSidebar();
    // const { data: session, isPending, error } = authClient.useSession();

    // if (isPending || !session) {
    //     return (
    //         <SidebarMenu>
    //             <SidebarMenuItem>
    //                 <Skeleton className="mb-2 h-8 w-full rounded-lg bg-sidebar-accent" />
    //             </SidebarMenuItem>
    //         </SidebarMenu>
    //     );
    // }

    // if (error) {
    //     router.push('/');
    //     return null;
    // }

    // const { name, email, image: profileImage } = session.user;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    {/* <DropdownMenuTrigger asChild> */}
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <Avatar className="h-8 w-8 rounded-lg">
                            {/* <AvatarImage
                                    src={profileImage ?? undefined}
                                    alt={name ?? undefined}
                                /> */}
                            <AvatarFallback className="rounded-lg">
                                {/* {name && name.charAt(0).toUpperCase()} */}S
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{/*name*/} Some one</span>
                            <span className="truncate text-xs">{/*email*/} some.one@example.com</span>
                        </div>
                        <ChevronRight className="ml-auto size-4" />
                    </SidebarMenuButton>
                    {/* </DropdownMenuTrigger> */}
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        {/* <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={profileImage ?? undefined}
                                        alt={name ?? undefined}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {name && name.charAt(0).toUpperCase()}
                                        someone
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{name}</span>
                                    <span className="truncate text-xs">{email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator /> */}
                        {/* <DropdownMenuItem
                            onClick={() => {
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push('/'); // redirect to login page
                                        },
                                    },
                                });
                            }}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
