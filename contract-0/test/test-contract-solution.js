import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import { makeIssuerKit, AmountMath, AssetKind } from '@agoric/ertp';


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

test('Non-fungible issuer and AmountMath', async (t) => {
    // AssetKind.SET indicates unique items (like NFTs)
    const nftKit = makeIssuerKit('Awesomez', AssetKind.SET)

    // nftA + nftB = ... ?
    const nftA = AmountMath.make(nftKit.brand, harden(["cryptopunk4551"]))
    const nftB = AmountMath.make(nftKit.brand, harden(["cryptopunk376"]))
    const twoNFTs = AmountMath.add(nftA, nftB)

    // ... equals the set of two NFTs
    t.deepEqual(twoNFTs, AmountMath.make(nftKit.brand, harden(["cryptopunk376", "cryptopunk4551"])))
    t.deepEqual(twoNFTs, AmountMath.make(nftKit.brand, harden(["cryptopunk4551", "cryptopunk376"])))
})
