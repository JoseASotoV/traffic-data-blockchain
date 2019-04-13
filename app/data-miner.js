class DataMiner {
  constructor({ blockchain, dataPool, dataManager }) {
    this.blockchain = blockchain;
    this.dataPool = dataPool;
    this.dataManager = dataManager;
  }

  mineData() {
    //get data Pool's data
    const data = this.dataPool.getValidData();

    //add block containing data to the blockchain
    this.blockchain.addBlock({ data });

    //TODO: Broadcast updated blockchain

    //clear the pool
    this.dataPool.clear();
  }
}

module.exports = DataMiner;
