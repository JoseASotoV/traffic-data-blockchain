const { GENESIS_DATA } = require("../config");
const cryptoHash = require("../util/crypto-hash");

class Block {
  constructor({ timestamp, hash, lastHash, data }) {
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.timestamp = timestamp;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = cryptoHash(timestamp, lastHash, data);

    return new this({
      timestamp,
      lastHash,
      data,
      hash
    });
  }
}

module.exports = Block;
