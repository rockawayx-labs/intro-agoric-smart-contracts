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

## Workshop exercises

Load up the [workshop presentation](https://docs.google.com/presentation/d/1Rr01wNR6JzDrfi5FKGGHHk3NqbT6LdhB8HUK21uKT3Q/edit?usp=sharing), which will kick off the workshop. We will explain why Agoric has a strong value proposition and why I think writing smart contracts on Agoric is safer from the get-go.

Each exercise has the working script and the solutions script. It's benefical to type out the exercises but the solutions are there for reference whenever needed.

We recommend running a terminal inside VS Code and having Ava watching your files and re-running tests to obtain immediate feedback.

## contract-0
Exercise focus: [ERTP](https://agoric.com/documentation/getting-started/ertp-introduction.html)

New concepts: Issuers, Brands, Amounts, Payments, Purses, test-driven contract development

Synopsis: In the `contract-0` directory, we focus on test driven development (there is no contract to build) to learn about issuers, amounts, brands, mints, payments and purses. These are the Lego blocks for creating, describing and transferring value.

How to start:
`cd contract-0`
`npx ava test/test-contract.js -w`

Do this either inside the terminal.

## contract-1

Exercise focus: [ERTP](https://agoric.com/documentation/getting-started/ertp-introduction.html) [Zoe](https://agoric.com/documentation/zoe/guide/)  [Zoe Contract Facet (zcf)](https://agoric.com/documentation/zoe/api/zoe-contract-facet.html)
[Remotable objects](https://agoric.com/documentation/guides/js-programming/far.html)

New concepts: Invitations, Seats, Offers, (creator, public) Facets

Synopsis: `contract-1` is is our first contract that has real functionality - minting Moolas (imaginary fungible asset). We show how to define regular functions that can be called on the contract. Then we focus on the contract interaction lifecycle: invitation -> offer -> seat -> offer result. We then extract a payment from the offer result and deposit it in a purse.

How to start:
`cd contract-1`
`npx ava test/test-contract.js -w`

## contract-2

Exercise focus: [Zoe](https://agoric.com/documentation/zoe/guide/)

New concepts: contract terms, IssuerKeywordRecord

Synopsis: `contract-2` allows the creator to mint NFTs in exchange for Moolas. We show how to setup a contract to *know* about issuers. The contract we will write here accepts `Moola` and mints NFTs using an issuer `Awesomez` that it alone holds. We then run through the offer lifecycle and finally we introduce a bug into the contract and show that Zoe steps in to protect the user -- this **offer safety** in action.

How to start:
`cd contract-2`
`npx ava test/test-contract.js -w`

## react-ui

`react-ui` is a dApp that binds together `contract-1` and `contract-2` so that the former mints `Moola` tokens which are accepted by the latter.

To begin working move to the root of the repository and:
`agoric start --reset`
`agoric deploy contract-1/deploy.js`
`agoric deploy contract-2/deploy.js`
`agoric open` 
`cd react-ui`
`yarn`
`yarn start`

After the above process you should have two tabs open in your browser with the Agoric wallet and with the React application. Enter a value into the first text field and mint some Moola. When you have over 100 Moola, you can try to mint an NFT.
