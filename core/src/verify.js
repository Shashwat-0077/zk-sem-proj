import { blsVerify } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

export const verifySignature = async (publicKey, signature, messages) => {
    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));
    console.log('Preparing to verify signature...');
    console.log('Public key length:', publicKey?.length ?? 'unknown');
    console.log('Signature length:', signature?.length ?? 'unknown');
    console.log('Messages count:', messagesAsBytes.length);
    messagesAsBytes.forEach((m, i) => {
        const hexPreview = Buffer.from(m).toString('hex').slice(0, 64);
        console.log(
            `Message ${i}: "${messages[i]}", bytes: ${m.length}, hex_preview: ${hexPreview}${
                m.length > 32 ? '...' : ''
            }`,
        );
    });
    const result = await blsVerify({
        publicKey,
        signature,
        messages: messagesAsBytes,
    });

    return result;
};
