class SegmentTraffic {
  constructor() {
    this.vehicleActivity = {};
  }

  setVehicleConditions({ address, averageSpeed }) {
    console.log("setting vehicle conditions for: ", address);
    this.vehicleActivity[address] = averageSpeed;
  }

  disconnectVehicle({ address }) {
    delete this.vehicleActivity[address];
  }

  clear() {
    this.vehicleActivity = {};
  }
}

module.exports = SegmentTraffic;
