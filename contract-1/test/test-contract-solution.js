// @ts-check
// @global harden

import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import bundleSource from '@endo/bundle-source';

import { E } from '@endo/eventual-send';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';
import { makeZoeKit } from '@agoric/zoe';

import { AmountMath } from '@agoric/ertp';

// check if our installation bundle is what is indeed installed
test('deploy contract for testing', async (t) => {
  const { admin: fakeVatAdmin } = makeFakeVatAdmin()
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

  const helloBundle = await bundleSource('./src/contract-solution.js');
  const helloInstallation = await E(zoe).install(helloBundle)

  t.is(await E(helloInstallation).getBundle(), helloBundle)
})


// 1. write a sayHi function which returns 'hi!' into the contract.js file
// 2. install the contract as above
// 3. instantiate the contract using startInstance
// 4. extract the sayHi function test from the creatorFacet
// 5. call the function and verify the returned value is 'hi!' using t.is
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


// 1. write a sayHello function as an offer handler in contract.js, return an invitation in creatorFacet
// 2. install the contract as above
// 3. instantiate the contract using startInstance
// 4. extract the inviteHello function test from the creatorFacet
// 5. use the invitation by sending an (empty) offer to the contract
// 6. the contract should reply by saying 'Hello!', use getOfferResult to check this
test('mint me 80 moola', async (t) => {
  const { admin: fakeVatAdmin } = makeFakeVatAdmin()
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

  const helloBundle = await bundleSource('./src/contract-solution.js')
  const helloInstallation = await E(zoe).install(helloBundle)

  t.is(await E(helloInstallation).getBundle(), helloBundle)

  const { creatorFacet } = await E(zoe).startInstance(helloInstallation, {})
  const { makeMintInvitation, getIssuer } = creatorFacet

  const mintSomeInvitation = makeMintInvitation()

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


// repeat previous exercise to check that the contract refuses to mint the amount and a zero payment is extracted
test('mint me 5000 moola', async (t) => {
  const { admin: fakeVatAdmin } = makeFakeVatAdmin()
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)

  const helloBundle = await bundleSource('./src/contract-solution.js')
  const helloInstallation = await E(zoe).install(helloBundle)

  t.is(await E(helloInstallation).getBundle(), helloBundle)

  const { creatorFacet } = await E(zoe).startInstance(helloInstallation, {})
  const { makeMintInvitation, getIssuer } = creatorFacet

  const mintSomeInvitation = makeMintInvitation()

  const issuer = getIssuer()

  const requestedAmount = AmountMath.make(issuer.getBrand(), 5000n)

  const mintProposal = harden({
    want: { Tokens: requestedAmount }
  })
  const mySeat = await E(zoe).offer(mintSomeInvitation, mintProposal)

  const offerResult = await E(mySeat).getOfferResult()
  t.is('You are asking too much', offerResult)

  const tokensReceived = await E(mySeat).getPayout('Tokens')
  t.deepEqual(AmountMath.makeEmpty(issuer.getBrand()), await issuer.getAmountOf(tokensReceived))
})
