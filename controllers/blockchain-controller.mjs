import { blockchain } from '../startup.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';
import tickets from '../data/tickets.json' with { type: 'json' };
import fileHandler from '../utilities/fileHandler.mjs'
import { v4 as uuidv4 } from 'uuid'; 

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
   
  const ticketId = uuidv4().replaceAll('-', '');

 
  const newTicket = {
    id: ticketId,
    ...req.body
  };

  
  tickets.push(newTicket);

  fileHandler('data', 'tickets.json', tickets);
   fileHandler('data', 'blockchain.json', blockchain.chain);

  res.status(201).json(new ResponseModel({ statusCode: 201, data: newTicket }));
};



export { createBlock, getBlockchain };
