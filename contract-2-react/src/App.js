import '@agoric/eventual-send/shim';
import { E } from '@agoric/eventual-send';
import { AmountMath, makeIssuerKit } from '@agoric/ertp'

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
        console.log('idle', ev.detail);

        // This is one of the only methods that the wallet connection facet allows.
        // It connects asynchronously, but you can use promise pipelining immediately.
        const bridge = E(walletConnection).getScopedBridge('Contract-2');
        console.log('idle!')

        // You should reconstruct all state here.
        const zoe = await E(bridge).getZoe();
        const board = await E(bridge).getBoard()

        const moolaInstallation = await E(board).getValue(moolaMinterConstants.INSTALLATION_BOARD_ID)
        const nftInstallation = await E(board).getValue(nftMinterConstants.INSTALLATION_BOARD_ID)

        const moolaInstance = await E(zoe).startInstance(moolaInstallation)
        const { creatorFacet: moolaCreatorFacet } = moolaInstance
        const { getIssuer, makeMintSomeInvitation } = moolaCreatorFacet

        const moolaIssuer = getIssuer()
        console.log(moolaIssuer)

        const moola100 = AmountMath.make(moolaIssuer.getBrand(), 100n)
        console.log(moola100)

        const nftInstance = await E(zoe).startInstance(nftInstallation, { Tokens: moolaIssuer }, { Moola: moolaIssuer })
        console.log(nftInstance)

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
        <MyWalletConnection />
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
    </div>
  );
}

export default App;
