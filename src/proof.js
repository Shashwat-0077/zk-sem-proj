// src/proof.js

import { blsCreateProof, blsVerifyProof } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

export const createProof = async ({ publicKey, signature, messages, revealedIndices, nonce }) => {
    console.log('Creating a selective disclosure proof...');

    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));

    // The blsCreateProof function generates the proof.
    const proof = await blsCreateProof({
        signature,
        publicKey,
        messages: messagesAsBytes,
        nonce,
        revealed: revealedIndices,
    });

    console.log('Proof created successfully.');
    return proof;
};

export const verifyProof = async ({ proof, publicKey, messages, nonce }) => {
    console.log('Verifying the selective disclosure proof...');

    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));

    const result = await blsVerifyProof({
        proof,
        publicKey,
        messages: messagesAsBytes,
        nonce,
    });

    console.log('Proof verification complete.');
    return result;
};
