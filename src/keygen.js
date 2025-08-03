// src/keygen.js

// Import the specific key generation function directly from the library.
// The library exports named functions for its core operations, which is a more direct approach.
import { generateBls12381G2KeyPair } from '@mattrglobal/bbs-signatures';

/**
 * Generates a new BBS+ key pair (public and private keys) using the BLS12-381 curve.
 *
 * @returns {Promise<object>} A promise that resolves to an object containing the publicKey and secretKey.
 * Both keys are in Uint8Array format.
 */
export const generateBbsKeyPair = async () => {
    console.log('Generating a new BBS+ key pair...');

    // Directly call the key generation function from the library.
    // This is the correct method for getting a raw key pair.
    const keyPair = await generateBls12381G2KeyPair();

    const { publicKey, secretKey } = keyPair;

    console.log('Key pair generated successfully!');

    // The function returns an object with publicKey and secretKey properties.
    return { publicKey, secretKey };
};
