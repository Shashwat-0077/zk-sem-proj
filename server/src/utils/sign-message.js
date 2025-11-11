import { blsSign } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

export const signMessages = async (keyPair, messages) => {
    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));

    const signature = await blsSign({
        keyPair,
        messages: messagesAsBytes,
    });

    return signature;
};
