import { readJSONSync } from 'fs-extra';
import findUp from 'find-up';
import tryRequire from 'try-require';
import { join } from 'path';

interface LoaderConfig {
  provider: any;
  defaultSender: string;
  defaultGas: number;
}

interface Loader {
  fromABI(abi: object, bytecode?: string, address?: string): any;
  fromArtifact(name: string, address?: string): any;
}

function localArtifactPath(contract: string): string {
  const buildDir = findUp.sync('build/contracts', { type: 'directory' });
  if (!buildDir) {
    throw new Error('Could not find local "build/contracts" directory');
  }
  return join(buildDir, `${contract}.json`);
}

function dependencyArtifactPath(contractWithDependency: string): string {
  const fragments = contractWithDependency.split('/');
  const contract = fragments.pop();
  const dependency = fragments.join('/');
  try {
    return require.resolve(`${dependency}/build/contracts/${contract}.json`);
  } catch (err) {
    throw new Error(`Cannot find contract  ${contractWithDependency}: ${err.message}`);
  }
}

function loadArtifact(contract: string): any {
  const artifactPath = contract.includes('/') ? dependencyArtifactPath : localArtifactPath;

  return readJSONSync(artifactPath(contract), { encoding: 'utf8' });
}

abstract class BaseLoader implements Loader {
  web3?: any;
  provider: any;
  defaultSender: string;
  defaultGas: number;

  constructor(providerOrWeb3: any, defaultSender: string, defaultGas: number) {
    if (providerOrWeb3.currentProvider) {
      this.provider = providerOrWeb3.currentProvider;
      this.web3 = providerOrWeb3;
    } else {
      this.provider = providerOrWeb3;
    }

    this.defaultSender = defaultSender;
    this.defaultGas = defaultGas;
  }

  public fromArtifact(contract: string, address?: string): any {
    const { abi, bytecode } = loadArtifact(contract);
    return this.fromABI(abi, bytecode, address);
  }

  public abstract fromABI(abi: object, bytecode?: string, address?: string): any;
}

export class Web3Loader extends BaseLoader {
  private _web3Contract: any;

  public fromABI(abi: object, bytecode?: string, address?: string): any {
    return new this.web3Contract(abi, address, { data: bytecode, from: this.defaultSender, gas: this.defaultGas });
  }

  protected get web3Contract(): any {
    if (this._web3Contract === undefined) {
      // If we only have a web3 provider, then we need to require web3-eth-contract
      if (this.web3 === undefined) {
        const lib = tryRequire('web3-eth-contract');
        if (lib === undefined) {
          throw new Error(
            "Could not load package 'web3-eth-contract'. Please install it alongisde @openzeppelin/contract-loader.",
          );
        }
        lib.setProvider(this.provider);
        this._web3Contract = lib;
      }
      // Otherwise, we can use the web3.eth.Contract directly, and not require any extra deps
      else {
        this._web3Contract = this.web3.eth.Contract;
      }
    }

    return this._web3Contract;
  }
}

export class TruffleLoader extends BaseLoader {
  private _truffleContract: any;

  public fromABI(abi: object, bytecode?: string, address?: string) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const abstraction = this.truffleContract({ abi, unlinked_binary: bytecode });
    abstraction.setProvider(this.provider);
    abstraction.defaults({ from: this.defaultSender, gas: this.defaultGas });

    if (address !== undefined) return new abstraction(address);
    return abstraction;
  }

  protected get truffleContract(): any {
    if (this._truffleContract === undefined) {
      const lib = tryRequire('@truffle/contract');
      if (lib === undefined) {
        throw new Error(
          "Could not load package '@truffle/contract'. Please install it alongisde @openzeppelin/contract-loader.",
        );
      }
      this._truffleContract = lib;
    }
    return this._truffleContract;
  }
}

export function setupLoader({
  provider,
  defaultSender,
  defaultGas = 8e6,
}: {
  provider: any;
  defaultSender: string;
  defaultGas: number;
}) {
  return {
    web3: new Web3Loader(provider, defaultSender, defaultGas),
    truffle: new TruffleLoader(provider, defaultSender, defaultGas),
  };
}
