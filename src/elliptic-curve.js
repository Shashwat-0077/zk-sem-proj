/**
 * BLS12-381 G1 Elliptic Curve Point Operations
 * Implements point arithmetic for BBS+ signatures
 */

import { G1_GENERATOR } from './constants.js';
import { modInverse } from './utils.js';

// BLS12-381 field modulus (base field)
const FIELD_MODULUS = BigInt(
    '0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab',
);

/**
 * Represents a point on the BLS12-381 G1 elliptic curve
 */
export class G1Point {
    constructor(x, y, z = 1n) {
        this.x = x;
        this.y = y;
        this.z = z; // Projective coordinate for efficiency
    }

    /**
     * Create the point at infinity (identity element)
     */
    static infinity() {
        return new G1Point(0n, 1n, 0n);
    }

    /**
     * Create the generator point
     */
    static generator() {
        return new G1Point(G1_GENERATOR.x, G1_GENERATOR.y, 1n);
    }

    /**
     * Check if this point is the point at infinity
     */
    isInfinity() {
        return this.z === 0n;
    }

    /**
     * Convert projective coordinates to affine coordinates
     */
    toAffine() {
        if (this.isInfinity()) {
            return new G1Point(0n, 0n, 0n);
        }

        const zInv = modInverse(this.z, FIELD_MODULUS);
        const x = (this.x * zInv) % FIELD_MODULUS;
        const y = (this.y * zInv) % FIELD_MODULUS;
        return new G1Point(x, y, 1n);
    }

    /**
     * Check if two points are equal
     */
    equals(other) {
        if (this.isInfinity() && other.isInfinity()) {
            return true;
        }
        if (this.isInfinity() || other.isInfinity()) {
            return false;
        }

        // Cross multiply to avoid division: x1*z2 == x2*z1 and y1*z2 == y2*z1
        const x1z2 = (this.x * other.z) % FIELD_MODULUS;
        const x2z1 = (other.x * this.z) % FIELD_MODULUS;
        const y1z2 = (this.y * other.z) % FIELD_MODULUS;
        const y2z1 = (other.y * this.z) % FIELD_MODULUS;

        return x1z2 === x2z1 && y1z2 === y2z1;
    }

    /**
     * Point addition using projective coordinates
     * More efficient than affine coordinates as it avoids division
     */
    add(other) {
        if (this.isInfinity()) return other;
        if (other.isInfinity()) return this;

        const x1 = this.x,
            y1 = this.y,
            z1 = this.z;
        const x2 = other.x,
            y2 = other.y,
            z2 = other.z;

        // Projective addition formulas for short Weierstrass curves
        const u1 = (x1 * z2) % FIELD_MODULUS;
        const u2 = (x2 * z1) % FIELD_MODULUS;
        const s1 = (y1 * z2) % FIELD_MODULUS;
        const s2 = (y2 * z1) % FIELD_MODULUS;

        if (u1 === u2) {
            if (s1 === s2) {
                // Point doubling
                return this.double();
            } else {
                // Points are inverses, result is infinity
                return G1Point.infinity();
            }
        }

        const h = (u2 - u1 + FIELD_MODULUS) % FIELD_MODULUS;
        const r = (s2 - s1 + FIELD_MODULUS) % FIELD_MODULUS;
        const h2 = (h * h) % FIELD_MODULUS;
        const h3 = (h2 * h) % FIELD_MODULUS;
        const u1h2 = (u1 * h2) % FIELD_MODULUS;

        const x3 = (r * r - h3 - 2n * u1h2) % FIELD_MODULUS;
        const y3 = (r * (u1h2 - x3) - s1 * h3) % FIELD_MODULUS;
        const z3 = (z1 * z2 * h) % FIELD_MODULUS;

        return new G1Point((x3 + FIELD_MODULUS) % FIELD_MODULUS, (y3 + FIELD_MODULUS) % FIELD_MODULUS, z3);
    }

    /**
     * Point doubling using projective coordinates
     */
    double() {
        if (this.isInfinity()) return this;

        const x = this.x,
            y = this.y,
            z = this.z;

        // Doubling formulas for y^2 = x^3 + 4 (BLS12-381 curve equation)
        const a = (x * x) % FIELD_MODULUS;
        const b = (y * y) % FIELD_MODULUS;
        const c = (b * b) % FIELD_MODULUS;
        const d = (2n * ((x + b) * (x + b) - a - c)) % FIELD_MODULUS;
        const e = (3n * a) % FIELD_MODULUS;
        const f = (e * e) % FIELD_MODULUS;

        const x3 = (f - 2n * d) % FIELD_MODULUS;
        const y3 = (e * (d - x3) - 8n * c) % FIELD_MODULUS;
        const z3 = (2n * y * z) % FIELD_MODULUS;

        return new G1Point(
            (x3 + FIELD_MODULUS) % FIELD_MODULUS,
            (y3 + FIELD_MODULUS) % FIELD_MODULUS,
            z3 % FIELD_MODULUS,
        );
    }

    /**
     * Scalar multiplication using double-and-add algorithm
     * Computes scalar * this_point
     */
    multiply(scalar) {
        if (scalar === 0n) return G1Point.infinity();
        if (scalar === 1n) return this;
        if (scalar < 0n) {
            return this.negate().multiply(-scalar);
        }

        let result = G1Point.infinity();
        let addend = this;
        let s = scalar;

        while (s > 0n) {
            if (s & 1n) {
                result = result.add(addend);
            }
            addend = addend.double();
            s = s >> 1n;
        }

        return result;
    }

    /**
     * Point negation (flip y-coordinate)
     */
    negate() {
        if (this.isInfinity()) return this;
        return new G1Point(this.x, (-this.y + FIELD_MODULUS) % FIELD_MODULUS, this.z);
    }

    /**
     * Check if point is on the curve: y^2 = x^3 + 4
     */
    isOnCurve() {
        if (this.isInfinity()) return true;

        const affine = this.toAffine();
        const x = affine.x;
        const y = affine.y;

        const y2 = (y * y) % FIELD_MODULUS;
        const x3 = (x * x * x) % FIELD_MODULUS;
        const rhs = (x3 + 4n) % FIELD_MODULUS;

        return y2 === rhs;
    }

    /**
     * Serialize point to compressed format (33 bytes)
     */
    toCompressed() {
        if (this.isInfinity()) {
            return new Uint8Array(48); // All zeros for infinity
        }

        const affine = this.toAffine();
        const xBytes = new Uint8Array(48);

        // Convert x coordinate to bytes (big-endian)
        let x = affine.x;
        for (let i = 47; i >= 0; i--) {
            xBytes[i] = Number(x & 0xffn);
            x = x >> 8n;
        }

        // Set compression flag and sign bit
        xBytes[0] |= 0x80; // Compression flag
        if (affine.y > FIELD_MODULUS / 2n) {
            xBytes[0] |= 0x20; // Sign bit
        }

        return xBytes;
    }

    /**
     * Convert to string representation
     */
    toString() {
        if (this.isInfinity()) {
            return 'G1Point(∞)';
        }
        const affine = this.toAffine();
        return `G1Point(x: 0x${affine.x.toString(16)}, y: 0x${affine.y.toString(16)})`;
    }
}

export default G1Point;
