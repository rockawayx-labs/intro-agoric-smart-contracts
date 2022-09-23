// @ts-check

import '@agoric/zoe/exported.js';

import { Far } from '@endo/marshal';
import { AssetKind, AmountMath } from '@agoric/ertp';
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';

/**
  1. create a mint for Moolas or whatever tokens you want (mints are made using makeZCFMint inside contracts)
  2. create a function sayHello that takes a seat and returns hello, add the invitation to the creatorFacet
  3. create a function that mints any amount of moolas requested up to 1000n and add it to the publicFacet
  4. it's important to ensure we are able to identify the real Moola, export the issuer using a getIssuer() function in the publicFacet

  @type {ContractStartFn}
 */
const start = async (zcf) => {
  // our internal mint for Moolas, only we have access to it
  const moolaMint = await zcf.makeZCFMint('Moola', AssetKind.NAT);
  const { brand: moolaBrand, issuer } = moolaMint.getIssuerRecord();

  const sayHello = (seat) => {
    return 'Hello!';
  };

  const mintMoola = (seat) => {
    assertProposalShape(seat, {
      want: { Tokens: null },
    });
    const { want } = seat.getProposal();
    assert(
      AmountMath.isGTE(AmountMath.make(moolaBrand, 1000n), want.Tokens),
      'You ask too much!',
    );

    moolaMint.mintGains(want, seat);
    seat.exit();
    return 'Here you go';
  };

  // only accessible to the creator who instantiates the contract
  const creatorFacet = Far('creatorFacet', {
    sayHi: () => 'hi!',
    makeHelloInvitation: () => zcf.makeInvitation(sayHello, 'sayHello'),
  });

  // accessible to anyone
  const publicFacet = Far('publicFacet', {
    makeMintInvitation: () => zcf.makeInvitation(mintMoola, 'mintSome'),
    getIssuer: () => issuer,
  });

  // in the solution, we also provide a public Facet that is available
  // to anyone holding a reference to the contract itself. We thus allow anyone to mint themselves money
  // Far() is necessary when we deploy the contract to our local testnet and want to access it from a dApp
  // Docs: https://agoric.com/documentation/guides/js-programming/far.html
  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
