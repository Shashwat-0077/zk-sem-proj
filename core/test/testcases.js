// test/bbs.test.js
import { generateBbsKeyPair } from '../src/keygen.js';
import { signMessages } from '../src/sign.js';
import { verifySignature } from '../src/verify.js';
import { createProof, verifyProof } from '../src/proof.js';
import crypto from 'crypto';
import assert from 'assert';
import { describe, it, before, after } from 'mocha';

describe('BBS+ Signature and Proof Scheme', () => {
    const sampleMessages = [
        'FirstName: Alice',
        'LastName: Smith',
        'Age: 25',
        'Nationality: Canadian',
        'PassportID: 123456789',
    ];

    let keyPair;
    const passedTests = [];

    before(async () => {
        // Generate a key pair once before any of the tests run.
        keyPair = await generateBbsKeyPair();
    });

    after(() => {
        console.log('\n\n✅ All Passed Tests Summary:');
        if (passedTests.length === 0) {
            console.log('⚠️  No tests passed (or Mocha failed early)');
        } else {
            for (const testName of passedTests) {
                console.log(`- ${testName}`);
            }
        }
        console.log('✅ Total Passed:', passedTests.length, '\n');
    });

    // Helper to wrap each test and record success
    const wrapTest = (name, fn) => {
        it(name, async function () {
            await fn();
            passedTests.push(name);
        });
    };

    wrapTest('Test Case 1: Should create a valid signature and verify it successfully', async () => {
        console.log('Input Messages:', sampleMessages);
        const signature = await signMessages(keyPair, sampleMessages);
        console.log('Verification Data: Using original messages and public key.');
        console.log('Expected Outcome: Verification should succeed (true).');
        const result = await verifySignature(keyPair.publicKey, signature, sampleMessages);
        console.log('Actual Outcome:', result);
        assert.strictEqual(result.verified, true, 'Signature verification failed');
    });

    wrapTest('Test Case 2: Should create and verify a valid selective disclosure proof', async () => {
        const signature = await signMessages(keyPair, sampleMessages);
        const revealedIndices = [0, 2];
        const revealedMessages = sampleMessages.filter((_, i) => revealedIndices.includes(i));
        const nonce = crypto.randomBytes(16);

        console.log('Revealed Messages for Proof:', revealedMessages);
        const proof = await createProof({
            publicKey: keyPair.publicKey,
            signature,
            messages: sampleMessages,
            revealedIndices,
            nonce,
        });

        console.log('Verification Data: Using the revealed messages and original public key.');
        console.log('Expected Outcome: Proof verification should succeed (true).');
        const result = await verifyProof({ proof, publicKey: keyPair.publicKey, messages: revealedMessages, nonce });
        console.log('Actual Outcome:', result);
        assert.strictEqual(result.verified, true, 'Proof verification failed');
    });

    wrapTest('Test Case 3: Should fail to verify a signature if a message is tampered', async () => {
        const signature = await signMessages(keyPair, sampleMessages);
        const tamperedMessages = [...sampleMessages];
        tamperedMessages[2] = 'Age: 26'; // Tamper the age

        console.log('Original Messages:', sampleMessages);
        console.log('Tampered Messages:', tamperedMessages);
        console.log('Expected Outcome: Verification should fail (false).');
        const result = await verifySignature(keyPair.publicKey, signature, tamperedMessages);
        console.log('Actual Outcome:', result);
        assert.strictEqual(result.verified, false, 'Signature verification should have failed but passed');
    });

    wrapTest('Test Case 4: Should fail to verify a proof if a revealed message is tampered', async () => {
        const signature = await signMessages(keyPair, sampleMessages);
        const revealedIndices = [0, 3];
        const revealedMessages = sampleMessages.filter((_, i) => revealedIndices.includes(i));
        const nonce = crypto.randomBytes(16);
        const proof = await createProof({
            publicKey: keyPair.publicKey,
            signature,
            messages: sampleMessages,
            revealedIndices,
            nonce,
        });

        const tamperedRevealedMessages = [...revealedMessages];
        tamperedRevealedMessages[1] = 'Nationality: American'; // Tamper the revealed nationality

        console.log('Original Revealed Messages:', revealedMessages);
        console.log('Tampered Revealed Messages:', tamperedRevealedMessages);
        console.log('Expected Outcome: Proof verification should fail (false).');
        const result = await verifyProof({
            proof,
            publicKey: keyPair.publicKey,
            messages: tamperedRevealedMessages,
            nonce,
        });
        console.log('Actual Outcome:', result);
        assert.strictEqual(result.verified, false, 'Proof verification should have failed but passed');
    });

    wrapTest('Test Case 5: Should fail to verify a signature with a different public key', async () => {
        const signature = await signMessages(keyPair, sampleMessages);
        const anotherKeyPair = await generateBbsKeyPair();

        console.log('Original Public Key (first 10 bytes):', keyPair.publicKey.slice(0, 10));
        console.log('Different Public Key (first 10 bytes):', anotherKeyPair.publicKey.slice(0, 10));
        console.log('Expected Outcome: Verification should fail (false).');
        const result = await verifySignature(anotherKeyPair.publicKey, signature, sampleMessages);
        console.log('Actual Outcome:', result);
        assert.strictEqual(
            result.verified,
            false,
            'Signature verification with wrong key should have failed but passed',
        );
    });

    wrapTest('Test Case 6: Should fail to verify a proof with a different public key', async () => {
        const signature = await signMessages(keyPair, sampleMessages);
        const anotherKeyPair = await generateBbsKeyPair();
        const revealedIndices = [1, 4];
        const revealedMessages = sampleMessages.filter((_, i) => revealedIndices.includes(i));
        const nonce = crypto.randomBytes(16);
        const proof = await createProof({
            publicKey: keyPair.publicKey,
            signature,
            messages: sampleMessages,
            revealedIndices,
            nonce,
        });

        console.log('Original Public Key (first 10 bytes):', keyPair.publicKey.slice(0, 10));
        console.log('Different Public Key (first 10 bytes):', anotherKeyPair.publicKey.slice(0, 10));
        console.log('Expected Outcome: Proof verification should fail (false).');
        const result = await verifyProof({
            proof,
            publicKey: anotherKeyPair.publicKey,
            messages: revealedMessages,
            nonce,
        });
        console.log('Actual Outcome:', result);
        assert.strictEqual(result.verified, false, 'Proof verification with wrong key should have failed but passed');
    });

    wrapTest('Test Case 7: Should fail to verify a proof with a different nonce', async () => {
        const signature = await signMessages(keyPair, sampleMessages);
        const revealedIndices = [0, 2, 4];
        const revealedMessages = sampleMessages.filter((_, i) => revealedIndices.includes(i));
        const originalNonce = crypto.randomBytes(16);
        const differentNonce = crypto.randomBytes(16);
        const proof = await createProof({
            publicKey: keyPair.publicKey,
            signature,
            messages: sampleMessages,
            revealedIndices,
            nonce: originalNonce,
        });

        console.log('Original Nonce:', originalNonce);
        console.log('Different Nonce:', differentNonce);
        console.log('Expected Outcome: Proof verification should fail (false).');
        const result = await verifyProof({
            proof,
            publicKey: keyPair.publicKey,
            messages: revealedMessages,
            nonce: differentNonce,
        });
        console.log('Actual Outcome:', result);
        assert.strictEqual(result.verified, false, 'Proof verification with wrong nonce should have failed but passed');
    });

    wrapTest('Test Case 8: Should create a valid proof revealing NO messages', async () => {
        const signature = await signMessages(keyPair, sampleMessages);
        const revealedIndices = [];
        const revealedMessages = [];
        const nonce = crypto.randomBytes(16);
        console.log('Revealing 0 messages from a signature over', sampleMessages.length, 'messages.');
        const proof = await createProof({
            publicKey: keyPair.publicKey,
            signature,
            messages: sampleMessages,
            revealedIndices,
            nonce,
        });

        console.log('Expected Outcome: Proof verification should succeed (true).');
        const result = await verifyProof({ proof, publicKey: keyPair.publicKey, messages: revealedMessages, nonce });
        console.log('Actual Outcome:', result);
        assert.strictEqual(result.verified, true, 'Proof verification with zero revealed messages failed');
    });

    wrapTest('Test Case 9: Should create a valid proof revealing ALL messages', async () => {
        const signature = await signMessages(keyPair, sampleMessages);
        const revealedIndices = sampleMessages.map((_, i) => i);
        const revealedMessages = [...sampleMessages];
        const nonce = crypto.randomBytes(16);
        console.log('Revealing all', sampleMessages.length, 'messages.');
        const proof = await createProof({
            publicKey: keyPair.publicKey,
            signature,
            messages: sampleMessages,
            revealedIndices,
            nonce,
        });

        console.log('Expected Outcome: Proof verification should succeed (true).');
        const result = await verifyProof({ proof, publicKey: keyPair.publicKey, messages: revealedMessages, nonce });
        console.log('Actual Outcome:', result);
        assert.strictEqual(result.verified, true, 'Proof verification with all messages revealed failed');
    });

    wrapTest('Test Case 10: Should successfully sign and verify a signature for a single message', async () => {
        const messages = ['This is a single message.'];
        console.log('Input Messages:', messages);
        const signature = await signMessages(keyPair, messages);
        console.log('Verification Data: Using a single message list.');
        console.log('Expected Outcome: Verification should succeed (true).');
        const result = await verifySignature(keyPair.publicKey, signature, messages);
        console.log('Actual Outcome:', result);
        assert.strictEqual(result.verified, true, 'Signature verification for a single message failed');
    });
});
