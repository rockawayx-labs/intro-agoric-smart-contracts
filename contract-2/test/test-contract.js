// @ts-check
// @global harden

import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import { makeZoeKit } from '@agoric/zoe';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';
import bundleSource from '@endo/bundle-source';
import { E } from '@endo/eventual-send';
import { AmountMath, makeIssuerKit } from '@agoric/ertp';

// NOTE: tests initially pass to avoid excessive logging from Ava.
// Remove the t.pass('...') line when you start coding the test


// 1. create a Moola issuer kit
// 2. instantiate the contract in a fake vat, send the moola issuer in terms
// 3. mint yourself 100 tokens into a payment
// 4. send the payment with an offer to the mint function and mint yourself a cryptopunk4551
// 5. check offer result and verify the payment you have received is indeed your cryptopunk
test('I want to buy an NFT', async (t) => {
    t.pass('write the test!')
})

// 1. create a Moola issuer kit
// 2. instantiate the contract in a fake vat, send the moola issuer in terms
// 3. create another issuer kit for token Other, mint yourself 100 'other'
// 4. send the payment with an offer to the mint function and try to mint yourself a cryptopunk4551
// 5. what happens?
test('I want to buy an NFT for the wrong currency', async (t) => {
    t.pass('write the test!')
})

test('I want to extract profit', async (t) => {
    // BONUS: this part of the solution is secret, ask for help
    t.pass('write the test!')
})

