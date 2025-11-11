'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { default as Navbar } from '@/components/navbar';

function Hero() {
    return (
        <>
            <Navbar />
            <section className="container mx-auto grid gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
                <div className="flex flex-col gap-6">
                    <h1 className="text-pretty text-4xl font-semibold leading-tight md:text-5xl">
                        Mathematical verification for documents between Issuers, Provers, and Verifiers
                    </h1>
                    <p className="text-muted-foreground md:text-lg">
                        Issue once, prove anywhere. Verifiers confirm document authenticity without contacting the
                        issuer using zero-knowledge proofs—privacy preserved end-to-end.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button className="bg-primary text-primary-foreground hover:opacity-90">Get Started</Button>
                    </div>
                </div>

                {/* Right: minimal 3-party diagram */}
                <div className="grid place-content-center">
                    <div className="w-full max-w-md">
                        <div className="grid grid-cols-3 items-center gap-2">
                            {/* Issuer */}
                            <Card className="col-span-1">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Issuer</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Issues signed credential
                                </CardContent>
                            </Card>

                            {/* Arrows / proof capsule */}
                            <div className="col-span-1 grid gap-2">
                                <div className="grid h-full place-items-center">
                                    <div
                                        className="h-0.5 w-16 bg-border"
                                        aria-hidden
                                    />
                                </div>
                                <div className="grid place-items-center">
                                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                                        ZK Proof
                                    </span>
                                </div>
                                <div className="grid h-full place-items-center">
                                    <div
                                        className="h-0.5 w-16 bg-border"
                                        aria-hidden
                                    />
                                </div>
                            </div>

                            {/* Prover */}
                            <Card className="col-span-1">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Prover</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Generates proof without revealing data
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-4 grid grid-cols-3 items-center gap-2">
                            <div className="col-span-3 grid place-items-center">
                                <div
                                    className="h-8 w-0.5 bg-border"
                                    aria-hidden
                                />
                            </div>
                            <div className="col-span-3 grid place-items-center">
                                <Card className="w-full max-w-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">Verifier</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Verifies math, never contacts Issuer
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function HowItWorks() {
    const steps = [
        {
            k: '01',
            t: 'Issue',
            d: 'Issuer signs a document/claim and anchors a commitment on-chain or your registry.',
        },
        {
            k: '02',
            t: 'Prove',
            d: 'Prover derives a zero‑knowledge proof that the claim is valid without revealing raw data.',
        },
        {
            k: '03',
            t: 'Verify',
            d: 'Verifier checks the proof instantly—no network calls to Issuer, no PII exposure.',
        },
    ];

    return (
        <section className="container mx-auto px-4 py-12 md:py-16 ">
            <h2 className="mb-6 text-pretty text-2xl font-semibold md:text-3xl">How it works</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {steps.map((s) => (
                    <Card key={s.k}>
                        <CardHeader className="pb-1">
                            <div className="text-sm font-mono text-muted-foreground">{s.k}</div>
                            <CardTitle className="text-lg">{s.t}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">{s.d}</CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function Roles() {
    const roles = [
        {
            t: 'Issuers',
            d: 'Publish attestations and schemas. Rotate keys safely and deprecate credentials seamlessly.',
        },
        {
            t: 'Provers',
            d: 'Hold credentials locally. Create selective‑disclosure proofs from mobile or server.',
        },
        {
            t: 'Verifiers',
            d: 'Validate proofs deterministically in the browser or backend—no third‑party calls.',
        },
    ];
    return (
        <section className="container mx-auto px-4 py-12 md:py-16">
            <h2 className="mb-6 text-pretty text-2xl font-semibold md:text-3xl">Built for every role</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {roles.map((r) => (
                    <Card key={r.t}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{r.t}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">{r.d}</CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function StatsStrip() {
    const stats = [
        { v: '0 calls', l: 'to issuer' },
        { v: 'ms-level', l: 'verification' },
        { v: '100%', l: 'PII retained by user' },
        { v: 'GDPR/CCPA', l: 'friendly by design' },
    ];
    return (
        <section className="border-y bg-card">
            <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
                {stats.map((s) => (
                    <div key={s.v}>
                        <div className="text-xl font-semibold text-center">{s.v}</div>
                        <div className="text-sm text-muted-foreground text-center">{s.l}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function CTA() {
    return (
        <section className="container mx-auto px-4 py-14 md:py-20">
            <div className="rounded-xl border bg-primary px-6 py-10 text-primary-foreground md:px-10">
                <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
                    <div>
                        <h3 className="text-pretty text-2xl font-semibold md:text-3xl">
                            Ready to verify without calling the issuer?
                        </h3>
                        <p className="mt-1 text-sm opacity-90">
                            Get a live demo of issuer onboarding, proof generation, and instant verification.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        className="justify-self-start md:justify-self-end"
                    >
                        Get Started
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default function Page() {
    return (
        <main className="flex flex-col">
            <Hero />
            <StatsStrip />
            <HowItWorks />
            <Roles />
            <CTA />
        </main>
    );
}
