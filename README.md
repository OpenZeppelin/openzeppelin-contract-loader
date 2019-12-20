# OpenZeppelin Contract Loader

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/contract-loader.svg)](https://www.npmjs.org/package/@openzeppelin/contract-loader)
[![Build Status](https://circleci.com/gh/OpenZeppelin/openzeppelin-contract-loader.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-contract-loader)

**Load contract objects from built artifacts or ABIs.** Includes support for both [web3-eth-contract](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html) and [@truffle/contract](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html) objects.

## Installation

```bash
npm install @openzeppelin/contract-loader
```

You may also need to install `web3-eth-contract` or `@truffle/contract`, depending on which abstractions you want to be able to load.

## Usage

### Basic setup

```javascript
const { setupLoader } = require('@openzeppelin/contract-loader');

const loader = setupLoader({
  provider,      // either a web3 provider or a web3 instance
  defaultSender, // optional
  defaultGas,    // optional, defaults to 8 million
});
```

### Loading web3 contracts

When loading web3 contracts, you will need to either pass a `web3` instance as a `provider`, or install the peer dependency `web3-eth-contract`.

```javascript
const web3Loader = loader.web3;

// Load from artifacts built by the compiler (stored in .json files)
const ERC20 = web3Loader.fromArtifact('ERC20');

// Or load directly from an ABI
const abi = [{ 
  "constant": true, 
  "name": "totalSupply", 
  "outputs": [{"internalType": "uint256", "type": "uint256"}],
  "type": "function"
}];
const ERC20 = web3Loader.fromABI(abi);

// Deploy token
const token = await ERC20.deploy().send();

// Or load from artifact at a specific address
const address = token.options.address;
const theSameToken = web3Loader.fromArtifact('ERC20', address);

// Query blockchain state and send transactions
const balance = await token.methods.balanceOf(sender).call();
await token.methods.transfer(receiver, balance).send({ from: sender });
```

### Loading truffle contracts

When loading truffle contracts, you will need to install the `@truffle/contract` dependency.

```javascript
const truffleLoader = loader.truffle;

// Load from artifacts built by the compiler (stored in .json files)
const ERC20 = truffleLoader.fromArtifact('ERC20');

// Or load directly from an ABI
const abi = [{ 
  "constant": true, 
  "name": "totalSupply", 
  "outputs": [{"internalType": "uint256", "type": "uint256"}],
  "type": "function"
}];
const ERC20 = truffleLoader.fromABI(abi);

// Deploy token
const token = await ERC20.new();

// Query blockchain state and send transactions
const balance = await token.balanceOf(sender);
await token.transfer(receiver, balance, { from: sender });
```
