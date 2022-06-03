// @ts-check
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import { makeIssuerKit, AmountMath, AssetKind } from '@agoric/ertp';
import { makeCopyBag } from '@agoric/store'


test('issuers, amounts, payments', async (t) => {
    // an Issuer kit: brand, issuer, mint
    const moolaKit = makeIssuerKit('Moola', AssetKind.NAT)
    // amount has no value, it's a description of value
    const moola20 = AmountMath.make(moolaKit.brand, 20n)
    // payment created by mint
    const moola20Payment = moolaKit.mint.mintPayment(moola20)

    // the payment amount is exactly what we asked
    t.deepEqual(moola20, await moolaKit.issuer.getAmountOf(moola20Payment))
})

test('payments and purses', async (t) => {
    // kit: brand, issuer, mint
    const moolaKit = makeIssuerKit('Moola', AssetKind.NAT)
    // amount has no value, it's a description of value
    const moola20 = AmountMath.make(moolaKit.brand, 20n)
    // payment created by mint
    const moola20Payment = moolaKit.mint.mintPayment(moola20)

    // the issuer is able to create an empty purse of the right type
    const purse = moolaKit.issuer.makeEmptyPurse()
    // deposit payment into purse
    purse.deposit(moola20Payment)

    t.deepEqual(purse.getCurrentAmount(), moola20)

    // oops, can't deposit the payment twice!
    try {
        purse.deposit(moola20Payment)
        t.fail('purse deposit must throw!')
    } catch (e) {
        // test passes
    }
})

test('Fungible issuer and AmountMath', async (t) => {
    // AssetKind.NAT indicates fungible tokens with natural number values
    const moolaKit = makeIssuerKit('Moola', AssetKind.NAT)

    // 20 + 30
    const moola20 = AmountMath.make(moolaKit.brand, 20n)
    const moola30 = AmountMath.make(moolaKit.brand, 30n)

    // = 50
    const moola50 = AmountMath.make(moolaKit.brand, 50n)
    t.deepEqual(moola50, AmountMath.add(moola20, moola30))

})

// Note: there are other kinds of assets, like AssetKind.SET or AssetKind.COPY_SET but they
// are likely to be deprecated.

test('Semi-fungible issuer and AmountMath - adding', async (t) => {
    // AssetKind.COPY_BAG is a kind of asset that can have multiple types and each of those types can have an amount.
    const nftKit = makeIssuerKit('Awesomez', AssetKind.COPY_BAG)

    // nftA + nftB = ... ?
    const nftA = AmountMath.make(nftKit.brand, makeCopyBag([["cryptopunk4551", 1n]]))
    const nftB = AmountMath.make(nftKit.brand, makeCopyBag([["cryptopunk376", 2n]]))
    const twoNFTs = AmountMath.add(nftA, nftB)

    // ... equals the set of two NFTs
    t.deepEqual(twoNFTs, AmountMath.make(nftKit.brand, makeCopyBag([["cryptopunk4551", 1n], ["cryptopunk376", 2n]])))
    t.deepEqual(twoNFTs, AmountMath.make(nftKit.brand, makeCopyBag([["cryptopunk376", 2n], ["cryptopunk4551", 1n]])))
})

test('Depositing Semi-fungible assets to a purse', async (t) => {
    // AssetKind.COPY_BAG is a kind of asset that can have multiple types and each of those types can have an amount.
    const nftKit = makeIssuerKit('Awesomez', AssetKind.COPY_BAG)

    const nftA = AmountMath.make(nftKit.brand, makeCopyBag([["cryptopunk4551", 3n]]))
    const nftB = AmountMath.make(nftKit.brand, makeCopyBag([["cryptopunk376", 4n]]))

    const purse = nftKit.issuer.makeEmptyPurse()

    purse.deposit(nftKit.mint.mintPayment(nftA))
    t.deepEqual(purse.getCurrentAmount(), nftA)

    purse.deposit(nftKit.mint.mintPayment(nftB))

    const expectedAmount = AmountMath.make(nftKit.brand, makeCopyBag([["cryptopunk4551", 3n], ["cryptopunk376", 4n]]))
    t.deepEqual(purse.getCurrentAmount(), expectedAmount)
})


test('Create Amount that is 5x another amount for AssetKind nat', async (t) => {
    // kit: brand, issuer, mint
    const moolaKit = makeIssuerKit('Moola', AssetKind.NAT)
    // amount has no value, it's a description of value
    const moola20 = AmountMath.make(moolaKit.brand, 20n)
    const moola16 = AmountMath.make(moolaKit.brand, 16n)
    const moola100 = AmountMath.make(moolaKit.brand, 100n)

    const moola100Maybe = AmountMath.make(moolaKit.brand, 5n * moola20.value)
    t.deepEqual(moola100, moola100Maybe)

    const moola20Maybe = AmountMath.make(moolaKit.brand, moola100.value / 5n)
    t.deepEqual(moola20, moola20Maybe)

    const moola16Maybe = AmountMath.make(moolaKit.brand, moola100.value / 6n)
    t.deepEqual(moola16, moola16Maybe)
})