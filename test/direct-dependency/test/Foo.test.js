const { expect } = require('chai');

contract('direct-dependency', function([sender]) {
  describe('project contracts', async function () {
    describe('web3 contracts', function () {
      context('with no sender and gas configuration', function () {
        const loader = require('@openzeppelin/contract-loader');
        const load = loader.web3({ web3Contract: web3.eth.Contract })

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

        const loader = require('@openzeppelin/contract-loader');
        const load = loader.web3({
          web3Contract: web3.eth.Contract,
          defaultSender: sender,
          defaultGas: gas,
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

        context('with deployed contract', function () {
          beforeEach('deploying', async function () {
            const Foo = load('Foo');
            this.foo = await Foo.deploy().send();
          });

          it('view functions can be called', async function () {
            expect(await this.foo.methods.bar().call()).to.equal('bar');
          });
        });
      });
    });

    describe('truffle contracts', function () {
      context('with no sender and gas configuration', function () {
        const loader = require('@openzeppelin/contract-loader');
        const load = loader.truffle({
          truffleContract: require('@truffle/contract'),
          provider: web3.eth.currentProvider
        });

        it('default sender is not set', async function () {
          const Foo = load('Foo');
          expect(Foo.defaults().from).to.equal('');
        });

        it('default gas is 8 million', async function () {
          const Foo = load('Foo');
          expect(Foo.defaults().gas).to.equal(8e6);
        });

        it('throws if the contract does not exist', async function() {
          expect(() => load('Baz')).to.throw();
        });
      });

      context('with default sender and gas configuration', function () {
        const gas = 5e6;

        const loader = require('@openzeppelin/contract-loader');
        const load = loader.truffle({
          truffleContract: require('@truffle/contract'),
          provider: web3.eth.currentProvider,
          defaultSender: sender,
          defaultGas: gas,
        });

        it('default sender is set', async function () {
          const Foo = load('Foo');
          expect(Foo.defaults().from).to.equal(sender);
        });

        it('default gas is set', async function () {
          const Foo = load('Foo');
          expect(Foo.defaults().gas).to.equal(gas);
        });

        it('throws if the contract does not exist', async function() {
          expect(() => load('Baz')).to.throw();
        });

        context('with deployed contract', function () {
          beforeEach('deploying', async function () {
            const Foo = load('Foo');
            this.foo = await Foo.new();
          });

          it('view functions can be called', async function () {
            expect(await this.foo.bar()).to.equal('bar');
          });
        });
      });
    });
  });
});
