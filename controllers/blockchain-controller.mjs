import { blockchain } from '../startup.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';
import tickets from '../data/tickets.json' with { type: 'json' };
import fileHandler from '../utilities/fileHandler.mjs'

const getBlockchain = (req, res, next) => {
  res
    .status(200)
    .json(new ResponseModel({ statusCode: 200, data: blockchain }));
};

// endpoint .../mine.
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
   tickets.push(req.body);
  fileHandler('data', 'tickets.json', tickets);

  res.status(201).json(new ResponseModel({ statusCode: 201, data: req.body }));
};

export { createBlock, getBlockchain };
