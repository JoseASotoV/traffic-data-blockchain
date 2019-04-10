//const uuid = require("uuid").v1;
const { verifySignature, defineTrafficStatus } = require("../util");

class SegmentStatus {
  constructor({ senderDataManager, segmentTraffic }) {
    this.id = "test"; //uuid();
    this.trafficStatus = this.getTrafficStatus({ segmentTraffic });
    this.header = this.createHeader({
      senderDataManager,
      trafficStatus: this.trafficStatus
    });
  }

  getTrafficStatus({ segmentTraffic }) {
    return {
      status: defineTrafficStatus({ segmentTraffic }),
      traffic: segmentTraffic
    };
  }

  createHeader({ senderDataManager, trafficStatus }) {
    return {
      timestamp: Date.now(),
      address: senderDataManager.publicKey,
      signature: senderDataManager.sign(trafficStatus)
    };
  }

  static isValidSegmentStatus() {
    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.log(`invalid signature from ${address}`);
      return false;
    }
  }
}

module.exports = SegmentStatus;
