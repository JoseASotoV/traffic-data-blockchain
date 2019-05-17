const DataPool = require("./data-pool");
const DataManager = require("./index");
const SegmentStatus = require("./segment-status");

describe("DataPool", () => {
  let dataPool, segmentStatus, senderDataManager;

  beforeEach(() => {
    dataPool = new DataPool();
    senderDataManager = new DataManager();
    segmentStatus = new SegmentStatus({
      senderDataManager,
      segmentTraffic: { V1: 10, V2: 20 }
    });
  });

  describe("setSegmentStatus()", () => {
    it("adds a Segment Status to the pool", () => {
      dataPool.setSegmentStatus({ segmentStatus });

      expect(
        JSON.stringify(dataPool.segmentStatusMap[segmentStatus.id])
      ).toEqual(JSON.stringify(segmentStatus));
    });
  });

  describe("existingSegmentStatus()", () => {
    it("returns an existing SegmentStatus given a segment address", () => {
      dataPool.setSegmentStatus({ segmentStatus });
      expect(
        JSON.stringify(
          dataPool.existingSegmentStatus({
            segmentAddress: senderDataManager.publicKey
          })
        )
      ).toBe(JSON.stringify(segmentStatus));
    });
  });

  describe("getValidData", () => {
    it("returns valid data from the pool", () => {
      dataPool.setSegmentStatus({ segmentStatus });
      validData = dataPool.getValidData();
      expect(JSON.stringify(validData[0])).toEqual(
        JSON.stringify(segmentStatus)
      );
    });
  });

  describe("clear()", () => {
    it("clears the segmentStatusMap", () => {
      dataPool.clear();

      expect(dataPool.segmentStatusMap).toEqual({});
    });
  });
});
