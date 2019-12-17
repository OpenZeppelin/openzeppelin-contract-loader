const { setupLoader } = require('@openzeppelin/contract-loader');
const { expect } = require('chai');

function testWeb3LoaderWithDefaults(loader) {
  it('throws if the contract does not exist', async function() {
    expect(() => loader.fromArtifact('Baz')).to.throw();
  });

  context('with deployed contract', function() {
    beforeEach('deploying', async function() {
      const Foo = loader.fromArtifact('Foo');
      this.foo = await Foo.deploy().send();
    });

    it('can call view functions', async function() {
      expect(await this.foo.methods.bar().call()).to.equal('bar');
    });

    it('can send transactions', async function() {
      await this.foo.methods.set('10').send();
      expect(await this.foo.methods.value().call()).to.equal('10');
    });

    it('loads contract given its address', async function () {
      const foo = loader.fromArtifact('Foo', this.foo.options.address);
      expect(await foo.methods.bar().call()).to.equal('bar');
    });
  });
}

const defaultGas = 5e6;

contract('direct-dependency', function([sender]) {
  describe('project contracts', async function() {
    describe('web3 contracts', function() {
      context('with no sender and gas configuration', function() {
        const web3Loader = setupLoader({ provider: web3.eth.currentProvider }).web3;

        it('default sender is not set', async function() {
          const Foo = web3Loader.fromArtifact('Foo');
          expect(Foo.options.from).to.be.undefined;
        });

        it('default gas is 8 million', async function() {
          const Foo = web3Loader.fromArtifact('Foo');
          expect(Foo.options.gas).to.equal(8e6);
        });

        it('throws if the contract does not exist', async function() {
          expect(() => web3Loader.fromArtifact('Baz')).to.throw();
        });
      });

      context('with default sender and gas configuration', function() {
        const web3Loader = setupLoader({
          provider: web3.eth.currentProvider,
          defaultSender: sender,
          defaultGas,
        }).web3;

        it('default sender is set', async function() {
          const Foo = web3Loader.fromArtifact('Foo');
          expect(Foo.options.from).to.equal(sender);
        });
      
        it('default gas is set', async function() {
          const Foo = web3Loader.fromArtifact('Foo');
          expect(Foo.options.gas).to.equal(defaultGas);
        });

        testWeb3LoaderWithDefaults(web3Loader);
      });

      context('with web3 object and defaults', function () {
        const web3Loader = setupLoader({ 
          provider: web3,
          defaultSender: sender,
          defaultGas
         }).web3;

         testWeb3LoaderWithDefaults(web3Loader);
      });
    });

    describe('truffle contracts', function() {
      context('with no sender and gas configuration', function() {
        const truffleLoader = setupLoader({
          provider: web3.eth.currentProvider,
        }).truffle;

        it('default sender is not set', async function() {
          const Foo = truffleLoader.fromArtifact('Foo');
          expect(Foo.defaults().from).to.be.undefined;
        });

        it('default gas is 8 million', async function() {
          const Foo = truffleLoader.fromArtifact('Foo');
          expect(Foo.defaults().gas).to.equal(8e6);
        });

        it('throws if the contract does not exist', async function() {
          expect(() => truffleLoader.fromArtifact('Baz')).to.throw();
        });
      });

      context('with default sender and gas configuration', function() {
        const truffleLoader = setupLoader({
          provider: web3.eth.currentProvider,
          defaultSender: sender,
          defaultGas,
        }).truffle;

        it('default sender is set', async function() {
          const Foo = truffleLoader.fromArtifact('Foo');
          expect(Foo.defaults().from).to.equal(sender);
        });

        it('default gas is set', async function() {
          const Foo = truffleLoader.fromArtifact('Foo');
          expect(Foo.defaults().gas).to.equal(defaultGas);
        });

        it('throws if the contract does not exist', async function() {
          expect(() => truffleLoader.fromArtifact('Baz')).to.throw();
        });

        context('with deployed contract', function() {
          beforeEach('deploying', async function() {
            const Foo = truffleLoader.fromArtifact('Foo');
            this.foo = await Foo.new();
          });

          it('view functions can be called', async function() {
            expect(await this.foo.bar()).to.equal('bar');
          });

          it('loads contract given its address', async function () {
            const foo = truffleLoader.fromArtifact('Foo', this.foo.address);
            expect(await foo.bar()).to.equal('bar');
          });
        });
      });
    });
  });
});
