'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export default function IssueCredentialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [json, setJson] = useState('');

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        let parseJson;
        try {
            parseJson = await JSON.parse(json);
            const url = `${process.env.NEXT_PUBLIC_SERVER_ADDRESS!}/issuer/issue`;
            console.log(url);
            const response = await fetch(url, {
                body: JSON.stringify(parseJson),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
            console.log({ response: await response.json() });
        } catch {
            console.log('Parsing Failed');
            setLoading(false);

            return;
        }

        // router.push('/issuer'); // back to dashboard after mock issue
        setLoading(false);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid gap-6"
        >
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Issue Credential</h1>
                <p className="text-sm text-muted-foreground">Fill in the details to issue a verifiable credential.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Recipient & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2 ">
                        <Label htmlFor="claims">Claims (JSON)</Label>
                        <Textarea
                            id="claims"
                            name="claims"
                            placeholder='{"name":"Alice","age":21}'
                            rows={5}
                            className={'min-h-[200px]'}
                            onChange={(e) => {
                                setJson(e.target.value);
                            }}
                        />
                    </div>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Issuing...' : 'Issue Credential'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => history.back()}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
