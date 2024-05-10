import { describe, it, expect, beforeEach } from 'vitest';
import Block from '../models/Block.mjs';

const PORT = 5004;

describe('Block', () => {
  describe('Properties', () => {
    let timestamp, hash, lastHash, data, nonce, difficulty;
    let block;

    beforeEach(() => {
      timestamp = Date.now();
      hash = 'exampleHash';
      lastHash = 'exampleLastHash';
      nonce = 12345;
      difficulty = 2;
      data = { example: 'data' };

      block = new Block({
        timestamp,
        hash,
        lastHash,
        nonce,
        difficulty,
        data,
      });
    });

    it('should have a timestamp property', () => {
      expect(block).toHaveProperty('timestamp');
    });
  });
});
