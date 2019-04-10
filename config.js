const { cryptoHash } = require("./util");

const GENESIS_DATA = {
  timestamp: 1552237200000,
  lastHash: "----",
  data: ["street1:low", "street2:low"],
  hash: cryptoHash("data")
};

module.exports = { GENESIS_DATA };
