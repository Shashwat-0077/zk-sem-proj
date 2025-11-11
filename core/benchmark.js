import { generateBbsKeyPair } from './src/keygen.js';
import { signMessages } from './src/sign.js';
import { verifySignature } from './src/verify.js';
import { createProof, verifyProof } from './src/proof.js';
import crypto from 'crypto';

// Helper to measure async function execution time
async function measure(label, fn) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return { label, time: end - start, result };
}

async function runBenchmark(iterations = 1000) {
    console.log(`\n🏁 Starting BBS+ Benchmark with ${iterations} iterations...\n`);

    const sampleMessages = [
        'FirstName: Alice',
        'LastName: Smith',
        'Age: 25',
        'Nationality: Canadian',
        'PassportID: 123456789',
    ];

    const results = {
        keyGen: [],
        sign: [],
        verify: [],
        proofGen: [],
        proofVerify: [],
    };

    for (let i = 0; i < iterations; i++) {
        const nonce = crypto.randomBytes(16);

        // Key generation
        const keyGen = await measure('KeyGen', async () => await generateBbsKeyPair());
        results.keyGen.push(keyGen.time);
        const keyPair = keyGen.result;

        // Signing
        const sign = await measure('Sign', async () => signMessages(keyPair, sampleMessages));
        results.sign.push(sign.time);
        const signature = sign.result;

        // Signature verification
        const verify = await measure('Verify', async () =>
            verifySignature(keyPair.publicKey, signature, sampleMessages),
        );
        results.verify.push(verify.time);

        // Selective disclosure (reveal 2 attributes)
        const revealedIndices = [0, 2];
        const revealedMessages = sampleMessages.filter((_, i) => revealedIndices.includes(i));

        const proofGen = await measure('ProofGen', async () =>
            createProof({
                publicKey: keyPair.publicKey,
                signature,
                messages: sampleMessages,
                revealedIndices,
                nonce,
            }),
        );
        results.proofGen.push(proofGen.time);
        const proof = proofGen.result;

        const proofVerify = await measure('ProofVerify', async () =>
            verifyProof({
                proof,
                publicKey: keyPair.publicKey,
                messages: revealedMessages,
                nonce,
            }),
        );
        results.proofVerify.push(proofVerify.time);

        // Progress logging every 1000 iterations
        if ((i + 1) % 1000 === 0) {
            console.log(`Completed ${i + 1}/${iterations} iterations...`);
        }
    }

    // Compute averages
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const summary = {
        keyGen: avg(results.keyGen),
        sign: avg(results.sign),
        verify: avg(results.verify),
        proofGen: avg(results.proofGen),
        proofVerify: avg(results.proofVerify),
    };

    console.log('\n📊 Benchmark Results (averages in ms):');
    console.table(summary);

    const total = Object.values(summary).reduce((a, b) => a + b, 0);
    console.log(`Total average per full cycle: ${total.toFixed(2)} ms`);
}

runBenchmark(10000).catch(console.error);
