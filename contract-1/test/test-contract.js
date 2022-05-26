// @ts-check
// @global harden

import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

// NOTE: tests initially pass to avoid excessive logging from Ava.
// Remove the t.pass('...') line when you start coding the test

// Standard boilerplate to deploy a contract on a Zoe unit test harness:
/*
   const { admin: fakeVatAdmin } = makeFakeVatAdmin()
   const { zoeService: zoe } = makeZoeKit(fakeVatAdmin)
   const helloBundle = await bundleSource('./src/contract.js');
   const helloInstallation = await E(zoe).install(helloBundle)
*/


// check if our installation bundle is what is indeed installed
test('deploy contract for testing', async (t) => {
  t.pass('write the test!')
})


// 1. write a sayHi function which returns 'hi!' into the contract.js file
// 2. install the contract as above
// 3. instantiate the contract using startInstance
// 4. extract the sayHi function test from the creatorFacet
// 5. call the function and verify the returned value is 'hi!' using t.is
test('just say hello', async (t) => {
  t.pass('write the test!')
})


// 1. write a sayHello function as an offer handler in contract.js, return an invitation in creatorFacet via makeHelloInvitation() function
// 2. install the contract as above
// 3. instantiate the contract using startInstance
// 4. extract the makeHelloInvitation function test from the creatorFacet
// 5. use the invitation by sending an (empty) offer to the contract
// 6. the contract should reply by saying 'Hello!', use getOfferResult to check this
test('I invite you to say hello', async (t) => {
  t.pass('write the test!')
})


// 1. write a function that reads the offer (Tokens key) from the user and mints the amount if less than or equal to 1000n
// 2. install the contract
// 3. use the invitation from the contract to send an offer to mint 80 moola, use keyword Tokens again to match
// 4. check that the offer ersult is 'Here you go'
// 5. deposit the payment into an empty purse
test('mint me 80 moola', async (t) => {
  t.pass('write the test!')
})


// repeat previous exercise to check that the contract refuses to mint the amount and a zero payment is extracted
test('mint me 5000 moola', async (t) => {
  t.pass('write the test!')
})
