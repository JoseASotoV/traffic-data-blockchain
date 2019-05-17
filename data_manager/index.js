const SegmentStatus = require("./segment-status");
const SegmentTraffic = require("./segment-traffic");
const { ec, cryptoHash } = require("../util");

class DataManager {
  constructor() {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
    this.segmentTraffic = new SegmentTraffic();
    this.segmentId = "---";
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createSegmentStatus() {
    const segmentStatus = new SegmentStatus({
      senderDataManager: this
    });
    return segmentStatus;
  }
}

module.exports = DataManager;
