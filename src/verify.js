import { blsVerify } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

export const verifySignature = async (publicKey, signature, messages) => {
    console.log('Verifying signature...');

    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));

    const result = await blsVerify({
        publicKey,
        signature,
        messages: messagesAsBytes,
    });

    console.log('Verification check complete.');

    return result;
};
