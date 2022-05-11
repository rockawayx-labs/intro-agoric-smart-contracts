// @ts-check
// @global harden

import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import bundleSource from '@endo/bundle-source';

import { E } from '@endo/eventual-send';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';
import { makeZoeKit } from '@agoric/zoe';

import { makeIssuerKit, AmountMath, AssetKind } from '@agoric/ertp';

test('deploy contract for testing', async (t) => {
  const { admin: fakeVatAdmin } = makeFakeVatAdmin()
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

  const helloBundle = await bundleSource('./src/contract-solution.js');
  const helloInstallation = await E(zoe).install(helloBundle)

  t.is(await E(helloInstallation).getBundle(), helloBundle)
})


test('just say hello', async (t) => {
  const { admin: fakeVatAdmin } = makeFakeVatAdmin()
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

  const helloBundle = await bundleSource('./src/contract-solution.js');
  const helloInstallation = await E(zoe).install(helloBundle)

  const { creatorFacet } =
    await E(zoe).startInstance(helloInstallation, {})

  const { sayHi } = creatorFacet

  t.is('hi!', sayHi())
})


test('mint me 20 Moola', async (t) => {
  const { admin: fakeVatAdmin } = makeFakeVatAdmin()
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

  const helloBundle = await bundleSource('./src/contract-solution.js');
  const helloInstallation = await E(zoe).install(helloBundle)

  t.is(await E(helloInstallation).getBundle(), helloBundle)

  const { creatorFacet } =
    await E(zoe).startInstance(helloInstallation, {})

  const { makeMintInvitation, getIssuer } = creatorFacet

  const mintInvitation = makeMintInvitation()

  t.truthy((await E(zoe).getInvitationIssuer()).isLive(mintInvitation))
  const issuer = await getIssuer()

  const mintProposal = harden({
    want: { Moola: AmountMath.make(issuer.getBrand(), 20n) }
  })

  const mySeat = await E(zoe).offer(mintInvitation, mintProposal)
  const offerResult = await E(mySeat).getOfferResult()

  t.is(offerResult, 'Here is some moola!')
  const moolaPayout = await E(mySeat).getPayout('Moola')

  const moola20 = AmountMath.make(issuer.getBrand(), 20n)
  t.deepEqual(await issuer.getAmountOf(moolaPayout), moola20)
})

test('mint me 80 moola', async (t) => {
  const { admin: fakeVatAdmin } = makeFakeVatAdmin()
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

  const helloBundle = await bundleSource('./src/contract-solution.js')
  const helloInstallation = await E(zoe).install(helloBundle)

  t.is(await E(helloInstallation).getBundle(), helloBundle)

  const { creatorFacet } = await E(zoe).startInstance(helloInstallation, {})
  const { makeMintSomeInvitation, getIssuer } = creatorFacet

  const mintSomeInvitation = makeMintSomeInvitation()

  const issuer = getIssuer()

  const requestedAmount = AmountMath.make(issuer.getBrand(), 80n)

  const mintProposal = harden({
    want: { Tokens: requestedAmount }
  })
  const mySeat = await E(zoe).offer(mintSomeInvitation, mintProposal)
  const offerResult = await E(mySeat).getOfferResult()

  t.is('Here you go', offerResult)

  const tokensReceived = await E(mySeat).getPayout('Tokens')
  t.deepEqual(requestedAmount, await issuer.getAmountOf(tokensReceived))

  const purse = issuer.makeEmptyPurse()
  purse.deposit(tokensReceived)
  t.deepEqual(requestedAmount, purse.getCurrentAmount())
})


test('mint me 500 moola', async (t) => {
  const { admin: fakeVatAdmin } = makeFakeVatAdmin()
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

  const helloBundle = await bundleSource('./src/contract-solution.js')
  const helloInstallation = await E(zoe).install(helloBundle)

  t.is(await E(helloInstallation).getBundle(), helloBundle)

  const { creatorFacet } = await E(zoe).startInstance(helloInstallation, {})
  const { makeMintSomeInvitation, getIssuer } = creatorFacet

  const mintSomeInvitation = makeMintSomeInvitation()

  const issuer = getIssuer()

  const requestedAmount = AmountMath.make(issuer.getBrand(), 500n)

  const mintProposal = harden({
    want: { Tokens: requestedAmount }
  })
  const mySeat = await E(zoe).offer(mintSomeInvitation, mintProposal)
  const offerResult = await E(mySeat).getOfferResult()

  t.is('You are asking too much', offerResult)

  const tokensReceived = await E(mySeat).getPayout('Tokens')
  t.deepEqual(AmountMath.makeEmpty(issuer.getBrand()), await issuer.getAmountOf(tokensReceived))
})

/*
test('mint me 70 moola', async (t) => {
  const { admin: fakeVatAdmin } = makeFakeVatAdmin()
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

  const helloBundle = await bundleSource('./src/contract-solution.js')
  const helloInstallation = await E(zoe).install(helloBundle)

  t.is(await E(helloInstallation).getBundle(), helloBundle)

  const { creatorFacet } = await E(zoe).startInstance(helloInstallation, {})
  const { flexibleMintOffer, getIssuer } = creatorFacet

  const issuer = await getIssuer()

  const myMintInvitation = flexibleMintOffer(70n)

  t.truthy((await E(zoe).getInvitationIssuer()).isLive(myMintInvitation))

  const mintProposal = harden({
    want: { Moola: AmountMath.make(issuer.getBrand(), 200n) }
  })
  const mySeat = await E(zoe).offer(myMintInvitation, mintProposal)
  const offerResult = await E(mySeat).getOfferResult()

  t.is(offerResult, 'Here is 70 moola for you!')

  const seatPayout = await E(mySeat).getPayout('Moola')

  const expectedPayout = AmountMath.make(issuer.getBrand(), 70n)
  t.deepEqual(await issuer.getAmountOf(seatPayout), expectedPayout)

})
*/