// @ts-check

import '@agoric/zoe/exported.js';

/** @type {ContractStartFn} */
const start = async (zcf) => {
  // 1. create an 'NFT' mint that can issue tokens with name Awesomez
  // 2. write a mintNFTs offer handler that mints an NFT in exchange for Moola tokens from contract-1,
  //    to do this, the Moola issuer must be passed in to this contract using terms (so we can identify valid Moola payments!)
  // 3. BONUS: write a getBalance function which returns the current profit
  // 4. BONUS: write a getProfit function which extracts the profit in Moolas and add it to creatorFacet

  const creatorFacet = {};

  const publicFacet = {};

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
