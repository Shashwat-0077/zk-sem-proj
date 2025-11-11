'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        aria-label="Home"
                    >
                        <img
                            src="/placeholder-logo.svg"
                            alt="Platform logo"
                            className="h-6 w-6"
                        />
                        <span className="hidden text-sm font-semibold md:inline">ZK Platform</span>
                    </Link>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <Link
                        href="/login"
                        aria-label="Login"
                    >
                        <Button variant="outline">Login</Button>
                    </Link>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Open menu"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-foreground"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 6h16M4 12h16M4 18h16"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-72"
                        >
                            <div className="mt-8 flex flex-col gap-4">
                                <div className="mt-2 flex gap-2">
                                    <Link
                                        href="/login"
                                        className="flex-1"
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full bg-transparent"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
