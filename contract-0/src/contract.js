
// This is a minimalistic contract which does absolutely nothing.
// Every contract must have a `start` function, which accepts zcf
// which is short for ZoeContractFacet (the part of Zoe that contracts
// have access to).
//
// The harden() function is used to prevent future modifications to objects.
// e.g. it prevents payment amounts from being modified after the payments
// are created.
//
// The Agoric team is working on removing the need to manually harden()
// objects. For now it's on us and the system tends to warn us that hardening
// is necessary.

const start = async (zcf) => {
    return harden({})
}

harden(start)
export { start }
