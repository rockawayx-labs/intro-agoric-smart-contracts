// @ts-check

import { Far } from '@endo/marshal'
import { AssetKind, AmountMath } from '@agoric/ertp'
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js'


/**
 * Example contract that knows how to
 * 1. say Hello nicely
 * 2. invite you to ask it to say hello
 * 3. mint you some tokens!
 */
const start = async (zcf) => {
    // our internal mint for Moolas, only we have access to it
    const moolaMint = await zcf.makeZCFMint('Moola', AssetKind.NAT)
    const { brand: moolaBrand, issuer } = moolaMint.getIssuerRecord()

    const sayHello = (seat) => {
        return 'Hello!'
    }

    const mintMoola = (seat) => {
        assertProposalShape(seat, {
            want: { Tokens: null },
        })
        const { want } = seat.getProposal()
        assert(AmountMath.isGTE(AmountMath.make(moolaBrand, 1000n), want.Tokens), 'You ask too much!')

        moolaMint.mintGains(want, seat)
        seat.exit()
        return 'Here you go'
    }

    // only accessible to the creator who instantiates the contract
    const creatorFacet = Far('creatorFacet', {
        sayHi: () => 'hi!',
        makeHelloInvitation: () => zcf.makeInvitation(sayHello, 'sayHello'),
    })

    // accessible to anyone
    const publicFacet = Far('publicFacet', {
        makeMintInvitation: () => zcf.makeInvitation(mintMoola, 'mintSome'),
        getIssuer: () => issuer,
    })

    // in the solution, we also provide a public Facet that is available
    // to anyone holding a reference to the contract itself. We thus allow anyone to mint themselves money
    // Far() is necessary when we deploy the contract to our local testnet and want to access it from a dApp
    // Docs: https://agoric.com/documentation/guides/js-programming/far.html
    return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };