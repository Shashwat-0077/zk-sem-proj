import { generateBbsKeyPair } from './src/keygen.js';
import { signMessages } from './src/sign.js';
import { verifySignature } from './src/verify.js';
import { createProof, verifyProof } from './src/proof.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Helper functions
const toHex = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
const fromHex = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const main = async () => {
    // --- Steps 1 & 2: Key Gen and Signing ---
    console.log('--- BBS+ Implementation: Key Generation & Signing ---');
    const keyPair = await generateBbsKeyPair();
    const dataPath = path.resolve('data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const messages = Object.entries(data).map(([key, value]) => `${key}: ${value}`);
    const signature = await signMessages(keyPair, messages);
    fs.writeFileSync('signature.hex', toHex(signature));
    console.log('--- End of Key Generation & Signing ---\n');

    // --- Step 3: Full Verification (Optional, for completeness) ---
    console.log('--- BBS+ Implementation: Full Verification ---');
    const fullVerificationResult = await verifySignature(keyPair.publicKey, signature, messages);
    console.log('Is the original signature valid?', fullVerificationResult.verified);
    console.log('--- End of Full Verification ---\n');

    // --- Step 4: Create and Verify a Selective Disclosure Proof ---
    console.log('--- BBS+ Implementation: Selective Disclosure Proof ---');
    // We want to reveal FirstName (index 0) and Nationality (index 3)
    const revealedIndices = [0, 2];
    const revealedMessages = messages.filter((_, i) => revealedIndices.includes(i));
    revealedMessages[0] = 'FirstName: Alice';
    revealedMessages[1] = 'Age: 25';
    console.log('Messages to be revealed:', revealedMessages);

    // A nonce is a random value used once to ensure the proof is unique and not subject to replay attacks.
    const nonce = crypto.randomBytes(16);
    console.log('Using Nonce (Hex):', toHex(nonce));

    // Create the proof
    const proof = await createProof({
        publicKey: keyPair.publicKey,
        signature,
        messages,
        revealedIndices,
        nonce,
    });

    // Save the proof to a file
    const proofPath = path.resolve('proof.json');
    fs.writeFileSync(
        proofPath,
        JSON.stringify(
            {
                proof: toHex(proof),
                revealedMessages,
                nonce: toHex(nonce),
            },
            null,
            2,
        ),
    );
    console.log(`\nProof saved to ${proofPath}`);

    // Now, a verifier would receive the proof, the revealed messages, and the nonce.
    // Let's load them back and verify.
    const loadedProofData = JSON.parse(fs.readFileSync(proofPath, 'utf-8'));
    const loadedProof = fromHex(loadedProofData.proof);
    const loadedNonce = fromHex(loadedProofData.nonce);

    console.log('\n--- Verifying the Proof ---');
    const proofVerificationResult = await verifyProof({
        proof: loadedProof,
        publicKey: keyPair.publicKey,
        messages: loadedProofData.revealedMessages,
        nonce: loadedNonce,
    });

    console.log('\n--- Proof Verification Result ---');
    console.log('Is the selective disclosure proof valid?', proofVerificationResult.verified);
    console.log('---------------------------------\n');
};

main().catch(console.error);
