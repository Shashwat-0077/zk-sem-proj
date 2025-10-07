import { blsCreateProof, blsVerifyProof } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

export const createProof = async ({ publicKey, signature, messages, revealedIndices, nonce }) => {
    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));

    const proof = await blsCreateProof({
        signature,
        publicKey,
        messages: messagesAsBytes,
        nonce,
        revealed: revealedIndices,
    });

    return proof;
};

export const verifyProof = async ({ proof, publicKey, messages, nonce }) => {
    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));

    const result = await blsVerifyProof({
        proof,
        publicKey,
        messages: messagesAsBytes,
        nonce,
    });

    return result;
};
