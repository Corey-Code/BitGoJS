require('should');

const Promise = require('bluebird');
const co = Promise.coroutine;
const _ = require('lodash');
const TestV2BitGo = require('../../../lib/test_bitgo');
const Wallet = require('../../../../src/v2/wallet');
const bitGoUtxoLib = require('bitgo-utxo-lib');

describe('ZEC:', function() {
  let bitgo;

  before(function() {
    bitgo = new TestV2BitGo({ env: 'test' });
    bitgo.initializeTestVars();
  });

  describe('Should test derivation-related functions', () => {

    const keychains = [
      {
        pub: 'xpub661MyMwAqRbcGiQhVk1J7cD1YodF9tc5Y1B8vpTjjB1pcB1J1m1QX8fMtYP2sYqFmW6J2ra69tNoARKjvTGo9cGUrbPbJdjwrSzGGzPzWWS',
        prv: 'xprv9s21ZrQH143K4ELEPiUHkUGGzmnkkRtEAnFY8S48AqUqjNg9UDh9yLLt3FcfATyCjbsMB9JCGHAD8MeBTAK1P7trFppkoswu5ZAsHYASfbk'
      },
      {
        pub: 'xpub661MyMwAqRbcFzLXuganogQvd7MrefQQqCcJP2ZDumnCdQecf5cw1P1nD5qBz8SNS1yCLSC9VqpNUWnQU3V6qmnPt2r21oXhicQFzPA6Lby',
        prv: 'xprv9s21ZrQH143K3WG4of3nSYUC55XNFCgZTyghae9cMSFDkcKU7YJgTahJMpdTY9CjCcjgSo2TJ635uUVx176BufUMBFpieKYVJD9J3VvrGRm'
      },
      {
        pub: 'xpub661MyMwAqRbcFHpwWrzPB61U2CgBmdD21WNVM1JKUn9rEExkoGE4yafUVFbPSd78vdX8tWcEUQWaALFkU9fUbUM4Cc49DKEJSCYGRnbzCym',
        prv: 'xprv9s21ZrQH143K2okUQqTNox4jUAqhNAVAeHStYcthvScsMSdcFiupRnLzdxzfJithak5Zs92FQJeeJ9Jiya63KfUNxawuMZDCp2cGT9cdMKs'
      }
    ];

    let coin;
    let testCoin;
    before(() => {
      coin = bitgo.coin('zec');
      testCoin = bitgo.coin('tzec');
    });

    describe('Should test address generation', () => {

      it('should generate standard non-segwit address', () => {
        const generatedAddress = coin.generateAddress({ keychains });
        const generatedTestAddress = testCoin.generateAddress({ keychains });

        [generatedAddress, generatedTestAddress].map((currentAddress) => {
          currentAddress.chain.should.equal(0);
          currentAddress.index.should.equal(0);
          currentAddress.coinSpecific.outputScript.should.equal('a9141e57a925dd863a86af341037e700862bf66bf7b687');
          currentAddress.coinSpecific.redeemScript.should.equal('5221037acffd52bb7c39a4ac3d4c01af33ce0367afec45347e332edca63a38d1fb2e472102658831a87322b3583515ca8725841335505755ada53ee133c70a6b4b8d3978702102641ee6557561c9038242cafa7f538070d7646a969bcf6169f9950abfcfefd6b853ae');
        });

        generatedAddress.address.should.equal('t3ML4DQcneK887NxcNp2s4dQDgDq8G5XTpD');
        generatedTestAddress.address.should.equal('t29KFG5ivWmjVf5YMJZ2ucFarni4J3NXbWB');
      });

      it('should generate custom chain non-segwit address', () => {
        const generatedAddress = coin.generateAddress({ keychains, chain: 1, index: 113 });
        const generatedTestAddress = testCoin.generateAddress({ keychains, chain: 1, index: 113 });

        [generatedAddress, generatedTestAddress].map((currentAddress) => {
          currentAddress.chain.should.equal(1);
          currentAddress.index.should.equal(113);
          currentAddress.coinSpecific.outputScript.should.equal('a91443457880e5e29555d6ad16bc82ef53891d6512b087');
          currentAddress.coinSpecific.redeemScript.should.equal('522103dc94182103c93690c2bca3fe013c19c956b940645b11b0a752e0e56b156bf4e22103b5f4aa0348bf339400ed7e16c6e960a4a46a1ea4c4cbe21abf6d0403161dc4f22103706ff6b11a8d9e3d63a455788d5d96738929ca642f1f3d8f9acedb689e759f3753ae');
        });

        generatedAddress.address.should.equal('t3QhKRe9BZ7icqppW6sokpdhrSvnWV67N1D');
        generatedTestAddress.address.should.equal('t2CgWUKFKRaKzPXQF2cooNFtVZR1gTM8xxM');
      });

      it('should generate 3/3 non-segwit address', () => {
        const generatedAddress = coin.generateAddress({ keychains, threshold: 3 });
        const generatedTestAddress = testCoin.generateAddress({ keychains, threshold: 3 });

        [generatedAddress, generatedTestAddress].map((currentAddress) => {
          currentAddress.chain.should.equal(0);
          currentAddress.index.should.equal(0);
          currentAddress.coinSpecific.outputScript.should.equal('a91476dce7beb23d0e0d53edf5895716d4c80dce609387');
          currentAddress.coinSpecific.redeemScript.should.equal('5321037acffd52bb7c39a4ac3d4c01af33ce0367afec45347e332edca63a38d1fb2e472102658831a87322b3583515ca8725841335505755ada53ee133c70a6b4b8d3978702102641ee6557561c9038242cafa7f538070d7646a969bcf6169f9950abfcfefd6b853ae');
        });

        generatedAddress.address.should.equal('t3VQ7JHECesyxCxq3m5wf1a5g4D4jweEYrd');
        generatedTestAddress.address.should.equal('t2HPJLxLLXLbKkfQngpwhZCGKAhHuqyqPk4');
      });

      it('should validate pub key', () => {
        const { pub } = coin.keychains().create();
        coin.isValidPub(pub).should.equal(true);
      });
    });

    describe('Should test transaction signing', () => {

      it('should create local prebuild', co(function *() {
        const fundingAddress = 't2CgWUKFKRaKzPXQF2cooNFtVZR1gTM8xxM';
        const fundingRedeemScript = '522103dc94182103c93690c2bca3fe013c19c956b940645b11b0a752e0e56b156bf4e22103b5f4aa0348bf339400ed7e16c6e960a4a46a1ea4c4cbe21abf6d0403161dc4f22103706ff6b11a8d9e3d63a455788d5d96738929ca642f1f3d8f9acedb689e759f3753ae';

        const receiveAddress = 't2HPJLxLLXLbKkfQngpwhZCGKAhHuqyqPk4';
        const unspent = {
          id: '8047839532dcfec617661120e1baa0e3b9135662ac8e1f97561e500d430dccb1:0',
          address: fundingAddress,
          value: 300000000,
          valueString: '300000000',
          blockHeight: 999999999,
          date: '2018-05-20T01:44:13.713Z'
        };
        const [txHash, vout] = unspent.id.split(':');

        const txb = new bitGoUtxoLib.TransactionBuilder(testCoin.network);
        txb.addInput(txHash, parseInt(vout, 16), 0xffffffff);
        txb.addOutput(receiveAddress, unspent.value - 50000);

        const tx = txb.buildIncomplete();
        tx.coin = coin.type;
        tx.overwintered = 1;
        tx.versionGroupId = 0x03C48270;

        const prebuild = {
          txHex: tx.toHex(),
          txInfo: {
            unspents: [
              {
                chain: 1,
                index: 113,
                redeemScript: fundingRedeemScript,
                value: 300000000
              }
            ]
          }
        };

        const wallet = new Wallet(bitgo, testCoin, {});
        const halfSigned = yield wallet.signTransaction({
          txPrebuild: prebuild,
          prv: keychains[0].prv
        });
        const halfSignedTx = bitGoUtxoLib.Transaction.fromHex(halfSigned.txHex, testCoin.network);
        halfSignedTx.network.coin.should.equal('zec');
        halfSignedTx.version.should.equal(bitGoUtxoLib.Transaction.ZCASH_SAPLING_VERSION);
        halfSignedTx.versionGroupId.should.equal(2301567109);
        halfSignedTx.overwintered.should.equal(1);
        halfSignedTx.expiryHeight.should.equal(0);
        halfSigned.txHex.should.equal('0400008085202f8901b1cc0d430d501e56971f8eac625613b9e3a0bae120116617c6fedc329583478000000000b600473044022034c624b44051fd6d3cf665b6117a614c683c918f9b6087d65d7043479bb60c3402205eef0d7032c98902c56a4337c4de7feba44704786fa9d4968af1699e1eede5b80100004c69522103dc94182103c93690c2bca3fe013c19c956b940645b11b0a752e0e56b156bf4e22103b5f4aa0348bf339400ed7e16c6e960a4a46a1ea4c4cbe21abf6d0403161dc4f22103706ff6b11a8d9e3d63a455788d5d96738929ca642f1f3d8f9acedb689e759f3753aeffffffff01b0dfe0110000000017a91476dce7beb23d0e0d53edf5895716d4c80dce60938700000000000000000000000000000000000000');

        const halfSignedPrebuild = _.extend({}, prebuild, halfSigned);
        const fullySigned = yield wallet.signTransaction({
          txPrebuild: halfSignedPrebuild,
          prv: keychains[2].prv,
          isLastSignature: true
        });
        const fullySignedTx = bitGoUtxoLib.Transaction.fromHex(fullySigned.txHex, testCoin.network);
        fullySignedTx.network.coin.should.equal('zec');
        fullySignedTx.version.should.equal(bitGoUtxoLib.Transaction.ZCASH_SAPLING_VERSION);
        fullySignedTx.versionGroupId.should.equal(2301567109);
        fullySignedTx.overwintered.should.equal(1);
        fullySignedTx.expiryHeight.should.equal(0);
        fullySignedTx.getId().should.equal('d16b14e8312661ca7570f587b102610c35e97e87c0668349ea216f9b0173864d');

        fullySigned.txHex.should.equal('0400008085202f8901b1cc0d430d501e56971f8eac625613b9e3a0bae120116617c6fedc329583478000000000fc00473044022034c624b44051fd6d3cf665b6117a614c683c918f9b6087d65d7043479bb60c3402205eef0d7032c98902c56a4337c4de7feba44704786fa9d4968af1699e1eede5b801473044022052df70f6e0e40082382cea9ce4f76347c436f92f56523ca9a2198a45de5145fa0220782f43b17d9013c9a611a027ab139f45c45a0f0e942525aa3e6e63796df1918f014c69522103dc94182103c93690c2bca3fe013c19c956b940645b11b0a752e0e56b156bf4e22103b5f4aa0348bf339400ed7e16c6e960a4a46a1ea4c4cbe21abf6d0403161dc4f22103706ff6b11a8d9e3d63a455788d5d96738929ca642f1f3d8f9acedb689e759f3753aeffffffff01b0dfe0110000000017a91476dce7beb23d0e0d53edf5895716d4c80dce60938700000000000000000000000000000000000000');
      }));
    });
  });
});
