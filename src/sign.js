// src/sign.js

import { blsSign } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

export const signMessages = async (keyPair, messages) => {
    console.log('Signing messages...');

    // The library expects messages to be Uint8Arrays.
    // We'll use a TextEncoder to convert our string messages into the required format.
    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));

    // The blsSign function from the library performs the signing operation.
    const signature = await blsSign({
        keyPair,
        messages: messagesAsBytes,
    });

    console.log('Messages signed successfully!');

    return signature;
};
