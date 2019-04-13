const bodyParser = require("body-parser");
const express = require("express");
const Blockchain = require("./platform/blockchain");
const DataManager = require("./data_manager");

const app = express();
const blockchain = new Blockchain();

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

const PORT = DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncChains();
  }
});
