'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function ProverGenerateProofPage() {
    const [proofHash, setProofHash] = useState<string | null>(null);

    const handleGenerate = () => {
        // Mock: generate a deterministic-ish short hash
        const now = Date.now().toString(36);
        setProofHash(`zkp_${now}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generate Proof</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label>Credential</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a credential" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="employment">Employment Credential</SelectItem>
                            <SelectItem value="kyc">KYC Credential</SelectItem>
                            <SelectItem value="age">Age Credential</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="statement">Statement</Label>
                    <Textarea
                        id="statement"
                        placeholder="e.g., Prove age >= 18 without revealing birthdate"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="salt">Salt (optional)</Label>
                    <Input
                        id="salt"
                        placeholder="Random entropy to avoid linkage"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => setProofHash(null)}
                    >
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={handleGenerate}
                    >
                        Generate Proof
                    </Button>
                </div>

                {proofHash && (
                    <div className="rounded-md border p-3 text-sm">
                        <div className="mb-1 font-medium">Proof created</div>
                        <div className="font-mono break-all">{proofHash}</div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
