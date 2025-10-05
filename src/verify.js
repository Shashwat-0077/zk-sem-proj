// src/verify.js

import { blsVerify } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

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
