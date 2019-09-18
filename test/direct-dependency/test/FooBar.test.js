require('@openzeppelin/contract-loader/lib/configure').set(web3);

const { load } = require('@openzeppelin/contract-loader');

const expect = require('chai').expect;

contract('direct-dependency', function([deployer]) {
  describe('project contracts', async function () {
    it('returns a web3 contract abstraction', async function() {
      const Foo = load('Foo');

      const foo = await Foo.deploy().send({ from: deployer, gas: 2e6 });
      expect(await foo.methods.bar().call()).to.be.equal('bar');
    });

    it('throws if the contract does not exist', async function() {
      expect(() => load('Baz')).to.throw();
    });
  });
});
