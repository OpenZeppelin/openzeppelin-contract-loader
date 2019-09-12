import web3Contract from 'web3/eth/contract';
import fs from 'fs-extra';
import findUp from 'find-up';

export default async function(contract: string) {
  const artifactsDir = await findUp('build/contracts');
  if (!artifactsDir) {
    throw new Error('Could not find compiled artifacts directory');
  }

  const { abi, bytecode } = await fs.readJSON(`${artifactsDir}/${contract}.json`, { encoding: 'utf8' });
  return new web3Contract(abi, undefined, { data: bytecode });
}
