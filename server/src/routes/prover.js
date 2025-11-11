import express from 'express';
import { verifySignature } from '../utils/verify-signature.js';
import { fromHex } from '../utils/hex.js';

let router = express.Router();

router.post('/upload', async function (req, res, next) {
    const body = req.body;

    console.log(body);

    const { issuerPublicKey: issuerPublicKeyHex, signature: signatureHex, attributes } = body;
    const message = Object.entries(attributes).map(([key, value]) => `${key}: ${value}`);

    const issuerPublicKey = fromHex(issuerPublicKeyHex);
    const signature = fromHex(signatureHex);

    const isValid = await verifySignature(issuerPublicKey, signature, message);

    console.log({ isValid });

    res.send({
        ok: true,
        message: 'Certificate Verified and Stored successfully',
    });
});

export default router;
