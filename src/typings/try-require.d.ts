declare module 'try-require' {
  function tryRequire(module: string): any | undefined;

  export = tryRequire;
}
