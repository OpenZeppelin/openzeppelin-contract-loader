const { setupLoader } = require('@openzeppelin/contract-loader');

const chai = require('chai');
chai.use(require('chai-bn')(web3.utils.BN));

const { expect } = chai;

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

      await this.foo.methods.set('42').send();
      expect(await foo.methods.value().call()).to.equal('42');
    });
  });
}

function testTruffleLoaderWithDefaults(loader) {
  it('throws if the contract does not exist', async function() {
    expect(() => loader.fromArtifact('Baz')).to.throw();
  });

  context('with deployed contract', function() {
    beforeEach('deploying', async function() {
      const Foo = loader.fromArtifact('Foo');
      this.foo = await Foo.new();
    });

    it('can call view functions', async function() {
      expect(await this.foo.bar()).to.equal('bar');
    });

    it('can send transactions', async function() {
      await this.foo.set('10');
      expect(await this.foo.value()).to.bignumber.equal('10');
    });

    it('loads contract given its address', async function () {
      const foo = loader.fromArtifact('Foo', this.foo.address);

      await this.foo.set('42');
      expect(await foo.value()).to.bignumber.equal('42');
    });
  });
}

contract('direct-dependency', function([defaultSender]) {
  const defaultGas = 5e6;

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
          defaultSender,
          defaultGas,
        }).web3;

        it('default sender is set', async function() {
          const Foo = web3Loader.fromArtifact('Foo');
          expect(Foo.options.from).to.equal(defaultSender);
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
          defaultSender,
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
          defaultSender,
          defaultGas,
        }).truffle;

        it('default sender is set', async function() {
          const Foo = truffleLoader.fromArtifact('Foo');
          expect(Foo.defaults().from).to.equal(defaultSender);
        });

        it('default gas is set', async function() {
          const Foo = truffleLoader.fromArtifact('Foo');
          expect(Foo.defaults().gas).to.equal(defaultGas);
        });

        testTruffleLoaderWithDefaults(truffleLoader);
      });

      context('with web3 object and defaults', function () {
        const truffleLoader = setupLoader({
          provider: web3,
          defaultSender,
          defaultGas
        }).truffle;

        testTruffleLoaderWithDefaults(truffleLoader);
      });
    });
  });
});
