/* global harden */
import { E } from '@agoric/eventual-send';
import { observeNotifier } from '@agoric/notifier';

import React, { useCallback, useState } from 'react';
import { makeReactAgoricWalletConnection } from '@agoric/wallet-connection/react';
import moolaMinterConstants from './moolaMinterConstants.mjs';
import nftMinterConstants from './nftMinterConstants';

import './App.css';
import AgoricLogo from './logo.svg';

// Create a wrapper for agoric-wallet-connection that is specific to
// the app's instance of React.
const AgoricWalletConnection = makeReactAgoricWalletConnection(React);

const OfferMonitor = (props) => {
  const { offers, walletOffers } = props;
  const acceptedOffersCount = walletOffers.filter((o) => o.status === 'accept').length
  const sentOffersCount = offers.length
  const walletIsAwareOffersCount = walletOffers.length


  return (
    <div id="Session-info">
      <div>
        - We've sent <b>{sentOffersCount} {sentOffersCount === 1 ? "offer" : "offers"}</b> in this session
      </div>
      <div>
        - Wallet is aware of <b>{walletIsAwareOffersCount} {walletIsAwareOffersCount === 1 ? "offer" : "offers"}</b>
      </div>
      <div>
        - User has accepted{' '}
        <b>{acceptedOffersCount} {acceptedOffersCount === 1 ? "offer" : "offers"}</b>
      </div>
    </div>
  );
};

const MintingForm = (props) => {
  const [amount, setAmount] = useState(0);
  const [offers, setOffers] = useState([]);
  const [nftName, setNftName] = useState('');

  const {
    agoricInterface,
    moolaPursePetname,
    awesomezPursePetname,
    walletOffers,
  } = props;

  if (!agoricInterface || !moolaPursePetname || !awesomezPursePetname) {
    return (
      <div id="Interface-activation">
        <div className="Loader" />
        <p>
          Waiting for Agoric interface to be activated (click <b>Approve</b> in
          your Agoric wallet)...
        </p>
      </div>
    );
  }

  const { zoe, board, walletBridge } = agoricInterface;

  const mintSomeMoola = async () => {
    console.log('mintMoola handler running');
    const moolaInstance = await E(board).getValue(
      moolaMinterConstants.INSTANCE_BOARD_ID,
    );
    const moolaPublicFacet = await E(zoe).getPublicFacet(moolaInstance);
    const mintInvitation = await E(moolaPublicFacet).makeMintInvitation();

    const offerConfig = {
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
    };

    console.log('adding offer to mint Moolas');
    const newOffer = await E(walletBridge).addOffer(offerConfig);
    setOffers([newOffer, ...offers]);
  };

  const mintNft = async () => {
    const nftInstance = await E(board).getValue(
      nftMinterConstants.INSTANCE_BOARD_ID,
    );
    const nftPublicFacet = await E(zoe).getPublicFacet(nftInstance);
    const mintInvitation = await E(nftPublicFacet).makeMintNFTsInvitation();
    const nftIssuer = await E(nftPublicFacet).getNFTIssuer();
    const nftBrand = await E(nftIssuer).getBrand();
    console.log(
      `have issuer ${nftIssuer} brand ${nftBrand} petname ${awesomezPursePetname}`,
    );

    const offerConfig = {
      id: `${Date.now()}`,
      invitation: mintInvitation,
      proposalTemplate: {
        give: {
          Tokens: {
            pursePetname: moolaPursePetname,
            value: 100n,
          },
        },
        want: {
          Awesomez: {
            pursePetname: awesomezPursePetname,
            value: harden([nftName]),
          },
        },
      },
      dappContext: true,
    };

    console.log('adding offer to buy NFT');
    const newOffer = await E(walletBridge).addOffer(offerConfig);
    setOffers([newOffer, ...offers]);
  };

  return (
    <div id="Mint-form">
      <div id="Mint-wrapper">
        <label>Amount of Moola to mint:</label>
        <input
          type="text"
          pattern="[0-9]*"
          onChange={(ev) => setAmount(parseInt(ev.target.value) || 0)}
          value={amount}
        />
        <button onClick={() => mintSomeMoola()}>Get some Moola!</button>
      </div>
      <div id="Mint-nft-div">
        <input
          type="text"
          onChange={(ev) => setNftName(ev.target.value)}
          value={nftName}
        />
        <button onClick={nftName !== '' ? () => mintNft() : undefined}>
          Mint the Nft
        </button>
      </div>
      <OfferMonitor offers={offers} walletOffers={walletOffers} />
    </div>
  );
};

