import express from 'express';
let router = express.Router();

/* GET home page. */
router.get('/health', function (req, res, next) {
    res.send({ ok: true, message: 'API is working fine' });
});

export default router;
