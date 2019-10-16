import Web3 from 'web3';

interface ContractLoaderConfig {
  web3Contract: Web3['eth']['Contract'];
  defaultSender: string;
  defaultGas: number;
}

let config: ContractLoaderConfig | undefined;

export function set({ web3Contract, defaultSender = '', defaultGas = 8e6 }: Partial<ContractLoaderConfig>): void {
  if (web3Contract === undefined) {
    throw new Error('No web3-eth-contract instance supplied');
  }

  config = { web3Contract, defaultSender, defaultGas };
}

export function get(): ContractLoaderConfig {
  if (config !== undefined) {
    return config;
  } else {
    throw new Error('Configuration has not been set');
  }
}
