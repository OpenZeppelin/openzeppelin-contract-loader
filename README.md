# OpenZeppelin Contract Loader

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/contract-loader.svg)](https://www.npmjs.org/package/@openzeppelin/contract-loader)
[![Build Status](https://circleci.com/gh/OpenZeppelin/openzeppelin-contract-loader.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-contract-loader)

**Load contract ABIs from built artifacts.** Includes support for both web3-eth-contract and @truffle/contract objects.

## Installation

```bash
npm install --save-dev @openzeppelin/contract-loader
```

## Usage

### web3 contracts

```javascript
const loader = require('@openzeppelin/contract-loader')
const load = loader.web3({
  web3Contract: web3.eth.Contract,
  defaultSender, // optional
  defaultGas,    // optional - defaults to 8 million
});

// Load artifacts
const ERC20 = load('ERC20');

// Deploy token
const token = await ERC20.deploy().send();

// Query blockchain state and send transactions
const balance = await token.methods.balanceOf(sender).call();
await token.methods.transfer(receiver, balance).send({ from: sender });
```

### truffle contracts

```javascript
const loader = require('@openzeppelin/contract-loader')
const load = loader.truffle({
  truffleContract: require('@truffle/contract'),
  provider: web3.eth.currentProvider,
  defaultSender, // optional
  defaultGas,    // optional - defaults to 8 million
});

// Load artifacts
const ERC20 = load('ERC20');

// Deploy token
const token = await ERC20.new();

// Query blockchain state and send transactions
const balance = await token.balanceOf(sender);
await token.transfer(receiver, balance, { from: sender });
```
