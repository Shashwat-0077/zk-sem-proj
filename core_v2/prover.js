import { Noir } from '@noir-lang/noir_js';
import { UltraHonkBackend } from '@aztec/bb.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const circuitPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), './target/age_zk_proof.json');
const circuit = JSON.parse(fs.readFileSync(circuitPath, 'utf8'));

export default async function generateProof() {
    const inputArray = process.argv.slice(2);

    try {
        const noir = new Noir(circuit);
        const bb = new UltraHonkBackend(circuit.bytecode, { threads: 1 });

        const inputs = {
            age: Number(inputArray[0]),
            threshold: Number(inputArray[1]),
        };

        const { witness } = await noir.execute(inputs);
        const { proof } = await bb.generateProof(witness);

        console.log(proof);

        // ✅ Save proof to file
        const proofPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), './data/proof.txt');
        fs.writeFileSync(proofPath, proof);

        console.log(`Proof generated and saved to: ${proofPath}`);
    } catch (error) {
        console.error('Error during proof generation:', error.message);
        throw error;
    }
}

(async () => {
    try {
        await generateProof();
        console.log('Proof generation completed successfully.');
    } catch (error) {
        console.error('Proof generation failed:', error.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
})();
