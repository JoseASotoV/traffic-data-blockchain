const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  SEGMENT_STATUS: "SEGMENT_STATUS"
};

class PubSub {
  constructor({ blockchain, dataPool }) {
    this.blockchain = blockchain;
    this.dataPool = dataPool;

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscribeToChannels();

    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }

  handleMessage(channel, message) {
    const parsedMessage = JSON.parse(message);

    console.log(
      `received message with Channel: ${channel} and Message: ${message}`
    );

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, () => {
          this.dataPool.clear();
        });
        break;
      case CHANNELS.SEGMENT_STATUS:
        this.dataPool.setSegmentStatus({ segmentStatus: parsedMessage });
        break;
      default:
        console.log("channel not supported:" + channel);
        return;
    }
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    });
  }

  publish({ channel, message }) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }
  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  broadcastSegmentStatus(segmentStatus) {
    this.publish({
      channel: CHANNELS.SEGMENT_STATUS,
      message: JSON.stringify(segmentStatus)
    });
  }
}

module.exports = PubSub;
