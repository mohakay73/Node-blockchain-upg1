import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';
import FileHandler from '../utilities/fileHandler.mjs';
import { handleError, log } from '../middleware/errorHandler.mjs';

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
      handleError('Data must be an object');
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
    log('Block created');

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
