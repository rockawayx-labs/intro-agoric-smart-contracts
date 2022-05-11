// @ts-check
// @global harden

import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import bundleSource from '@endo/bundle-source';

import { E } from '@endo/eventual-send';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';
import { makeZoeKit } from '@agoric/zoe';

import { makeIssuerKit, AmountMath, AssetKind } from '@agoric/ertp';

/* Standard boilerplate to deploy a contract on a Zoe unit test harness:
* const { admin: fakeVatAdmin } = makeFakeVatAdmin()
* const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)
* const helloBundle = await bundleSource('./src/contract.js');
* const helloInstallation = await E(zoe).install(helloBundle)
*/


test('deploy contract for testing', async (t) => {
  // check if our installation bundle is what is indeed installed
})


test('just say hello', async (t) => {
  // 1. write a sayHi function which returns 'hi!' into the contract.js file
  // 2. install the contract as above
  // 3. instantiate the contract using startInstance
  // 4. extract the sayHi function test from the creatorFacet
  // 5. call the function and verify the returned value is 'hi!' using t.is
})


test('I invite you to say hello', async (t) => {
  // 1. write a sayHello function as an offer handler in contract.js, return an invitation in creatorFacet
  // 2. install the contract as above
  // 3. instantiate the contract using startInstance
  // 4. extract the inviteHello function test from the creatorFacet
  // 5. use the invitation by sending an (empty) offer to the contract
  // 6. the contract should reply by saying 'Hello!', use getOfferResult to check this
})


test('mint me 20 Moola', async (t) => {
  // 1. write a function that mints 20 moola in the contract.js code add an invitation to the creatorFacet
  // 2. install the contract
  // 3. extract the mintInvitation from the creatorFacet and use it in an offer
  // 4. verify that you get a payment of 20 moola out (how do you verify? using the moola issuer, expose it in contract.js)
})


test('mint me 80 moola', async (t) => {
  // 1. write a function that reads the offer (Tokens key) from the user and mints the amount if less than or equal to 100n
  // 2. install the contract
  // 3. use the invitation from the contract to send an offer to mint 80 moola, use keyword Tokens again to match
  // 4. check that the offer ersult is 'Here you go'
  // 5. deposit the payment into an empty purse
})

test('mint me 500 moola', async (t) => {
  // repeat previous exercise to check that the contract refuses to mint the amount and there is no payment
})


// bonus exercise - make the moola mint flexible