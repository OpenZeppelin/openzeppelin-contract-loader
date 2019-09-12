import web3Contract from 'web3/eth/contract';
import fs from 'fs';

export default function(contract: string) {
  const { abi, bytecode } = JSON.parse(fs.readFileSync(`./build/contracts/${contract}.json`, 'utf8'));
  return new web3Contract(abi, undefined, { data: bytecode });
}
