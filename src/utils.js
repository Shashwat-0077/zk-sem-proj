import { sha256 } from 'noble-hashes/sha256';
import { CURVE_ORDER } from './constants.js';

/**
 * Convert a byte array to a big integer
 * @param {Uint8Array} bytes - The byte array
 * @returns {bigint} The resulting big integer
 */
export function bytesToBigInt(bytes) {
    let result = 0n;
    for (let i = 0; i < bytes.length; i++) {
        result = (result << 8n) | BigInt(bytes[i]);
    }
    return result;
}

/**
 * Convert a big integer to a byte array of specified length
 * @param {bigint} num - The big integer
 * @param {number} length - The desired byte length
 * @returns {Uint8Array} The resulting byte array
 */
export function bigIntToBytes(num, length = 32) {
    const bytes = new Uint8Array(length);
    let n = num;
    for (let i = length - 1; i >= 0; i--) {
        bytes[i] = Number(n & 0xffn);
        n = n >> 8n;
    }
    return bytes;
}

/**
 * Modular exponentiation: (base^exp) mod mod
 * @param {bigint} base - The base
 * @param {bigint} exp - The exponent
 * @param {bigint} mod - The modulus
 * @returns {bigint} The result
 */
export function modPow(base, exp, mod) {
    if (mod === 1n) return 0n;
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp >> 1n;
        base = (base * base) % mod;
    }
    return result;
}

/**
 * Modular inverse using extended Euclidean algorithm
 * @param {bigint} a - The number to find inverse of
 * @param {bigint} mod - The modulus
 * @returns {bigint} The modular inverse
 */
export function modInverse(a, mod) {
    const gcd = (a, b) => {
        if (a === 0n) return [b, 0n, 1n];
        const [gcd, x1, y1] = gcd(b % a, a);
        const x = y1 - (b / a) * x1;
        const y = x1;
        return [gcd, x, y];
    };

    const [g, x] = gcd(((a % mod) + mod) % mod, mod);
    if (g !== 1n) throw new Error('Modular inverse does not exist');
    return ((x % mod) + mod) % mod;
}

/**
 * Hash arbitrary input to a scalar in the curve's scalar field
 * @param {Uint8Array} input - The input to hash
 * @param {string} dst - Domain separation tag
 * @returns {bigint} The resulting scalar
 */
export function hashToScalar(input, dst = '') {
    const dstBytes = new TextEncoder().encode(dst);
    const fullInput = new Uint8Array(input.length + dstBytes.length + 1);
    fullInput.set(input);
    fullInput.set(dstBytes, input.length);
    fullInput[fullInput.length - 1] = dstBytes.length;

    // Hash and reduce modulo curve order
    const hash = sha256(fullInput);
    const hashInt = bytesToBigInt(hash);
    return hashInt % CURVE_ORDER;
}

/**
 * Generate a random scalar in the curve's scalar field
 * @returns {bigint} A random scalar
 */
export function randomScalar() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const num = bytesToBigInt(bytes);
    return num % CURVE_ORDER;
}

/**
 * Convert string messages to byte arrays
 * @param {string[]} messages - Array of string messages
 * @returns {Uint8Array[]} Array of byte arrays
 */
export function messagesToBytes(messages) {
    return messages.map((msg) => new TextEncoder().encode(msg));
}

/**
 * Concatenate multiple byte arrays
 * @param {...Uint8Array} arrays - The arrays to concatenate
 * @returns {Uint8Array} The concatenated array
 */
export function concatBytes(...arrays) {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

export default {
    bytesToBigInt,
    bigIntToBytes,
    modPow,
    modInverse,
    hashToScalar,
    randomScalar,
    messagesToBytes,
    concatBytes,
};
