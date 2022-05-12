// Eventually will be importable from '@agoric/zoe-contract-support'

const start = async (zcf) => {

  // 1. create a mint for Moolas or whatever tokens you want (mints are made using makeZCFMint inside contracts)
  // 2. create a function sayHello that takes a seat and returns hello, add the invitation to the creator facet
  // 3. create a function that mints 20 moolas for the user (mint20) and allow the creator to get an invitation to it
  // 4. create a function that mints any amount of moolas requested up to 1000n

  const creatorFacet = {
  }

  return harden({ creatorFacet });
};

harden(start);
export { start };