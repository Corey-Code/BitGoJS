import BaseCoin = require('../baseCoin');
import * as _ from 'lodash';

const algosdk = require('algosdk');

class Algorand extends BaseCoin {

    constructor() {
      super();
    }

    getChain() {
        return "algo";
    }

    getFamily() {
        return "algo";
    }

    getFullName() {
        return 'Algorand';
    }

    getBaseFactor() {
        return 1e6;
    }

    /**
     * Flag for sending value of 0
     * @returns {boolean} True if okay to send 0 value, false otherwise
     */
    valuelessTransferAllowed(): boolean {
        // TODO: this sounds like its true with the staking txes - confirm before launch
        return true;
    }

    /**
     * Assemble keychain and half-sign prebuilt transaction
     *
     * @param params
     * @param params.txPrebuild {Object} prebuild object returned by platform
     * @param params.prv {String} user prv
     */
    signTransaction(params) {
        const { txPrebuild, prv } = params;

        if (_.isUndefined(txPrebuild)) {
            throw new Error('missing txPrebuild parameter');
        }

        if (!_.isObject(txPrebuild)) {
            throw new Error(`txPrebuild must be an object, got type ${typeof txPrebuild}`);
        }

        if (_.isUndefined(prv)) {
            throw new Error('missing prv parameter to sign transaction');
        }

        if (!_.isString(prv)) {
            throw new Error(`prv must be a string, got type ${typeof prv}`);
        }

        const keyPair = stellar.Keypair.fromSecret(prv);
        const tx = new stellar.Transaction(txPrebuild.txBase64);
        
        tx.sign(keyPair);

        return {
        halfSigned: {
            txBase64: tx.toEnvelope().toXDR('base64')
        }
        };
    }

}

export default Algorand;