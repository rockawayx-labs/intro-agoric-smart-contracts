// @ts-check
// @global harden

import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import bundleSource from '@endo/bundle-source';

import { E } from '@endo/eventual-send';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';
import { makeZoeKit } from '@agoric/zoe';

import { makeIssuerKit, AmountMath, AssetKind } from '@agoric/ertp';
import { makeCopyBag } from '@agoric/store';


test('I want to buy an NFT', async (t) => {
    const { admin: fakeVatAdmin } = makeFakeVatAdmin()
    const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

    const helloBundle = await bundleSource('./src/contract-solution.js');
    const helloInstallation = await E(zoe).install(helloBundle)

    t.is(await E(helloInstallation).getBundle(), helloBundle)

    const { issuer: moolaIssuer, mint: moolaMint } = makeIssuerKit('Moola')

    const { publicFacet } =
        await E(zoe).startInstance(helloInstallation, harden({ Tokens: moolaIssuer }), { Moola: moolaIssuer })

    const { makeMintNFTsInvitation, getNFTIssuer } = publicFacet

    // prepare our NFT outside the contract
    const nftIssuer = getNFTIssuer()
    t.deepEqual(nftIssuer.getAllegedName(), 'Awesomez')

    const nftBrand = nftIssuer.getBrand()
    const punk4551 = AmountMath.make(nftBrand, makeCopyBag([["cryptopunk4551", 1n]]))

    const moola100 = AmountMath.make(moolaIssuer.getBrand(), 100n)
    const firstPayment = moolaMint.mintPayment(moola100)
    const nftSeat = await E(zoe).offer(makeMintNFTsInvitation(), harden({
        want: { Awesomez: punk4551 },
        give: { Tokens: moola100 }
    }), { Tokens: firstPayment })

    const nftOfferResult = await E(nftSeat).getOfferResult()
    t.is(nftOfferResult, 'You minted an NFT!')

    const nftPayout = await E(nftSeat).getPayout('Awesomez')
    t.deepEqual(await nftIssuer.getAmountOf(nftPayout), punk4551)

    t.false(await moolaIssuer.isLive(firstPayment))
})

test('I want to buy an NFT for the WRONG currency', async (t) => {
    const { admin: fakeVatAdmin } = makeFakeVatAdmin()
    const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

    const helloBundle = await bundleSource('./src/contract-solution.js');
    const helloInstallation = await E(zoe).install(helloBundle)

    t.is(await E(helloInstallation).getBundle(), helloBundle)

    const { issuer: moolaIssuer } = makeIssuerKit('Moola')

    const { publicFacet } =
        await E(zoe).startInstance(helloInstallation, harden({ Tokens: moolaIssuer }), { Moola: moolaIssuer })

    const { makeMintNFTsInvitation, getNFTIssuer } = publicFacet

    const { issuer: otherIssuer, mint: otherMint } = makeIssuerKit('Other')

    // prepare our NFT outside the contract
    const nftIssuer = getNFTIssuer()
    t.deepEqual(nftIssuer.getAllegedName(), 'Awesomez')
    const nftBrand = nftIssuer.getBrand()
    const punk4551 = AmountMath.make(nftBrand, harden(["cryptopunk4551"]))

    // our FAKE payment
    const other100 = AmountMath.make(otherIssuer.getBrand(), 100n)
    const otherPayment = otherMint.mintPayment(other100)

    try {
        const nftSeat = await E(zoe).offer(makeMintNFTsInvitation(), harden({
            want: { Awesomez: punk4551 },
            give: { Tokens: other100 }
        }), { Tokens: otherPayment })
        t.fail('Payment in Other tokens should not be accepted by contract')
    } catch (e) {
        // pass
    }
})


