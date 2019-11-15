import { readJSONSync } from 'fs-extra';
import findUp from 'find-up';

import tryRequire from 'try-require';

interface LoaderConfig {
  provider: any;
  defaultSender: string;
  defaultGas: number;
}

function artifactsDir(buildDir: string): string {
  return `${buildDir}/contracts`;
}

function loadArtifact(contract: string) {
  const buildDir = findUp.sync('build', { type: 'directory' });

  if (!buildDir || !findUp.sync.exists(artifactsDir(buildDir))) {
    throw new Error('Could not find compiled artifacts directory');
  }

  return readJSONSync(`${artifactsDir(buildDir)}/${contract}.json`, { encoding: 'utf8' });
}

function web3Loader(provider: any, defaultSender: string, defaultGas: number) {
  const web3Contract = tryRequire('web3-eth-contract');
  if (web3Contract === undefined) {
    throw new Error(
      "Could not load package 'web3-eth-contract'. Please install it alongisde @openzeppelin/contract-loader.",
    );
  }

  web3Contract.setProvider(provider);

  function fromABI(abi: object, bytecode = '') {
    // eslint-disable-next-line @typescript-eslint/camelcase
    return new web3Contract(abi, undefined, { data: bytecode, from: defaultSender, gas: defaultGas });
  }

  function fromArtifact(contract: string) {
    const { abi, bytecode } = loadArtifact(contract);
    return fromABI(abi, bytecode);
  }

  return { fromABI, fromArtifact };
}

function truffleLoader(provider: any, defaultSender: string, defaultGas: number) {
  const truffleContract = tryRequire('@truffle/contract');
  if (truffleContract === undefined) {
    throw new Error(
      "Could not load package '@truffle/contract'. Please install it alongisde @openzeppelin/contract-loader.",
    );
  }

  function fromABI(abi: object, bytecode = '') {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const abstraction = truffleContract({ abi, unlinked_binary: bytecode });
    abstraction.setProvider(provider);
    abstraction.defaults({ from: defaultSender, gas: defaultGas });

    return abstraction;
  }

  function fromArtifact(contract: string) {
    const { abi, bytecode } = loadArtifact(contract);
    return fromABI(abi, bytecode);
  }

  return { fromABI, fromArtifact };
}

export function setupLoader({ provider, defaultSender = '', defaultGas = 8e6 }: LoaderConfig) {
  return {
    web3: web3Loader(provider, defaultSender, defaultGas),
    truffle: truffleLoader(provider, defaultSender, defaultGas),
  };
}
