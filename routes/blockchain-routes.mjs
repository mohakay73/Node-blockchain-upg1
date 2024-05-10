import express from 'express';
import {
  createBlock,
  getBlockchain,
  getBlockByIndex,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.route('/').get(getBlockchain);
router.get('/:index', getBlockByIndex);
router.route('/mine').post(createBlock);

export default router;
