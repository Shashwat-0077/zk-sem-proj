import { generateBls12381G2KeyPair } from '@mattrglobal/bbs-signatures';

export const generateBbsKeyPair = async () => {
    const keyPair = await generateBls12381G2KeyPair();

    const { publicKey, secretKey } = keyPair;

    return { publicKey, secretKey };
};
