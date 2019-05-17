class DataPool {
  constructor() {
    this.segmentStatusMap = {};
  }

  setSegmentStatus({ segmentStatus }) {
    this.segmentStatusMap[segmentStatus.id] = JSON.parse(
      JSON.stringify(segmentStatus)
    );
  }

  existingSegmentStatus({ segmentAddress }) {
    const segmentStatusEntries = Object.values(this.segmentStatusMap);

    return segmentStatusEntries.find(
      segmentStatus => segmentStatus.header.address === segmentAddress
    );
  }

  getValidData() {
    //TODO: only return the data that is actually valid
    return Object.values(this.segmentStatusMap);
    //return Object.values(this.transactionMap).filter(transaction =>
    //  Transaction.validTransaction(transaction)
    //);
  }

  clear() {
    this.segmentStatusMap = {};
  }
}

module.exports = DataPool;