test('I want to extract profit', async (t) => {
    const { admin: fakeVatAdmin } = makeFakeVatAdmin()
    const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

    const helloBundle = await bundleSource('./src/contract-solution.js');
    const nftMinterInstallation = await E(zoe).install(helloBundle)

    t.is(await E(nftMinterInstallation).getBundle(), helloBundle)

    const { issuer: moolaIssuer, mint: moolaMint } = makeIssuerKit('Moola')

    const { creatorFacet, publicFacet } =
        await E(zoe).startInstance(nftMinterInstallation, harden({ Tokens: moolaIssuer }), { Moola: moolaIssuer })

    const { getBalance, getProfit } = creatorFacet
    const { makeMintNFTsInvitation, getNFTIssuer } = publicFacet

    // prepare the NFT we want to mint
    const nftIssuer = getNFTIssuer()
    t.deepEqual(nftIssuer.getAllegedName(), 'Awesomez')
    const nftBrand = nftIssuer.getBrand()
    const moola100 = AmountMath.make(moolaIssuer.getBrand(), 100n)

    for (let i = 0; i < 5; i++) {
        // we mint the same "NFT" 5 times (sic!)
        const punk4551 = AmountMath.make(nftBrand, makeCopyBag([["cryptopunk4551", 1n]]))

        const firstPayment = moolaMint.mintPayment(moola100)
        const nftSeat = await E(zoe).offer(makeMintNFTsInvitation(), harden({
            want: { Awesomez: punk4551 },
            give: { Tokens: moola100 }
        }), { Tokens: firstPayment })

        const nftOfferResult = await E(nftSeat).getOfferResult()
        t.is(nftOfferResult, 'You minted an NFT!')

        const nftPayout = await E(nftSeat).getPayout('Awesomez')
        t.deepEqual(await nftIssuer.getAmountOf(nftPayout), punk4551)

        t.false(await moolaIssuer.isLive(firstPayment))
    }

    const moola500 = AmountMath.make(moolaIssuer.getBrand(), 500n)
    const contractBalance = getBalance()
    t.deepEqual(moola500, contractBalance)

    const profitSeat = await E(zoe).offer((getProfit()), harden({}))
    t.is('Enjoy your profits!', await E(profitSeat).getOfferResult())

    const profitPayout = await E(profitSeat).getPayout('Tokens')
    t.deepEqual(AmountMath.make(moolaIssuer.getBrand(), 500n), await moolaIssuer.getAmountOf(profitPayout))
})


// Note: our contract does not test whether the Amount set we send in only has one member
// so it's possible to "mint multiple NFTs" (in this setup - as a bonus fix the smart contract to only
// allow minting of one 'NFT' item)
test('I want to mint 2 NFTs for the price of one', async (t) => {
    const { admin: fakeVatAdmin } = makeFakeVatAdmin()
    const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

    const helloBundle = await bundleSource('./src/contract-solution.js');
    const nftMinterInstallation = await E(zoe).install(helloBundle)

    t.is(await E(nftMinterInstallation).getBundle(), helloBundle)

    const { issuer: moolaIssuer, mint: moolaMint } = makeIssuerKit('Moola')

    const { creatorFacet, publicFacet } =
        await E(zoe).startInstance(nftMinterInstallation, harden({ Tokens: moolaIssuer }), { Moola: moolaIssuer })

    const { makeMintNFTsInvitation, getNFTIssuer } = publicFacet
    const { getBalance } = creatorFacet

    // prepare our NFT outside the contract
    const nftIssuer = getNFTIssuer()
    t.deepEqual(nftIssuer.getAllegedName(), 'Awesomez')
    const nftBrand = nftIssuer.getBrand()
    const punk4551 = AmountMath.make(nftBrand, makeCopyBag([["cryptopunk4551", 2n], ["cryptopunk981", 3n]]))

    const moola100 = AmountMath.make(moolaIssuer.getBrand(), 100n)
    const firstPayment = moolaMint.mintPayment(moola100)
    const nftSeat = await E(zoe).offer(makeMintNFTsInvitation(), harden({
        want: { Awesomez: punk4551 },
        give: { Tokens: moola100 }
    }), { Tokens: firstPayment })

    const nftOfferResult = await E(nftSeat).getOfferResult()
    t.is(nftOfferResult, 'You minted an NFT!')

    const balance = getBalance()
    t.deepEqual(moola100, balance)
})