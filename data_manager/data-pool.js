class DataPool {
  constructor() {
    this.segmentStatusMap = {};
  }

  setSegmentStatus(segmentStatus) {
    this.segmentStatusMap[segmentStatus.id] = segmentStatus;
  }

  existingSegmentStatus({ segmentAddress }) {
    const segmentStatusEntries = Object.values(this.segmentStatusMap);

    return segmentStatusEntries.find(
      segmentStatus => segmentStatus.header.address === segmentAddress
    );
  }

  clear() {
    this.segmentStatusMap = {};
  }
}

module.exports = DataPool;
