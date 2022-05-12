// Eventually will be importable from '@agoric/zoe-contract-support'
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

    // @type OfferHandler
    const mint20Moola = (seat) => {
        const amount = AmountMath.make(moolaBrand, 20n)
        moolaMint.mintGains({ Moola: amount }, seat);
        seat.exit()
        return 'Here is some moola!'
    }

    const mintSomeMoola = (seat) => {
        assertProposalShape(seat, {
            want: { Tokens: null },
        })
        const { want } = seat.getProposal()
        const amount = want.Tokens
        if (AmountMath.isGTE(amount, AmountMath.make(moolaBrand, 1000n))) {
            seat.fail()
            return 'You are asking too much'
        }
        // FIXME: might have to mint into a special seat and do a zcf.reallocate here?
        moolaMint.mintGains(want, seat)
        seat.exit()
        return 'Here you go'
    }

    const creatorFacet = {
        sayHi: () => 'hi!',
        makeHelloInvitation: () => zcf.makeInvitation(sayHello, 'sayHello'),
        makeMintInvitation: () => zcf.makeInvitation(
            mint20Moola,
            'mintOffer',
        ),
        makeMintSomeInvitation: () => zcf.makeInvitation(mintSomeMoola, 'mintSome'),
        getIssuer: () => issuer,
    }

    return harden({ creatorFacet: Far('creatorFacet', creatorFacet) });
};

harden(start);
export { start };