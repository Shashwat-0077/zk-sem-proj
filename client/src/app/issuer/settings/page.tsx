'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MOCK_PUBLIC = '0x04ac2a7b1f8e0a2f1d0c4a2b9e8e5a7c3d2f1b0a9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0';
const MOCK_PRIVATE = '0x9f1c2d3e4f5a6b7c8d9e0fab1c2d3e4f5a6b7c8d9e0fab1c2d3e4f5a6b7c8d9e';

export default function IssuerSettingsPage() {
    const [reveal, setReveal] = useState(false);

    function copy(text: string) {
        navigator.clipboard?.writeText(text);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your issuer keys.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Keys</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="public">Public Key</Label>
                        <div className="flex gap-2">
                            <Input
                                id="public"
                                readOnly
                                value={MOCK_PUBLIC}
                                className="font-mono"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => copy(MOCK_PUBLIC)}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="private">Private Key</Label>
                        <div className="flex gap-2">
                            <Input
                                id="private"
                                readOnly
                                value={reveal ? MOCK_PRIVATE : '••••••••••••••••••••••••••••••••••••••••'}
                                className="font-mono"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setReveal(!reveal)}
                            >
                                {reveal ? 'Hide' : 'Reveal'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => copy(MOCK_PRIVATE)}
                            >
                                Copy
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Never share your private key. For demo purposes only.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
