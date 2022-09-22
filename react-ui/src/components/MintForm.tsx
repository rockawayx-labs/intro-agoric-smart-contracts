/* global harden */
import { useState, useEffect } from 'react';
import { E } from '@agoric/eventual-send';
import { useAgoricWalletContext } from '@rbflabs/agoric-react-components';
import moolaMinterConstants from '../moolaMinterConstants.mjs';

const MintForm = () => {
  const [amount, setAmount] = useState(0);
  const [moolaPursePetname, setMoolaPursePetname] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const { purses, zoe, board, walletBridge } = useAgoricWalletContext();

  if (!purses) return <div>No purses found</div>;

  useEffect(() => {
    E(walletBridge).suggestIssuer(
      'Moola',
      moolaMinterConstants.TOKEN_ISSUER_BOARD_ID,
    );
    E(walletBridge).suggestInstallation(
      'Moola installation',
      moolaMinterConstants.INSTALLATION_BOARD_ID,
    );
    E(walletBridge).suggestInstance(
      'Moola Instance',
      moolaMinterConstants.INSTANCE_BOARD_ID,
    );
  }, [walletBridge]);

  useEffect(() => {
    const tokenPurse = purses.find(
      // Does the purse's brand match our token brand?
      ({ brandBoardId }) =>
        brandBoardId === moolaMinterConstants.TOKEN_BRAND_BOARD_ID,
    );
    if (tokenPurse && tokenPurse.pursePetname) {
      // If we got a petname for that purse, use it in the offers we create.
      console.log(`found purse name ${tokenPurse.pursePetname}`);
      setMoolaPursePetname(tokenPurse.pursePetname);
    }
  }, [purses]);

  const mintSomeMoola = async () => {
    setLoading(true);
    console.log('mintMoola handler running');
    const moolaInstance = await E(board).getValue(
      moolaMinterConstants.INSTANCE_BOARD_ID,
    );
    const moolaPublicFacet = await E(zoe).getPublicFacet(moolaInstance);
    const mintInvitation = await E(moolaPublicFacet).makeMintInvitation();

    const offerConfig = harden({
      id: `${Date.now()}`,
      invitation: mintInvitation,
      proposalTemplate: {
        want: {
          Tokens: {
            pursePetname: moolaPursePetname,
            value: amount,
          },
        },
      },
      dappContext: true,
    });

    console.log('adding offer to mint Moolas');
    await E(walletBridge).addOffer(offerConfig);
    setLoading(false);
  };

  return (
    <div className="MintForm">
      <label>Amount of Moola to mint:</label>
      <div className="MintForm-input-row">
        <input
          type="text"
          pattern="[0-9]*"
          onChange={(ev) => setAmount(parseInt(ev.target.value) || 0)}
          value={amount}
        />
        <button onClick={() => mintSomeMoola()} disabled={loading}>
          {loading ? <div className="Loader" /> : 'Mint!'}
        </button>
      </div>
    </div>
  );
};

export default MintForm;
