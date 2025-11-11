import express from 'express';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { signMessages } from '../utils/sign-message.js';
import { generateBbsKeyPair } from '../utils/keygen.js';
import { toHex } from '../utils/hex.js';

let router = express.Router();

router.post('/issue', async function (req, res, next) {
    const body = req.body;

    const keyPair = await generateBbsKeyPair();
    const messages = Object.entries(body).map(([key, value]) => `${key}: ${value}`);
    const signature = await signMessages(keyPair, messages);

    const hexSignature = toHex(signature);
    const hexPublicKey = toHex(keyPair.publicKey);
    console.log(hexSignature);

    res.send({
        ok: true,
        signature: hexSignature,
        issuerPublicKey: hexPublicKey,
        issuer: 'ABC University',
        attributes: body,
    });
});

export default router;
