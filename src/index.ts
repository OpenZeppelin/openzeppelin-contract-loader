import Web3 from 'web3';
import { readJSONSync } from 'fs-extra';
import findUp from 'find-up';

interface ContractLoaderConfig {
  web3Contract: Web3['eth']['Contract'];
  defaultSender: string;
  defaultGas: number;
}

function artifactsDir(buildDir: string): string {
  return `${buildDir}/contracts`;
}

export = function({ web3Contract, defaultSender = '', defaultGas = 8e6 }: Partial<ContractLoaderConfig>) {
  if (web3Contract === undefined) {
    throw new Error('No web3-eth-contract instance supplied');
  }

  return function(contract: string) {
    const buildDir = findUp.sync('build', { type: 'directory' });

    if (!buildDir || !findUp.sync.exists(artifactsDir(buildDir))) {
      throw new Error('Could not find compiled artifacts directory');
    }

    const { abi, bytecode } = readJSONSync(`${artifactsDir(buildDir)}/${contract}.json`, { encoding: 'utf8' });

    return new web3Contract(abi, undefined, { data: bytecode, from: defaultSender, gas: defaultGas });
  };
};
