const Block = require("./block");
const { cryptoHash } = require("../util");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.getLastBlock(),
      data
    });

    this.chain.push(newBlock);
  }

  replaceChain(chain) {}

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data } = chain[i];
      const lastBlockHash = chain[i - 1].hash;

      if (lastHash !== lastBlockHash) {
        return false;
      }

      const validatedHash = cryptoHash(data, timestamp, lastHash);

      if (validatedHash !== hash) {
        return false;
      }
    }

    return true;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }
}

module.exports = Blockchain;
