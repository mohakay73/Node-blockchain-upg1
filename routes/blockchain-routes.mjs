import express from 'express';
import {
  createBlock,
  getBlockchain,
  getBlockIndex,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router
  .get('/', getBlockchain)
  .post('/mine', createBlock)
  .get('/:index', getBlockIndex);

export default router;
