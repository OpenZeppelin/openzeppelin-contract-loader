let web3: any;

export function set(_web3: any): void {
  web3 = _web3;
}

export function get(): any {
  return web3;
}
