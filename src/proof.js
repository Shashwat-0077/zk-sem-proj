// src/proof.js

import { blsCreateProof, blsVerifyProof } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

/**
 * Creates a BBS+ proof of knowledge, selectively disclosing messages from an original signature.
 *
 * @param {object} params - The parameters for creating the proof.
 * @param {Uint8Array} params.publicKey - The public key of the original signer.
 * @param {Uint8Array} params.signature - The original signature.
 * @param {string[]} params.messages - The full, original array of messages.
 * @param {number[]} params.revealedIndices - An array of indices for the messages to reveal.
 * @param {Uint8Array} params.nonce - A unique value for this proof generation, to prevent replay attacks.
 * @returns {Promise<Uint8Array>} A promise that resolves to the generated proof.
 */
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

/**
 * Verifies a BBS+ proof of knowledge.
 *
 * @param {object} params - The parameters for verifying the proof.
 * @param {Uint8Array} params.proof - The proof to verify.
 * @param {Uint8Array} params.publicKey - The public key of the original signer.
 * @param {string[]} params.messages - The array of messages that were revealed.
 * @param {Uint8Array} params.nonce - The same nonce used to create the proof.
 * @returns {Promise<object>} A promise that resolves to an object like { verified: boolean; error?: Error }.
 */
export const verifyProof = async ({ proof, publicKey, messages, nonce }) => {
    console.log('Verifying the selective disclosure proof...');

    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));

    // The blsVerifyProof function verifies the proof.
    const result = await blsVerifyProof({
        proof,
        publicKey,
        messages: messagesAsBytes,
        nonce,
    });

    console.log('Proof verification complete.');
    return result;
};
