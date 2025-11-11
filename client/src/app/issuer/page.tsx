import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
    { label: 'Total Issued', value: 1280 },
    { label: 'Pending', value: 12 },
    { label: 'Revoked', value: 4 },
    { label: 'Verifications (24h)', value: 356 },
];

const recent = [
    { id: 'cred-20251001-0001', subject: 'did:example:alice', type: 'KYC', status: 'Issued' },
    { id: 'cred-20251001-0002', subject: 'did:example:bob', type: 'Proof-of-Age', status: 'Pending' },
    { id: 'cred-20251001-0003', subject: 'did:example:carol', type: 'Accredited', status: 'Issued' },
];

export default function IssuerDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Overview of your credentials and activity.</p>
                </div>
                <Link href="/issuer/issue">
                    <Button>Issue Credential</Button>
                </Link>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{s.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent table */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Credentials</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-muted-foreground">
                                <tr className="border-b">
                                    <th className="py-2 text-left">Credential ID</th>
                                    <th className="py-2 text-left">Subject</th>
                                    <th className="py-2 text-left">Type</th>
                                    <th className="py-2 text-left">Status</th>
                                    <th className="py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="border-b last:border-none"
                                    >
                                        <td className="py-2 font-mono">{r.id}</td>
                                        <td className="py-2">{r.subject}</td>
                                        <td className="py-2">{r.type}</td>
                                        <td className="py-2">
                                            <span className="rounded-xs bg-muted px-2 py-0.5 text-xs">{r.status}</span>
                                        </td>
                                        <td className="py-2">
                                            <Link href={`/issuer/credentials/${encodeURIComponent(r.id)}`}>
                                                <Button
                                                    variant="outline"
                                                    className="h-8 bg-transparent"
                                                >
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
