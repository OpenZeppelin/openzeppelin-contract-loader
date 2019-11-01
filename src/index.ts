import Web3 from 'web3';
import { readJSONSync } from 'fs-extra';
import findUp from 'find-up';

interface Web3ContractLoaderConfig {
  web3Contract: Web3['eth']['Contract'];
  defaultSender: string;
  defaultGas: number;
}

interface TruffleContractLoaderConfig {
  truffleContract: any;
  provider: any;
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

export function web3({ web3Contract, defaultSender = '', defaultGas = 8e6 }: Partial<Web3ContractLoaderConfig>) {
  if (web3Contract === undefined) {
    throw new Error('No web3-eth-contract instance supplied');
  }

  return function(contract: string) {
    const { abi, bytecode } = loadArtifacts(contract);

    return new web3Contract(abi, undefined, { data: bytecode, from: defaultSender, gas: defaultGas });
  };
}

export function truffle({
  truffleContract,
  provider,
  defaultSender = '',
  defaultGas = 8e6,
}: Partial<TruffleContractLoaderConfig>) {
  if (truffleContract === undefined) {
    throw new Error('No @truffle/contract instance supplied');
  }

  if (provider === undefined) {
    throw new Error('No provider supplied');
  }

  return function(contract: string) {
    const { abi, bytecode } = loadArtifacts(contract);

    // eslint-disable-next-line @typescript-eslint/camelcase
    const abstraction = truffleContract({ abi, unlinked_binary: bytecode });
    abstraction.setProvider(provider);
    abstraction.defaults({ from: defaultSender, gas: defaultGas });

    return abstraction;
  };
}
