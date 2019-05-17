const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const Blockchain = require("./platform/blockchain");
const DataManager = require("./data_manager");
const DataPool = require("./data_manager/data-pool");
const DataMiner = require("./app/data-miner");
const PubSub = require("./pubsub");
const SegmentStatus = require("./data_manager/segment-status");

const app = express();
const blockchain = new Blockchain();
const dataManager = new DataManager();
const dataPool = new DataPool();
const dataMiner = new DataMiner({ blockchain, dataPool, dataManager });
const pubsub = new PubSub({ blockchain, dataPool });

const DEFAULT_PORT = 3001;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.get("/api/last-block", (req, res) => {
  res.json(blockchain.getLastBlock());
});

app.post("/api/mine", (req, res) => {
  //const { data } = req.body;

  const data = dataPool.getValidData();

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

app.get("/api/mine-data", (req, res) => {
  dataMiner.mineData();

  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

app.get("/api/data-pool-map", (req, res) => {
  res.json(dataPool.segmentStatusMap);
});

app.post("/api/create-segment-status", (req, res) => {
  let segmentStatus = dataPool.existingSegmentStatus({
    segmentAddress: dataManager.publicKey
  });

  try {
    if (segmentStatus) {
      console.log("updating segment status");
      segmentStatus = SegmentStatus.update({
        senderDataManager: dataManager,
        segmentStatus
      });
    } else {
      console.log("creating segment status");
      segmentStatus = dataManager.createSegmentStatus();
    }
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

app.post("/api/set-vehicle-conditions", (req, res) => {
  const { address, averageSpeed } = req.body;

  try {
    dataManager.segmentTraffic.setVehicleConditions({ address, averageSpeed });
    segmentTraffic = dataManager.segmentTraffic;
  } catch (error) {
    return res.status(400).json({ type: "error", message: error.message });
  }

  res.status(200).json({ type: "success" });
});

app.post("/api/disconnect-vehicle", (req, res) => {
  const { address } = req.body;

  try {
    dataManager.segmentTraffic.disconnectVehicle({ address });
    segmentTraffic = dataManager.segmentTraffic;
  } catch (error) {
    return res.status(400).json({ type: "error", message: error.message });
  }

  res.status(200).json({ type: "success", segmentTraffic });
});

const syncChains = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);
        console.log("replace chain on a sync with", rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );
};

let PORT = DEFAULT_PORT;

function listen() {
  app
    .listen(PORT, () => {
      console.log(`App listening at port ${PORT}`);
      dataManager.segmentId = `Street${PORT - 3000}`;

      if (PORT != DEFAULT_PORT) {
        syncChains();
      }
    })
    .on("error", err => {
      if (err.errno === "EADDRINUSE") {
        PORT++;
        listen();
      } else {
        console.log(err);
      }
    });
}

listen();
