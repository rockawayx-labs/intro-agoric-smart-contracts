// Eventually will be importable from '@agoric/zoe-contract-support'
import { AssetKind, AmountMath } from '@agoric/ertp'


/**
 * Trade one item for another.
 *
 * The initial offer is { give: { Asset: A }, want: { Price: B } }.
 * The outcome from the first offer is an invitation for the second party,
 * who should offer { give: { Price: B }, want: { Asset: A } }, with a want
 * amount no greater than the original's give, and a give amount at least as
 * large as the original's want.
 *
 * @type {ContractStartFn}
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

  const flexibleMintInvitation = (amount) => {
    if (0 <= amount && amount <= 100n) {
      // @type OfferHandler
      return zcf.makeInvitation((seat) => {
        const moolaAmount = AmountMath.make(moolaBrand, amount)
        moolaMint.mintGains({ Moola: moolaAmount }, seat)
        seat.exit()
        return `Here is ${amount} moola for you!`
      }, 'flexibleMintOffer')
    } else {
      return 'Nope, you are asking too much or too little'
    }
  }

  const creatorFacet = {
    sayHi: () => 'hi!',
    helloInvitation: zcf.makeInvitation(sayHello, 'sayHello'),
    mintInvitation: zcf.makeInvitation(
      mint20Moola,
      'mintOffer',
    ),
    flexibleMintOffer: flexibleMintInvitation,
    getIssuer: () => issuer,
  }

  return harden({ creatorFacet });
};

harden(start);
export { start };