import { generateBls12381G2KeyPair } from '@mattrglobal/bbs-signatures';

export const generateBbsKeyPair = async () => {
    console.log('Generating a new BBS+ key pair...');

    const keyPair = await generateBls12381G2KeyPair();

    const { publicKey, secretKey } = keyPair;

    console.log('Key pair generated successfully!');

    return { publicKey, secretKey };
};
