// src/verify.js

import { blsVerify } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

/**
 * Verifies a BBS+ signature for a set of messages.
 *
 * @param {Uint8Array} publicKey - The public key of the signer.
 * @param {Uint8Array} signature - The signature to verify.
 * @param {string[]} messages - The array of original messages.
 * @returns {Promise<object>} A promise that resolves to an object like { verified: boolean; error?: Error }.
 */
export const verifySignature = async (publicKey, signature, messages) => {
    console.log('Verifying signature...');

    // As before, the library expects messages to be Uint8Arrays.
    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));

    // The blsVerify function performs the verification.
    // It returns an object indicating the validity of the signature and any potential errors.
    const result = await blsVerify({
        publicKey,
        signature,
        messages: messagesAsBytes,
    });

    console.log('Verification check complete.');

    return result;
};
