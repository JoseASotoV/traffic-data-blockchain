const SegmentStatus = require("./segment-status");
const SegmentTraffic = require("./segment-traffic");
const DataManager = require("./index");
const { verifySignature, defineTrafficStatus } = require("../util");

describe("SegmentStatus", () => {
  let senderDataManager, segmentTraffic;

  beforeEach(() => {
    segmentTraffic = new SegmentTraffic();
    segmentTraffic.setVehicleConditions({ address: "V1", averageSpeed: 10 });
    senderDataManager = new DataManager();
    senderDataManager.segmentTraffic.traffic = segmentTraffic;
    segmentStatus = new SegmentStatus({ senderDataManager });
  });

  it("has an id", () => {
    expect(segmentStatus).toHaveProperty("id");
  });
  it("has a traffic segment Id", () => {
    expect(segmentStatus).toHaveProperty("roadSegmentId");
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
      console.log(
        "segmentStatus.trafficStatus.traffic :",
        segmentStatus.trafficStatus.traffic
      );
      expect(segmentStatus.trafficStatus.traffic).toEqual(
        senderDataManager.segmentTraffic
      );
    });
  });

  describe("header", () => {});
});
