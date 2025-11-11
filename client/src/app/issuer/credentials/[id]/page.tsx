import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function CredentialDetailsPage({ params }: { params: { id: string } }) {
    const id = decodeURIComponent(params.id);
    // In a real app, fetch credential details server-side here.
    const mock = {
        id,
        subject: 'did:example:alice',
        type: 'KYC',
        issuedAt: '2025-10-01T10:30:00Z',
        status: 'Issued',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Credential</h1>
                    <p className="text-sm text-muted-foreground">Details for {mock.id}</p>
                </div>
                <Link href="/issuer">
                    <Button variant="outline">Back to dashboard</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                    <div className="font-mono">ID: {mock.id}</div>
                    <div>Subject: {mock.subject}</div>
                    <div>Type: {mock.type}</div>
                    <div>Issued at: {mock.issuedAt}</div>
                    <div>
                        Status: <span className="rounded-xs bg-muted px-2 py-0.5 text-xs">{mock.status}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button variant="outline">Download Proof</Button>
                    <Button variant="destructive">Revoke</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
