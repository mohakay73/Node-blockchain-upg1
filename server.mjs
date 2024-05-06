import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import ErrorResponse from './utilities/ErrorResponseModel.mjs';
import {
  createBlock,
  getBlockchain,
} from './controllers/blockchain-controller.mjs';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './config/config.env' });

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

global.__appdir = dirname;

app.use(express.json());
app.use(cors());

app.get('/', getBlockchain);

app.post('/api/v1/mine', createBlock);

app.use('/api/v1/blockchain', blockchainRouter);

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Couldn't find the resource ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
