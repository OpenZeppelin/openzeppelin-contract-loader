# OpenZeppelin Contract Loader

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/contract-loader.svg)](https://www.npmjs.org/package/@openzeppelin/contract-loader)
[![Build Status](https://travis-ci.com/OpenZeppelin/openzeppelin-contract-loader.svg?branch=master)](https://travis-ci.com/OpenZeppelin/openzeppelin-contract-loader)

**Load contract ABIs from built artifacts and return web3-eth-contract objects**.

## Installation

```bash
npm install --save-dev @openzeppelin/contract-loader
```

## Usage

```javascript
require('@openzeppelin/contract-loader/lib/configure').set({ web3Contract: web3.eth.Contract });
const { load } = require('@openzeppelin/contract-loader');

const ERC20 = load('ERC20');

const balance = await ERC20.methods.balanceOf(sender).call();
await ERC20.methods.transfer(receiver, balance).send({ from: sender });
```
