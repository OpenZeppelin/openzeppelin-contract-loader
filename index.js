import web3 from './web3';
import fs from 'fs';

export default function(contract: string) {
  const { abi, bytecode } = JSON.parse(fs.readFileSync(`./build/contracts/${contract}.json`, 'utf8'));
  return new web3.eth.Contract(abi, undefined, { data: bytecode });
}
