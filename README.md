# Agoric workshop at the Gateway to Cosmos 2022 Prague

## Prerequisites

Without the pre-requisites you won't be able to complete the exercises.

### Install the Agoric SDK

First make sure you have `node.js` v16 and `yarn` installed on your system.
Please check:

- `node --version` returns  `v16.YY.ZZ` the minor and patch version are not important
- `yarn --version` returns a version like `1.22.ZZ`

Then:

- Install the Agoric SDK `git clone https://github.com/Agoric/agoric-sdk`
- Checkout beta `cd agoric-sdk && git checkout beta`
- Install `yarn && yarn build`
- Install the `agoric` script by running `yarn link-cli`

Test whether you can run `agoric --version` and get a version number like `0.15.0` back. If yes, you are all set.

### Clone the repository

- `git clone https://github.com/rbflabs/gateway-agoric-workshop-2022.git agoric-workshop`
- `cd agoric-workshop && agoric install`

Agoric install performs the necessary installation steps so we can run our examples.

## Follow the workshop

Load up the [workshop presentation](https://docs.google.com/presentation/d/1Rr01wNR6JzDrfi5FKGGHHk3NqbT6LdhB8HUK21uKT3Q/edit?usp=sharing), which will kick off the workshop. I will explain why Agoric has a strong value proposition and why I think writing smart contracts on Agoric is safer from the get-go.

## contract-0

In the `contract-0` directory, we focus on test driven development (there is no contract to build) to learn about issuers, amounts, brands, mints, payments and purses. These are the Lego blocks for creating, describing and transferring value.

Relevant documentation: [ERTP](https://agoric.com/documentation/getting-started/ertp-introduction.html)

To begin working:
`cd contract-0`
`npx ava test/test-contract.js -w`

Do this either inside the terminal.

## contract-1

`contract-1` is is our first contract that has real functionality - minting Moolas (imaginary fungible asset).

1. First we teach to contract to be polite and say 'Hi!'.
2. We show how **invitations** work and extend an invitation to ourselves.
3. We redeem the invitation by sending an **offer** in which we ask for Moolas to be minted for us.
4. We extract the payment and deposit it into our purse.

Relevant documentation: [Zoe](https://agoric.com/documentation/getting-started/intro-zoe.html)

To begin working:
`cd contract-1`
`npx ava test/test-contract.js -w`

Do this either inside the terminal.

## contract-2

`contract-2` allows the creator to mint NFTs in exchange for Moolas.

1. We show how a smart contract can be informed about which currency it should know about and accept.
2. We then write a function which allows the user to mint an `Awesomez` NFT in return for a payment of Moolas.
3. We check whether we have received the right thing in our test.
4. We test **offer safety** in a test by introducing a bug into the contract and show that Zoe stops the exchange.

To begin working:
`cd contract-2`
`npx ava test/test-contract.js -w`

Do this either inside the terminal.