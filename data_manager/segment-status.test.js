const SegmentStatus = require("./segment-status");
const DataManager = require("./index");
const { verifySignature, defineTrafficStatus } = require("../util");

describe("SegmentStatus", () => {
  let senderDataManager;

  beforeEach(() => {
    senderDataManager = new DataManager();
    segmentTraffic = [{ pk: "car-1", averageSpeed: "20" }];
    segmentStatus = new SegmentStatus({ senderDataManager, segmentTraffic });
  });

  it("has an id", () => {
    expect(segmentStatus).toHaveProperty("id");
  });

  describe("trafficStatus", () => {
    it("has a traffic status property", () => {
      expect(segmentStatus).toHaveProperty("trafficStatus");
    });

    it("has the correct status of the road segment", () => {
      expect(segmentStatus.trafficStatus.status).toEqual(
        defineTrafficStatus({ segmentTraffic })
      );
    });
    it("has the records of the cars registered", () => {
      expect(segmentStatus.trafficStatus.traffic).toEqual(segmentTraffic);
    });
  });

  describe("header", () => {});
});
