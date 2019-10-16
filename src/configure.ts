import Web3 from 'web3';

interface ContractLoaderConfig {
  web3EthContract: Web3['eth']['Contract'];
  defaultSender: string;
  gas: number;
}

let config: ContractLoaderConfig | undefined;

export function set({ web3EthContract, defaultSender = '', gas = 8e6 }: Partial<ContractLoaderConfig>): void {
  if (web3EthContract === undefined) {
    throw new Error('No web3-eth-contract instance supplied');
  }

  config = { web3EthContract, defaultSender, gas };
}

export function get(): ContractLoaderConfig {
  if (config !== undefined) {
    return config;
  } else {
    throw new Error('Configuration has not been set');
  }
}
