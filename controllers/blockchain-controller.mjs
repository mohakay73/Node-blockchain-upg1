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

  res.status(201).json(new ResponseModel({ statusCode: 201, data: block }));
  blockchain.writeToFile();
};

const getBlockByIndex = (req, res, next) => {
  const blockIndex = parseInt(req.params.index);
  const block = blockchain.chain[blockIndex - 1];

  if (!block) {
    return next(
      new ErrorResponse(
        `Couldn't find the block with index: ${blockIndex}`,
        404
      )
    );
  }

  sendResponse(res, 200, block);
};

export { createBlock, getBlockchain, getBlockByIndex };
