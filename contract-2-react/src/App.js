import '@agoric/eventual-send/shim';
import { E } from '@agoric/eventual-send';
import { AmountMath } from '@agoric/ertp'

import React, { useCallback } from 'react';
import { makeReactAgoricWalletConnection } from '@agoric/wallet-connection/react.js';
import nftMinterConstants from './nftMinterConstants'
import moolaMinterConstants from './moolaMinterConstants'

import logo from './logo.svg';
import './App.css';

// Create a wrapper for agoric-wallet-connection that is specific to
// the app's instance of React.
const AgoricWalletConnection = makeReactAgoricWalletConnection(React);


const MyWalletConnection = ({ connecting }) => {
  const onWalletState = useCallback(async ev => {
    const { walletConnection, state } = ev.detail;
    console.log('onWalletState', state);
    switch (state) {
      case 'idle': {
        console.log('Connection with wallet established!')
        // This is one of the only methods that the wallet connection facet allows.
        // It connects asynchronously, but you can use promise pipelining immediately.
        const bridge = E(walletConnection).getScopedBridge('Contract-2');

        // You should reconstruct all state here.
        const zoe = await E(bridge).getZoe();
        const board = await E(bridge).getBoard()

        const moolaInstallation = await E(board).getValue(moolaMinterConstants.INSTALLATION_BOARD_ID)
        const nftInstallation = await E(board).getValue(nftMinterConstants.INSTALLATION_BOARD_ID)

        const moolaInstance = await E(zoe).startInstance(moolaInstallation)
        const { creatorFacet: moolaCreatorFacet } = moolaInstance

        const moolaIssuer = await E(moolaCreatorFacet).getIssuer()
        const moolaBrand = await E(moolaIssuer).getBrand()

        const moola100 = AmountMath.make(moolaBrand, 100n)
        const mintInvitation = await E(moolaCreatorFacet).makeMintSomeInvitation()

        // FIXME: I don't seem to have to approve this offer in my wallet?
        const moolaSeat = await E(zoe).offer(mintInvitation, { want: { Tokens: moola100 } })
        const moolaResult = await E(moolaSeat).getOfferResult()
        console.log(moolaResult)

        const myMoola = await E(moolaSeat).getPayout('Tokens')
        // FIXME: how to deposit this into a purse that is in my wallet?
        console.log(myMoola)

        const nftInstance = await E(zoe).startInstance(nftInstallation, { Tokens: moolaIssuer }, { Moola: moolaIssuer })
        const { creatorFacet: nftCreatorFacet } = nftInstance

        const nftIssuer = await E(nftCreatorFacet).getNFTIssuer()
        const nftBrand = await E(nftIssuer).getBrand()
        const nftMintInvitation = await E(nftCreatorFacet).mintNFTsInvitation()
        console.log(nftMintInvitation)

        const wantNFT = AmountMath.make(nftBrand, harden(["cryptopunk4551"]))
        const nftSeat = await E(zoe).offer(nftMintInvitation, { want: { Awesomez: wantNFT }, give: { Tokens: moola100 } }, { Tokens: myMoola })

        const nftResult = await E(nftSeat).getOfferResult()
        console.log(nftResult)

        break;
      }
      case 'error': {
        console.log('error', ev.detail);
        // In case of an error, reset to 'idle'.
        // Backoff or other retry strategies would go here instead of immediate reset.
        E(walletConnection).reset();
        break;
      }
      default:
    }
  }, []);
  return <AgoricWalletConnection onState={onWalletState} />;
};


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <MyWalletConnection />
    </div>
  );
}

export default App;
