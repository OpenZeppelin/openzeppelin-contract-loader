import { readJSONSync } from 'fs-extra';
import findUp from 'find-up';

import tryRequire from 'try-require';

interface LoaderConfig {
  defaultSender: string;
  defaultGas: number;
}

function artifactsDir(buildDir: string): string {
  return `${buildDir}/contracts`;
}

function loadArtifacts(contract: string) {
  const buildDir = findUp.sync('build', { type: 'directory' });

  if (!buildDir || !findUp.sync.exists(artifactsDir(buildDir))) {
    throw new Error('Could not find compiled artifacts directory');
  }

  return readJSONSync(`${artifactsDir(buildDir)}/${contract}.json`, { encoding: 'utf8' });
}

function web3Loader(provider: any, config: LoaderConfig) {
  const { defaultSender, defaultGas } = config;

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

  function fromArtifacts(contract: string) {
    const { abi, bytecode } = loadArtifacts(contract);
    return fromABI(abi, bytecode);
  }

  return { fromABI, fromArtifacts };
}

function truffleLoader(provider: any, config: LoaderConfig) {
  const { defaultSender, defaultGas } = config;

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

  function fromArtifacts(contract: string) {
    const { abi, bytecode } = loadArtifacts(contract);
    return fromABI(abi, bytecode);
  }

  return { fromABI, fromArtifacts };
}

export function setupLoader(provider: any, config: Partial<LoaderConfig>) {
  const configWithDefaults: LoaderConfig = {
    defaultSender: '',
    defaultGas: 8e6,
    ...config,
  };

  return {
    web3: web3Loader(provider, configWithDefaults),
    truffle: truffleLoader(provider, configWithDefaults),
  };
}
