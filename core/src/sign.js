import { blsSign } from '@mattrglobal/bbs-signatures';
import { TextEncoder } from 'util';

export const signMessages = async (keyPair, messages) => {
    const encoder = new TextEncoder();
    const messagesAsBytes = messages.map((msg) => encoder.encode(msg));
    console.log(`Signing ${messages.length} message(s)...`);
    console.log('Original messages:', messages);
    console.log(
        'Encoded messages (hex):',
        messagesAsBytes.map((b) => Buffer.from(b).toString('hex')),
    );
    if (keyPair && keyPair.publicKey) {
        try {
            console.log('Public key (hex):', Buffer.from(keyPair.publicKey).toString('hex'));
        } catch {
            console.log('Public key (raw):', keyPair.publicKey);
        }
    }
    const signature = await blsSign({
        keyPair,
        messages: messagesAsBytes,
    });

    return signature;
};
