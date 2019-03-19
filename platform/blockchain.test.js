const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain()", () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  });

  it("contains a `chain` array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  describe("addBlock()", () => {
    it("adds a new block to the chain", () => {
      const newData = "foo bar";
      blockchain.addBlock({ data: newData });

      expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
        newData
      );
    });
  });

  describe("getLastBlock()", () => {
    it("returns the last block of the chain", () => {
      const latestData = "latest data";
      blockchain.addBlock({ data: latestData });

      expect(blockchain.getLastBlock().data).toEqual(latestData);
    });
  });

  describe("isValidChain()", () => {
    describe("when the chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Dwarves" });
        blockchain.addBlock({ data: "Orcs" });
        blockchain.addBlock({ data: "Elves" });
      });

      describe("and a `lastHash` reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lstHash";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "evil-data";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains all valid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });
});
