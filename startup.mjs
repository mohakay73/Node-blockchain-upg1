import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Blockchain from './models/Blockchain.mjs';

global.__appdir = dirname(fileURLToPath(import.meta.url));

const blockchain = new Blockchain();

export { blockchain };
