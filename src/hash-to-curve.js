/**
 * Hash-to-Curve Implementation for BLS12-381 G1
 * Based on RFC 9380 - Hashing to Elliptic Curves
 * Uses the Simplified SWU (SSWU) method
 */

import { sha256 } from 'noble-hashes/sha256';
import { G1Point } from './elliptic-curve.js';
import { DST_GENERATOR } from './constants.js';

// BLS12-381 field modulus
const FIELD_MODULUS = BigInt(
    '0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab',
);

// SSWU parameters for BLS12-381 G1
const SSWU_A = BigInt(
    '0x144698a3b8e9433d693a02c96d4982b0ea985383ee66a8d8e8981aefd881ac98936f8da0e0f97f5cf428082d584c1d',
);
const SSWU_B = BigInt(
    '0x12e2908d11688030018b12e8753eee3b2016c1f0f24f4070a0b9c14fcef35ef55a23215a316ceaa5d1cc48e98e172be0',
);
const SSWU_Z = BigInt('11'); // The constant Z for SSWU mapping

/**
 * Expand message using XMD (eXpandable Message Digest)
 * Based on RFC 9380 Section 5.3.1
 */
function expandMessageXmd(msg, dst, lenInBytes) {
    const dstPrime = new Uint8Array(dst.length + 1);
    dstPrime.set(new TextEncoder().encode(dst));
    dstPrime[dst.length] = dst.length;

    const zPad = new Uint8Array(64); // SHA-256 block size
    const libStr = new Uint8Array(2);
    libStr[0] = (lenInBytes >> 8) & 0xff;
    libStr[1] = lenInBytes & 0xff;

    // b_0 = H(Z_pad || msg || l_i_b_str || I2OSP(0, 1) || DST_prime)
    const b0Input = new Uint8Array(zPad.length + msg.length + libStr.length + 1 + dstPrime.length);
    let offset = 0;
    b0Input.set(zPad, offset);
    offset += zPad.length;
    b0Input.set(msg, offset);
    offset += msg.length;
    b0Input.set(libStr, offset);
    offset += libStr.length;
    b0Input[offset] = 0;
    offset += 1;
    b0Input.set(dstPrime, offset);

    const b0 = sha256(b0Input);

    // b_1 = H(b_0 || I2OSP(1, 1) || DST_prime)
    const b1Input = new Uint8Array(b0.length + 1 + dstPrime.length);
    b1Input.set(b0);
    b1Input[b0.length] = 1;
    b1Input.set(dstPrime, b0.length + 1);

    let uniformBytes = sha256(b1Input);
    const ell = Math.ceil(lenInBytes / 32); // 32 = SHA-256 output length

    for (let i = 2; i <= ell; i++) {
        // b_i = H(strxor(b_0, b_{i-1}) || I2OSP(i, 1) || DST_prime)
        const strxor = new Uint8Array(32);
        for (let j = 0; j < 32; j++) {
            strxor[j] = b0[j] ^ uniformBytes.slice(-32)[j];
        }

        const biInput = new Uint8Array(strxor.length + 1 + dstPrime.length);
        biInput.set(strxor);
        biInput[strxor.length] = i;
        biInput.set(dstPrime, strxor.length + 1);

        const bi = sha256(biInput);
        const newUniformBytes = new Uint8Array(uniformBytes.length + bi.length);
        newUniformBytes.set(uniformBytes);
        newUniformBytes.set(bi, uniformBytes.length);
        uniformBytes = newUniformBytes;
    }

    return uniformBytes.slice(0, lenInBytes);
}

/**
 * Convert bytes to field element
 */
function bytesToFieldElement(bytes) {
    let result = 0n;
    for (let i = 0; i < bytes.length; i++) {
        result = (result << 8n) | BigInt(bytes[i]);
    }
    return result % FIELD_MODULUS;
}

/**
 * Compute square root in the field using Tonelli-Shanks algorithm
 */
function fieldSqrt(n) {
    if (n === 0n) return 0n;

    // BLS12-381 field modulus is 3 mod 4, so we can use simple formula
    // sqrt(n) = n^((p+1)/4) mod p
    const exp = (FIELD_MODULUS + 1n) / 4n;
    const result = modPow(n, exp, FIELD_MODULUS);

    // Verify it's actually a square root
    if ((result * result) % FIELD_MODULUS === n) {
        return result;
    }
    return null; // No square root exists
}

/**
 * Modular exponentiation
 */
