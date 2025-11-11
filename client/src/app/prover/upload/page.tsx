'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ProverUploadPage() {
    const [json, setJson] = useState('');

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        let parseJson;
        try {
            parseJson = await JSON.parse(json);
            const url = `${process.env.NEXT_PUBLIC_SERVER_ADDRESS!}/prover/upload`;
            console.log(url);
            const response = await fetch(url, {
                body: JSON.stringify(parseJson),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
            console.log(await response.json());
        } catch {
            console.log('Parsing Failed');

            return;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="meta">JSON</Label>
                    <Textarea
                        className="min-h-[200px]"
                        id="meta"
                        placeholder="{...}"
                        value={json}
                        onChange={(e) => setJson(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="button"
                        onClick={onSubmit}
                    >
                        Upload
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
