'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ProverViewProofPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // Mocked details for now
    const details = {
        id,
        credential: 'KYC Credential',
        status: 'Valid',
        createdAt: '2025-10-08T12:00:00Z',
        publicSignals: ['signal_1', 'signal_2'],
        proof: '0xabc123...def',
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Proof: {id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2 md:grid-cols-2">
                    <div>
                        <div className="text-xs text-muted-foreground">Credential</div>
                        <div>{details.credential}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div>{details.status}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Created</div>
                        <div>{new Date(details.createdAt).toLocaleString()}</div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <div className="text-sm font-medium">Public Signals</div>
                    <ul className="list-disc pl-6 text-sm">
                        {details.publicSignals.map((s) => (
                            <li
                                key={s}
                                className="font-mono"
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium">Proof</div>
                    <pre className="font-mono whitespace-pre-wrap break-all rounded-md border p-3 text-xs">
                        {details.proof}
                    </pre>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                navigator.clipboard.writeText(details.proof);
                            }}
                        >
                            Copy proof
                        </Button>
                        <Button asChild>
                            <a href="/prover">Back to dashboard</a>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
