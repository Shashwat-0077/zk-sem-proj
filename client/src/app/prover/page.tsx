import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileCheck } from 'lucide-react';

export default function ProverDashboardPage() {
    const stats = [
        { label: 'Credentials Uploaded', value: 8 },
        { label: 'Proofs Generated', value: 17 },
        { label: 'Validations Passed', value: 16 },
    ];

    const recent = [
        { id: 'proof-8f9a', cred: 'Employment Credential', status: 'Valid', createdAt: '2025-10-08' },
        { id: 'proof-2d41', cred: 'KYC Credential', status: 'Valid', createdAt: '2025-10-07' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((s) => (
                    <Card key={s.label}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">{s.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{s.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Latest Proofs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Credential</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recent.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                                    <TableCell>{r.cred}</TableCell>
                                    <TableCell>{r.status}</TableCell>
                                    <TableCell>{r.createdAt}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/prover/proofs/${r.id}`}
                                                aria-label={`View proof ${r.id}`}
                                            >
                                                <FileCheck className="mr-2 size-4" /> View
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
