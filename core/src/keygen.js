import { generateBls12381G2KeyPair } from '@mattrglobal/bbs-signatures';

export const generateBbsKeyPair = async () => {
    const keyPair = await generateBls12381G2KeyPair();
    console.log('Generating BBS+ key pair...');
    console.time('generateBbsKeyPair');
    console.timeEnd('generateBbsKeyPair');

    // helper to convert Uint8Array to base64 (Node)
    const toBase64 = (arr) => Buffer.from(arr).toString('base64');

    console.log('Public Key (base64):', toBase64(keyPair.publicKey));
    console.log('Secret Key (base64) — keep this secret:', toBase64(keyPair.secretKey));
    const { publicKey, secretKey } = keyPair;

    return { publicKey, secretKey };
};
