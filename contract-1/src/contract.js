// @ts-check

import '@agoric/zoe/exported.js';

/**
 * @type {ContractStartFn}
 */
const start = async (zcf) => {
  // 1. create a mint for Moolas or whatever tokens you want (mints are made using makeZCFMint inside contracts)
  // 2. create a function sayHello that takes a seat and returns hello, add the invitation to the creatorFacet
  // 3. create a function that mints any amount of moolas requested up to 1000n and add it to the publicFacet
  // 4. it's important to ensure we are able to identify the real Moola, export the issuer using a getIssuer() function in the publicFacet

  const creatorFacet = {};

  const publicFacet = {};

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