function modPow(base, exp, mod) {
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
 */
function modInverse(a, mod) {
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
 * Simplified SWU mapping from field element to curve point
 * Maps a field element to a point on the elliptic curve
 */
function mapToCurve(u) {
    // Constants for the mapping
    const A = SSWU_A;
    const B = SSWU_B;
    const Z = SSWU_Z;

    const u2 = (u * u) % FIELD_MODULUS;
    const zu2 = (Z * u2) % FIELD_MODULUS;

    // tv1 = Z * u^2
    const tv1 = zu2;
    // tv2 = tv1^2
    const tv2 = (tv1 * tv1) % FIELD_MODULUS;
    // tv3 = tv2 + tv1
    const tv3 = (tv2 + tv1) % FIELD_MODULUS;
    // tv4 = tv3 + 1
    const tv4 = (tv3 + 1n) % FIELD_MODULUS;
    // tv5 = B * tv4
    const tv5 = (B * tv4) % FIELD_MODULUS;

    let tv6;
    if (tv3 === 0n) {
        tv6 = (A * Z) % FIELD_MODULUS;
    } else {
        tv6 = (-A * modInverse(tv3, FIELD_MODULUS)) % FIELD_MODULUS;
        tv6 = (tv6 + FIELD_MODULUS) % FIELD_MODULUS;
    }

    // x1 = tv6
    const x1 = tv6;
    // gx1 = x1^3 + A * x1 + B
    const gx1 = (((((x1 * x1) % FIELD_MODULUS) * x1) % FIELD_MODULUS) + ((A * x1) % FIELD_MODULUS) + B) % FIELD_MODULUS;

    // Check if gx1 is a quadratic residue
    const y1 = fieldSqrt(gx1);

    let x, y;
    if (y1 !== null) {
        x = x1;
        y = y1;
    } else {
        // x2 = tv1 * x1
        const x2 = (tv1 * x1) % FIELD_MODULUS;
        // gx2 = x2^3 + A * x2 + B
        const gx2 =
            (((((x2 * x2) % FIELD_MODULUS) * x2) % FIELD_MODULUS) + ((A * x2) % FIELD_MODULUS) + B) % FIELD_MODULUS;
        const y2 = fieldSqrt(gx2);

        if (y2 !== null) {
            x = x2;
            y = y2;
        } else {
            // x3 = tv2 * x1
            const x3 = (tv2 * x1) % FIELD_MODULUS;
            // gx3 = x3^3 + A * x3 + B
            const gx3 =
                (((((x3 * x3) % FIELD_MODULUS) * x3) % FIELD_MODULUS) + ((A * x3) % FIELD_MODULUS) + B) % FIELD_MODULUS;
            const y3 = fieldSqrt(gx3);

            x = x3;
            y = y3;
        }
    }

    // Sign of y should match sign of u
    const signU = u > FIELD_MODULUS / 2n ? 1n : 0n;
    const signY = y > FIELD_MODULUS / 2n ? 1n : 0n;

    if (signU !== signY) {
        y = (-y + FIELD_MODULUS) % FIELD_MODULUS;
    }

    return new G1Point(x, y);
}

/**
 * Clear cofactor for BLS12-381 G1
 * Multiplies point by the cofactor to ensure it's in the prime-order subgroup
 */
function clearCofactor(point) {
    // BLS12-381 G1 cofactor is 0x396c8c005555e1568c00aaab0000aaab
    const cofactor = BigInt('0x396c8c005555e1568c00aaab0000aaab');
    return point.multiply(cofactor);
}

/**
 * Hash arbitrary data to a point on BLS12-381 G1
 * Implements the hash_to_curve operation from RFC 9380
 */
export function hashToCurve(message, dst = DST_GENERATOR) {
    // Step 1: Expand message to uniform bytes
    const uniformBytes = expandMessageXmd(message, dst, 128); // 2 * 64 bytes for two field elements

    // Step 2: Convert to two field elements
    const u1 = bytesToFieldElement(uniformBytes.slice(0, 64));
    const u2 = bytesToFieldElement(uniformBytes.slice(64, 128));

    // Step 3: Map each field element to a curve point
    const p1 = mapToCurve(u1);
    const p2 = mapToCurve(u2);

    // Step 4: Add the points
    const p = p1.add(p2);

    // Step 5: Clear cofactor to ensure point is in prime-order subgroup
    return clearCofactor(p);
}

/**
 * Hash multiple messages to curve points
 * Used for generating multiple generators in BBS+ signatures
 */
export function hashToGenerators(count, dst = DST_GENERATOR) {
    const generators = [];

    for (let i = 0; i < count; i++) {
        // Create unique message for each generator
        const indexBytes = new Uint8Array(4);
        indexBytes[0] = (i >>> 24) & 0xff;
        indexBytes[1] = (i >>> 16) & 0xff;
        indexBytes[2] = (i >>> 8) & 0xff;
        indexBytes[3] = i & 0xff;

        const message = new Uint8Array(indexBytes.length + 8);
        message.set(new TextEncoder().encode('GENERATOR'));
        message.set(indexBytes, 8);

        generators.push(hashToCurve(message, dst));
    }

    return generators;
}

/**
 * Create a domain-specific hash-to-curve function
 */
export function createHashToCurve(domainSeparationTag) {
    return (message) => hashToCurve(message, domainSeparationTag);
}

export default {
    hashToCurve,
    hashToGenerators,
    createHashToCurve,
};
