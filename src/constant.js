/**
 * BBS+ Signature Constants
 * Based on the BLS12-381 elliptic curve
 */

// BLS12-381 curve order (scalar field modulus)
export const CURVE_ORDER = BigInt('0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001');

// Generator points for BLS12-381 G1 and G2 groups
export const G1_GENERATOR = {
    x: BigInt('0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb'),
    y: BigInt('0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1'),
};

export const G2_GENERATOR = {
    x: [
        BigInt('0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8'),
        BigInt('0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e'),
    ],
    y: [
        BigInt('0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801'),
        BigInt('0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be'),
    ],
};

// Hash-to-curve domain separation tags
export const DST_GENERATOR = 'BBS_BLS12381G1_XMD:SHA-256_SSWU_RO_H2G_HM2S_GENERATOR_';
export const DST_SIGNATURE = 'BBS_BLS12381G1_XMD:SHA-256_SSWU_RO_H2G_HM2S_SIGNATURE_';

// API identifiers
export const API_ID_BBS_SHA = 'BBS_BLS12381G1_XMD:SHA-256_SSWU_RO_H2G_HM2S_';

// Maximum number of messages that can be signed
export const MAX_MESSAGES = 2048;

export default {
    CURVE_ORDER,
    G1_GENERATOR,
    G2_GENERATOR,
    DST_GENERATOR,
    DST_SIGNATURE,
    API_ID_BBS_SHA,
    MAX_MESSAGES,
};
