const SegmentTraffic = require("./segment-traffic");

describe("DataPool", () => {
  let segmentTraffic, vehicleInfo;

  beforeEach(() => {
    segmentTraffic = new SegmentTraffic();
    vehicleInfo = { address: "V1", averageSpeed: 10 };
  });

  describe("setVehicleConditions()", () => {
    it("adds vehicle info to the traffic", () => {
      segmentTraffic.setVehicleConditions(vehicleInfo);

      expect(segmentTraffic.vehicleActivity[vehicleInfo.address]).toBe(
        vehicleInfo.averageSpeed
      );
    });
  });

  describe("disconnectVehicle()", () => {
    it("removes vehicle info when it exists", () => {
      segmentTraffic.setVehicleConditions(vehicleInfo);
      segmentTraffic.disconnectVehicle({ address: vehicleInfo.address });
      expect(segmentTraffic.vehicleActivity[vehicleInfo.address]).toBe(
        undefined
      );
    });
    it("does nothing when vehicle info does not exist", () => {
      segmentTraffic.disconnectVehicle(vehicleInfo.address);
      expect(segmentTraffic.vehicleActivity[vehicleInfo.address]).toBe(
        undefined
      );
    });
  });

  describe("clear()", () => {
    it("clears the segmentStatus", () => {
      segmentTraffic.clear();

      expect(segmentTraffic.vehicleActivity).toEqual({});
    });
  });
});
