
const start = async (zcf) => {
    // 1. write a mintNFTs function
    // 2. BONUS: write a getBalance function which returns the current profit
    // 3. BONUS: write a getProfit function which extracts the profit to the creator

    const publicFacet = {
        // add all functions to the public facet
    }

    return harden({ publicFacet });
};

harden(start);
export { start };