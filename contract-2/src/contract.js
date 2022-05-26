import { AmountMath, AssetKind } from "@agoric/ertp";
import { assertProposalShape } from "@agoric/zoe/src/contractSupport";

const start = async (zcf) => {

    const { Tokens: moolaIssuer } = zcf.getTerms()
    const moolaBrand = moolaIssuer.getBrand()

    const nftMint = await zcf.makeZCFMint('Awesomez', AssetKind.SET)
    const { issuer: nftIssuer } = nftMint.getIssuerRecord()

    // 1. write a mintNFTs function
    // 2. BONUS: write a getBalance function which returns the current profit
    // 3. BONUS: write a getProfit function which extracts the profit to the creator

    const { zcfSeat: nftSeat } = zcf.makeEmptySeatKit()

    const nftHandler = (seat) => {
        assertProposalShape(seat, {
            give: { Tokens: null },
            want: { Awesomez: null }
        })

        const { give, want } = seat.getProposal()
        const minMoola = AmountMath.make(moolaBrand, 100n)

        assert(AmountMath.isGTE(give.Tokens, minMoola), 'Not enough moola, sorry.')

        nftMint.mintGains(want, nftSeat)

        nftSeat.incrementBy(seat.decrementBy(give))
        seat.incrementBy(nftSeat.decrementBy(want))
        zcf.reallocate(nftSeat, seat)

        seat.exit()
        return 'Here is your NFT!'
    }

    const publicFacet = {
        getNFTIssuer: () => nftIssuer,
        makeMintInvitation: () => zcf.makeInvitation(nftHandler, 'nftHandler')
    }

    return harden({ publicFacet });
};

harden(start);
export { start };