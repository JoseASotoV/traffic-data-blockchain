const uuid = require("uuid").v1;
const { verifySignature, defineTrafficStatus } = require("../util");

class SegmentStatus {
  constructor({ senderDataManager }) {
    this.id = uuid();
    this.roadSegmentId = senderDataManager.segmentId;
    const segmentTraffic = JSON.parse(
      JSON.stringify(senderDataManager.segmentTraffic)
    );
    this.trafficStatus = SegmentStatus.getTrafficStatus({ segmentTraffic });
    this.header = SegmentStatus.createHeader({
      senderDataManager,
      trafficStatus: this.trafficStatus
    });
  }

  static getTrafficStatus({ segmentTraffic }) {
    return {
      status: defineTrafficStatus({ segmentTraffic }),
      traffic: segmentTraffic
    };
  }

  static createHeader({ senderDataManager, trafficStatus }) {
    return {
      timestamp: Date.now(),
      address: senderDataManager.publicKey,
      signature: senderDataManager.sign(trafficStatus)
    };
  }

  static update({ senderDataManager, segmentStatus }) {
    segmentTraffic = senderDataManager.segmentTraffic;
    segmentStatus.trafficStatus = SegmentStatus.getTrafficStatus({
      segmentTraffic
    });
    segmentStatus.header = SegmentStatus.createHeader({
      senderDataManager,
      trafficStatus: segmentStatus.trafficStatus
    });
  }

  static isValidSegmentStatus() {
    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.log(`invalid signature from ${address}`);
      return false;
    }
    return true;
  }
}

module.exports = SegmentStatus;
