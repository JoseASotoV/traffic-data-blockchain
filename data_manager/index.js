const SegmentStatus = require("./segment-status");
const { ec, cryptoHash } = require("../util");

class DataManager {
  constructor() {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createSegmentStatus({ segmentTraffic }) {
    return new SegmentStatus({ senderDataManager: this, segmentTraffic });
  }
}

module.exports = DataManager;
