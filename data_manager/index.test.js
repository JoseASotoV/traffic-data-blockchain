const DataManager = require("./index");
const SegmentStatus = require("./segment-status");
const SegmentTraffic = require("./segment-traffic");
const { verifySignature } = require("../util");

describe("DataManager", () => {
  let dataManager;

  beforeEach(() => {
    dataManager = new DataManager();
  });

  it("has a public key", () => {
    expect(dataManager).toHaveProperty("publicKey");
  });

  describe("signing data", () => {
    const data = "foobar";

    it("verifies a valid signature", () => {
      expect(
        verifySignature({
          publicKey: dataManager.publicKey,
          data,
          signature: dataManager.sign(data)
        })
      ).toBe(true);
    });

    it("declines a non valid signature", () => {
      expect(
        verifySignature({
          publicKey: dataManager.publicKey,
          data,
          signature: new DataManager().sign(data)
        })
      ).toBe(false);
    });
  });

  describe("createSegmentStatus()", () => {
    beforeEach(() => {
      segmentTraffic = new SegmentTraffic();
      segmentTraffic.setVehicleConditions({ address: "V1", averageSpeed: 10 });
      dataManager.segmentTraffic = segmentTraffic;
      segmentStatus = dataManager.createSegmentStatus();
    });

    it("creates an instance of `SegmentStatus`", () => {
      expect(segmentStatus instanceof SegmentStatus).toBe(true);
    });

    it("matches the segmentStatus address with the sender publicKey", () => {
      expect(segmentStatus.header.address).toEqual(dataManager.publicKey);
    });

    it("contains the segment's traffic information", () => {
      expect(segmentStatus.trafficStatus.traffic).toEqual(segmentTraffic);
    });
  });
});
