import { readJSONSync } from 'fs-extra';
import findUp from 'find-up';

import { get as getWeb3 } from './configure';

function artifactsDir(buildDir: string): string {
  return `${buildDir}/contracts`;
}

export function load(contract: string): any {
  const buildDir = findUp.sync('build', { type: 'directory' });

  if (!buildDir || !findUp.sync.exists(artifactsDir(buildDir))) {
    throw new Error('Could not find compiled artifacts directory');
  }

  const { abi, bytecode } = readJSONSync(`${artifactsDir(buildDir)}/${contract}.json`, { encoding: 'utf8' });
  return new (getWeb3()).eth.Contract(abi, undefined, { data: bytecode });
}
