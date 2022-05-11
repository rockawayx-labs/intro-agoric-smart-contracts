// Eventually will be importable from '@agoric/zoe-contract-support'
import { AssetKind, AmountMath } from '@agoric/ertp'


/**
 * Example contract that knows how to
 * 1. say Hello nicely
 * 2. invite you to ask it to say hello
 * 3. mint you some tokens!
 */
const start = async (zcf) => {

  // 1. create a mint for Moolas or whatever tokens you want (mints are made using makeZCFMint inside contracts)
  // 2. create a function sayHello that takes a seat and returns hello, add the invitation to the creator facet
  // 3. create a function that mints 20 moolas for the user (mint20) and allow the creator to get an invitation to it

  const creatorFacet = {
  }

  return harden({ creatorFacet });
};

harden(start);
export { start };