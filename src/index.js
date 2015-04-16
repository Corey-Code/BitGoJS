//
// index.js - Module definition for BitGoJS
//
// Copyright 2014, BitGo, Inc.  All Rights Reserved.
//
var common = require('./common')
bitgo = module.exports;
bitgo.BitGo = require('./bitgo.js'),

/**
 * Set the network, i.e. either "bitcoin" for production with real bitcoin, or
 * "testnet" for development with testnet bitcoin.
 */
bitgo.setNetwork = function(network) {
  common.setNetwork(network);
};

/*
 * Get the network. Returns either "bitcoin" or "testnet".
 */
bitgo.getNetwork = function() {
  return common.getNetwork();
};

bitgo.setNetwork('testnet');