const MyWalletConnection = (props) => {
  const [tokenPursePetname, setTokenPursePetname] = useState();
  const [awesomezPursePetname, setAwesomezPursePetname] = useState();
  const [agoricInterface, setAgoricInterface] = useState();
  const [walletOffers, setWalletOffers] = useState([]);

  const setupWalletConnection = async (walletConnection) => {
    // This is one of the only methods that the wallet connection facet allows.
    // It connects asynchronously, but you can use promise pipelining immediately.
    const walletBridge = E(walletConnection).getScopedBridge('dApp-NFTs');

    // You should reconstruct all state here.
    const zoe = await E(walletBridge).getZoe();
    const board = await E(walletBridge).getBoard();

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

    E(walletBridge).suggestIssuer(
      'Awesomez',
      nftMinterConstants.NFT_ISSUER_BOARD_ID,
    );
    E(walletBridge).suggestInstallation(
      'Awesomez installation',
      nftMinterConstants.INSTALLATION_BOARD_ID,
    );
    E(walletBridge).suggestInstance(
      'Awesomez instance',
      nftMinterConstants.INSTANCE_BOARD_ID,
    );

    setAgoricInterface({ zoe, board, walletBridge });

    observeNotifier(E(walletBridge).getPursesNotifier(), {
      updateState: async (purses) => {
        const tokenPurse = purses.find(
          // Does the purse's brand match our token brand?
          ({ brandBoardId }) =>
            brandBoardId === moolaMinterConstants.TOKEN_BRAND_BOARD_ID,
        );
        if (tokenPurse && tokenPurse.pursePetname) {
          // If we got a petname for that purse, use it in the offers we create.
          console.log(`found purse name ${tokenPurse.pursePetname}`);
          setTokenPursePetname(tokenPurse.pursePetname);
        }

        const awesomezPurse = purses.find(
          // Does the purse's brand match our token brand?
          ({ brandBoardId }) =>
            brandBoardId === nftMinterConstants.NFT_BRAND_BOARD_ID,
        );
        if (awesomezPurse && awesomezPurse.pursePetname) {
          console.log(
            `found awesomez purse name ${awesomezPurse.pursePetname}`,
          );
          setAwesomezPursePetname(awesomezPurse.pursePetname);
        }
      },
    });

    observeNotifier(E(walletBridge).getOffersNotifier(), {
      updateState: (walletOffers) => {
        console.log(walletOffers);
        setWalletOffers(walletOffers);
      },
    });
  };

  const onWalletState = useCallback(async (ev) => {
    const { walletConnection, state } = ev.detail;
    console.log('NEW onWalletState:', state);
    switch (state) {
      case 'idle': {
        console.log('Connection with wallet established, initializing dApp!');
        // ensure we have up to date agoric interface
        setupWalletConnection(walletConnection);
        break;
      }
      case 'error': {
        console.log('Wallet connection reported error', ev.detail);
        // In case of an error, reset to 'idle'.
        // Backoff or other retry strategies would go here instead of immediate reset.
        E(walletConnection).reset();
        break;
      }
      default:
    }
  }, []);

  return (
    <>
      <MintingForm
        agoricInterface={agoricInterface}
        moolaPursePetname={tokenPursePetname}
        awesomezPursePetname={awesomezPursePetname}
        walletOffers={walletOffers}
      />
      <AgoricWalletConnection onState={onWalletState} />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img className="Logo" src={AgoricLogo} alt="Logo" />
        <MyWalletConnection />
      </header>
    </div>
  );
}

export default App;
