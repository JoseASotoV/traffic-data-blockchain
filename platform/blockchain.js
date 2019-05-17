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

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.log("The incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.log("The incoming chain is invalid");
      return;
    }

    this.chain = chain;
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data } = chain[i];
      const lastBlockHash = chain[i - 1].hash;
      const lastBlockTimestamp = chain[i - 1].timestamp;

      if (lastHash !== lastBlockHash) {
        console.log("lastHash !== lastBlockHash");
        return false;
      }

      if (lastBlockTimestamp > timestamp) {
        console.log("lastBlockTimestamp > timestamp");
        return false;
      }

      const validatedHash = cryptoHash(timestamp, lastHash, data);

      if (validatedHash !== hash) {
        console.log("validatedHash !== hash");
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
