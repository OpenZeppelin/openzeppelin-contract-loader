const { load } = require('@openzeppelin/contract-loader');

const { expect } = require('chai');

contract('direct-dependency', function([sender]) {
  describe('project contracts', async function () {
    context('with no sender and gas configuration', function () {
      before(async function () {
        require('@openzeppelin/contract-loader/lib/configure').set({ web3EthContract: web3.eth.Contract });
      });

      it('default sender is not set', async function () {
        const Foo = load('Foo');
        expect(Foo.options.from).to.be.undefined;
      });

      it('default gas is 8 million', async function () {
        const Foo = load('Foo');
        expect(Foo.options.gas).to.equal(8e6);
      });

      it('throws if the contract does not exist', async function() {
        expect(() => load('Baz')).to.throw();
      });
    });

    context('with default sender and gas configuration', function () {
      const gas = 5e6;

      before(async function () {
        require('@openzeppelin/contract-loader/lib/configure').set({
          web3EthContract: web3.eth.Contract,
          defaultSender: sender,
          gas
        });
      });

      it('default sender is set', async function () {
        const Foo = load('Foo');
        expect(Foo.options.from).to.equal(sender);
      });

      it('default gas is set', async function () {
        const Foo = load('Foo');
        expect(Foo.options.gas).to.equal(gas);
      });

      it('throws if the contract does not exist', async function() {
        expect(() => load('Baz')).to.throw();
      });
    });
  });
});
