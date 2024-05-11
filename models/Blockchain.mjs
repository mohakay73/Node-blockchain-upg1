import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';
import FileHandler from '../utilities/fileHandler.mjs';
import errorHandler from '../middleware/errorHandler.mjs';
import logger from '../middleware/logger.mjs';

export default class Blockchain {
  constructor() {
    this.fileHandler = new FileHandler('data', 'blockchain.json');
    const data = this.fileHandler.read(true);
    if (data && data.length > 0) {
      this.chain = data;
    } else {
      this.chain = [];
      this.createBlock(Date.now(), '0', '0', []);
    }
  }

  createBlock(
    timestamp,
    previousBlockHash,
    currentBlockHash,
    data,
    difficulty
  ) {
    if (typeof data !== 'object') {
      errorHandler('Data must be an object');
    }

    const block = new Block(
      timestamp,
      this.chain.length + 1,
      previousBlockHash,
      currentBlockHash,
      data,
      difficulty
    );

    this.chain.push(block);
    logger('Block created');

    return block;
  }
  writeToFile() {
    this.fileHandler.write(this.chain);
  }

  getAllBlocks() {
    return this.chain;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  hashBlock(timestamp, previousBlockHash, currentBlockData, nonce, difficulty) {
    const stringToHash =
      timestamp.toString() +
      previousBlockHash +
      JSON.stringify(currentBlockData) +
      nonce +
      difficulty;
    const hash = createHash(stringToHash);

    return hash;
  }

  validateChain(blockchain) {
    let isValid = true;
    for (let i = 1; i < blockchain.length; i++) {
      const block = blockchain[i];

      const previousBlock = blockchain[i - 1];

      const hash = this.hashBlock(
        block.timestamp,
        previousBlock.currentBlockHash,
        block.data
      );

      if (hash !== block.currentBlockHash) isValid = false;
      if (block.previousBlockHash !== previousBlock.currentBlockHash)
        isValid = false;
    }

    return isValid;
  }

  proofOfWork(previousBlockHash, data) {
    const lastBlock = this.getLastBlock();
    let difficulty, hash, timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();

      difficulty = this.difficultyAdjustment(lastBlock);
      hash = this.hashBlock(
        timestamp,
        previousBlockHash,
        data,
        nonce,
        difficulty
      );
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return { nonce, difficulty, timestamp };
  }

  difficultyAdjustment(lastBlock) {
    const MINE_RATE = process.env.MINE_RATE;
    let { difficulty, timestamp } = lastBlock;

    return timestamp + MINE_RATE > timestamp
      ? +difficulty + 1
      : +difficulty - 1;
  }
}
