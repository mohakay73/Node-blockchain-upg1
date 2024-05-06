import { blockchain } from '../startup.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';

const getBlockchain = (req, res, next) => {
  res
    .status(200)
    .json(new ResponseModel({ statusCode: 200, data: blockchain }));
};

const createBlock = (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = req.body;
  const { nonce, difficulty, timestamp } = blockchain.proofOfWork(
    lastBlock.currentBlockHash,
    data
  );

  const currentBlockHash = blockchain.hashBlock(
    timestamp,
    lastBlock.currentBlockHash,
    data,
    nonce,
    difficulty
  );

  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currentBlockHash,
    currentBlockHash,
    data,
    difficulty
  );

  res.status(201).json({ success: true, data: block });
};

const getBlockIndex = (req, res, next) => {
  const index = parseInt(req.params.index);
  const block = blockchain.chain[index - 1];

  if (!block) {
    return next(new ErrorResponse(`NO block with the index: ${Index}`, 404));
  }

  sendResponse(res, 200, block);
};

export { createBlock, getBlockchain, getBlockIndex };
