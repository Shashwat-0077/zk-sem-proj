import * as circomlibjs from 'circomlibjs';
import { generateBls12381G2KeyPair, blsSign } from '@mattrglobal/bbs-signatures';
import fs from 'fs';

// ------------ Helper Functions ------------

/**
 * Converts a value (string, number, boolean) into a BigInt field element.
 * This is crucial as Poseidon operates on field elements.
 */
function toFieldElement(val) {
    if (typeof val === 'number') {
        if (Number.isInteger(val)) {
            return BigInt(val);
        }
        val = val.toString(); // Convert floats to string
    }
    if (typeof val === 'string') {
        // Updated regex to only match integers
        if (/^\d+$/.test(val)) {
            return BigInt(val);
        }
        // Hash text strings or float strings to map to a field element
        const hex = Buffer.from(val, 'utf8').toString('hex');
        return BigInt('0x' + hex);
    }
    if (typeof val === 'bigint') {
        return val;
    }
    if (typeof val === 'boolean') {
        return val ? 1n : 0n;
    }
    throw new Error(`Cannot convert type ${typeof val} to field element`);
}

/**
 * Loads and parses the user's raw data from a JSON file.
 */
function loadUserData(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

/**
 * Initializes the Poseidon hash functions.
 * @returns {object} An object containing the Poseidon hash function.
 */
async function setupPoseidon() {
    const poseidon = await circomlibjs.buildPoseidon();
    const F = poseidon.F; // The Finite Field

    // This hash function takes an array of inputs
    const hashInputs = (inputs) => {
        const fieldElements = inputs.map(toFieldElement);
        const hashBigInt = poseidon(fieldElements);
        return F.toString(hashBigInt); // Convert BigInt result to string
    };
    return { hashInputs };
}

/**
 * Creates all attribute leaves and builds the Merkle tree.
 * @param {object} userData - The user's raw data (e.g., { name: "Alice" }).
 * @param {function} hashInputs - The Poseidon hash function.
 * @returns {object} An object with leaves, tree levels, and the root hash.
 */
function createMerkleTree(userData, hashInputs) {
    // Step 3a: Create leaf objects
    const leaves = [];
    const leafObjects = []; // for holder

    // Sort keys to ensure deterministic message order for BBS+
    const sortedKeys = Object.keys(userData).sort();

    for (const key of sortedKeys) {
        const value = userData[key];
        const nonce = Math.floor(Math.random() * 1e9); // simple nonce
        const attrId = hashInputs([key]); // attrId = H(key)
        const leafHash = hashInputs([attrId, value, nonce]); // leafHash = H(attrId, value, nonce)

        leaves.push(leafHash); // Store the string hash
        leafObjects.push({
            key,
            value,
            nonce,
            attrId,
            leafHash,
        });
    }

    // Step 3b: Build Merkle Tree
    const treeLevels = [leaves];
    while (treeLevels[treeLevels.length - 1].length > 1) {
        const prev = treeLevels[treeLevels.length - 1];
        const next = [];

        for (let i = 0; i < prev.length; i += 2) {
            const left = prev[i];
            const right = prev[i + 1] || prev[i]; // duplicate last if odd
            const parentHash = hashInputs([left, right]); // H(left, right)
            next.push(parentHash); // Store string hash
        }
        treeLevels.push(next);
    }

    const rootHash = treeLevels[treeLevels.length - 1][0];

    // leafObjects are already sorted by key
    return { leafObjects, treeLevels, rootHash };
}

/**
 * Generates a BBS+ signature for the given messages.
 * @param {string[]} messages - The list of messages (as strings) to sign.
 * @param {object} keyPair - The BBS+ key pair.
 * @returns {Uint8Array} The BBS+ signature.
 */
async function generateBbsSignature(messages, keyPair) {
    // Convert all string messages to Uint8Array
    const messageArray = messages.map((msg) => Buffer.from(msg, 'utf8'));

    console.log(
        'Signing messages (as hex):',
        messageArray.map((m) => m.toString('hex')),
    );

    const signature = await blsSign({
        keyPair,
        messages: messageArray,
    });
    return signature;
}

/**
 * Saves the final package for the holder to a JSON file.
 * @param {string} filePath - The file path to save to.
 * @param {object} packageData - The complete holder package object.
 */
function saveHolderPackage(filePath, packageData) {
    // Use replacer to handle BigInt, though we try to store strings
    const replacer = (key, value) => (typeof value === 'bigint' ? value.toString() : value);
    fs.writeFileSync(filePath, JSON.stringify(packageData, replacer, 2));
}

// ------------ Main Orchestrator ------------

async function runIssuer() {
    let userData, hashInputs, leafObjects, treeLevels, rootHash, keyPair, signature;

    // Step 1: Load user data
    try {
        userData = loadUserData('./data/data.json');
        console.log('Step 1: User data loaded.');
    } catch (error) {
        console.error('Error at Step 1 (Load User Data):', error.message);
        console.error('Please ensure "data.json" exists and is valid JSON.');
        process.exit(1);
    }

    // Step 2: Build Poseidon hash function
    try {
        ({ hashInputs } = await setupPoseidon());
        console.log('Step 2: Poseidon hash function built.');
    } catch (error) {
        console.error('Error at Step 2 (Setup Poseidon):', error.message);
        process.exit(1);
    }

    // Step 3: Create Merkle Tree
    try {
        // Note: createMerkleTree now sorts leaves by key
        ({ leafObjects, treeLevels, rootHash } = createMerkleTree(userData, hashInputs));
        console.log(`Step 3: Merkle tree created. Root: ${rootHash.substring(0, 20)}...`);
    } catch (error) {
        console.error('Error at Step 3 (Create Merkle Tree):', error.message);
        process.exit(1);
    }

    // Step 4: Prepare credential JSON
    const credential = {
        issuer: 'Did:GovXYZ',
        issuedAt: Date.now(),
        rootHash, // The root remains for ZK proof verification
        schema: 'credential-v1',
    };
    console.log('Step 4: Credential object prepared.');

    // Step 5: Generate BBS+ keypair
    try {
        keyPair = await generateBls12381G2KeyPair();
        console.log('Step 5: BBS+ keypair generated.');
    } catch (error) {
        console.error('Error at Step 5 (Generate BBS+ Keypair):', error.message);
        process.exit(1);
    }

    // Step 6: Sign credential (rootHash + all leafHashes)
    // --- THIS IS THE KEY CHANGE ---
    // We sign the rootHash AND all individual leaf hashes.
    // Order: rootHash first, then leaf hashes in alphabetical order of their keys.
    const messagesToSign = [
        rootHash,
        ...leafObjects.map((leaf) => leaf.leafHash), // leafObjects is already sorted
    ];

    try {
        signature = await generateBbsSignature(messagesToSign, keyPair);
        console.log(`Step 6: Credential signed with BBS+. (${messagesToSign.length} messages)`);
    } catch (error) {
        console.error('Error at Step 6 (Generate BBS+ Signature):', error.message);
        process.exit(1);
    }

    // Step 7: Prepare and save JSON package for Holder
    try {
        const outputPackage = {
            credential,
            bbsSignature: Buffer.from(signature).toString('hex'),
            // Save the exact list of messages that were signed, in order
            messages: messagesToSign,
            keyPairPublic: Buffer.from(keyPair.publicKey).toString('hex'),
            // leaves and treeLevels are needed by holder for ZK proof
            leaves: leafObjects,
            treeLevels,
        };
        saveHolderPackage('./data/issued_credential.json', outputPackage);
        console.log('Step 7: Holder package saved to ./data/issued_credential.json');
    } catch (error) {
        console.error('Error at Step 7 (Save Holder Package):', error.message);
        process.exit(1);
    }

    console.log('\nIssuer workflow complete!');
}

runIssuer().catch((err) => {
    // This catches any unexpected errors not handled by the steps
    console.error('An unexpected error occurred:', err);
    process.exit(1);
});
