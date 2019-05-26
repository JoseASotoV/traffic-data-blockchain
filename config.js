const { cryptoHash } = require("./util");

const GENESIS_DATA = {
  timestamp: 1552237200000,
  lastHash: "----",
  data: [
    {
      roadSegmentId: "Street1",
      trafficStatus: { status: "LOW-TRAFFIC" }
    },
    {
      roadSegmentId: "Street2",
      trafficStatus: { status: "MEDIUM-TRAFFIC" }
    },
    {
      roadSegmentId: "Street3",
      trafficStatus: { status: "HIGH-TRAFFIC" }
    }
  ],
  hash: cryptoHash("data")
};

module.exports = { GENESIS_DATA };
