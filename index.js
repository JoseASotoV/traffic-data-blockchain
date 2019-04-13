const bodyParser = require("body-parser");
const express = require("express");
const Blockchain = require("./platform/blockchain");
const DataManager = require("./data_manager");
const DataPool = require("./data_manager/data-pool");
const DataMiner = require("./app/data-miner");

const app = express();
const blockchain = new Blockchain();
const dataManager = new DataManager();
const dataPool = new DataPool();
const dataMiner = new DataMiner({ blockchain, dataPool, dataManager });

const DEFAULT_PORT = 3000;

app.use(bodyParser.json());

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  //pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

app.get("/api/mine-data", (req, res) => {
  dataMiner.mineData();

  res.redirect("/api/blocks");
});

app.get("/api/data-pool-map", (req, res) => {
  res.json(dataPool.segmentStatusMap);
});

app.post("/api/create-segment-status", (req, res) => {
  const { segmentTraffic } = req.body;

  let segmentStatus = dataPool.existingSegmentStatus({
    segmentAddress: dataManager.publicKey
  });

  try {
    //TODO: code what happens if the segment already exists (update)
    //if (segmentStatus) {
    //  segmentStatus.update({ senderWallet: wallet, recipient, amount });
    //} else {
    //TODO: for now segmentTraffic is hardcoded, but this data needs to be provided by the actual vehicles
    //connected to the segment
    segmentStatus = dataManager.createSegmentStatus({
      segmentTraffic: { V1: 10, V2: 20 }
    });
    //}
  } catch (error) {
    return res.status(400).json({ type: "error", message: error.message });
  }

  dataPool.setSegmentStatus(segmentStatus);

  //pubsub.broadcastTransaction(transaction);

  res.status(200).json({ type: "success", segmentStatus });
});

app.get("/api/data-manager-info", (req, res) => {
  const address = dataManager.publicKey;
  res.json({
    address
  });
});

const PORT = DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncChains();
  }
});
