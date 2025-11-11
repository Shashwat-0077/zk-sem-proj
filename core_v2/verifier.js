import { Noir } from '@noir-lang/noir_js';
import { UltraHonkBackend } from '@aztec/bb.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import zlib from 'zlib';

const circuitPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), './target/age_zk_proof.json');
const circuit = JSON.parse(fs.readFileSync(circuitPath, 'utf8'));

export default async function verifyProof() {
    const inputArray = process.argv.slice(2);

    if (inputArray.length < 1) {
        console.error('❌ Usage: node verifier.js <threshold>');
        process.exit(1);
    }

    try {
        const bb = new UltraHonkBackend(circuit.bytecode, { threads: 1 });

        const publicInputs = [Number(inputArray[0])];

        const proofPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), './data/proof.txt');

        if (!fs.existsSync(proofPath)) {
            console.error('❌ Proof file not found:', proofPath);
            process.exit(1);
        }

        // Read and decompress proofb
        const buffer = fs.readFileSync(proofPath);
        console.log(buffer.length);
        const proof = new Uint8Array(buffer);

        console.log(proof.length);

        // Verify proof
        const isValid = await bb.verifyProof({
            proof: proof,
            publicInputs: publicInputs,
        });

        if (isValid) {
            console.log('✅ Proof verification successful!');
        } else {
            console.log('❌ Proof verification failed!');
        }
    } catch (error) {
        console.error('❌ Error during verification:', error.message);
        throw error;
    }
}

(async () => {
    try {
        await verifyProof();
        console.log('✅ Verification process completed.');
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
})();
