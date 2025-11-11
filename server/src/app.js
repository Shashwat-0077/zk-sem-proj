import { config } from 'dotenv';
config();

import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index.js';
import issuerRouter from './routes/issuer.js';
import proverRouter from './routes/prover.js';

let app = express();

app.use(cors());
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use('/', indexRouter);
app.use('/issuer', issuerRouter);
app.use('/prover', proverRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        ok: false,
        message: err.message,
        // Only show the detailed error stack in development mode
        error: req.app.get('env') === 'development' ? err.stack : undefined,
    });
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`✅ Server is running at http://localhost:${process.env.SERVER_PORT}`);
});
