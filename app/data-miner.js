class DataMiner {
  constructor({ blockchain, dataPool, dataManager, pubsub }) {
    this.blockchain = blockchain;
    this.dataPool = dataPool;
    this.dataManager = dataManager;
    this.pubsub = pubsub;
  }

  mineData() {
    //get data Pool's data
    const data = this.dataPool.getValidData();

    //add block containing data to the blockchain
    this.blockchain.addBlock({ data });

    //TODO: Broadcast updated blockchain
    this.pubsub.broadcastChain();

    //clear the pool
    this.dataPool.clear();
  }
}

module.exports = DataMiner;
