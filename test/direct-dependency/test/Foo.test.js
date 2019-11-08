const { setupLoader } = require('@openzeppelin/contract-loader');
const { expect } = require('chai');

contract('direct-dependency', function([sender]) {
  describe('project contracts', async function () {
    describe('web3 contracts', function () {
      context('with no sender and gas configuration', function () {
        const web3Loader = setupLoader({ provider: web3.eth.currentProvider }).web3;

        it('default sender is not set', async function () {
          const Foo = web3Loader.fromArtifacts('Foo');
          expect(Foo.options.from).to.be.undefined;
        });

        it('default gas is 8 million', async function () {
          const Foo = web3Loader.fromArtifacts('Foo');
          expect(Foo.options.gas).to.equal(8e6);
        });

        it('throws if the contract does not exist', async function() {
          expect(() => web3Loader.fromArtifacts('Baz')).to.throw();
        });
      });

      context('with default sender and gas configuration', function () {
        const gas = 5e6;

        const web3Loader = setupLoader({
          provider: web3.eth.currentProvider,
          defaultSender: sender,
          defaultGas: gas,
        }).web3;

        it('default sender is set', async function () {
          const Foo = web3Loader.fromArtifacts('Foo');
          expect(Foo.options.from).to.equal(sender);
        });

        it('default gas is set', async function () {
          const Foo = web3Loader.fromArtifacts('Foo');
          expect(Foo.options.gas).to.equal(gas);
        });

        it('throws if the contract does not exist', async function() {
          expect(() => web3Loader.fromArtifacts('Baz')).to.throw();
        });

        context('with deployed contract', function () {
          beforeEach('deploying', async function () {
            const Foo = web3Loader.fromArtifacts('Foo');
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
        const truffleLoader = setupLoader({
          provider: web3.eth.currentProvider
        }).truffle;

        it('default sender is not set', async function () {
          const Foo = truffleLoader.fromArtifacts('Foo');
          expect(Foo.defaults().from).to.equal('');
        });

        it('default gas is 8 million', async function () {
          const Foo = truffleLoader.fromArtifacts('Foo');
          expect(Foo.defaults().gas).to.equal(8e6);
        });

        it('throws if the contract does not exist', async function() {
          expect(() => truffleLoader.fromArtifacts('Baz')).to.throw();
        });
      });

      context('with default sender and gas configuration', function () {
        const gas = 5e6;

        const truffleLoader = setupLoader({
          provider: web3.eth.currentProvider,
          defaultSender: sender,
          defaultGas: gas,
        }).truffle;

        it('default sender is set', async function () {
          const Foo = truffleLoader.fromArtifacts('Foo');
          expect(Foo.defaults().from).to.equal(sender);
        });

        it('default gas is set', async function () {
          const Foo = truffleLoader.fromArtifacts('Foo');
          expect(Foo.defaults().gas).to.equal(gas);
        });

        it('throws if the contract does not exist', async function() {
          expect(() => truffleLoader.fromArtifacts('Baz')).to.throw();
        });

        context('with deployed contract', function () {
          beforeEach('deploying', async function () {
            const Foo = truffleLoader.fromArtifacts('Foo');
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
