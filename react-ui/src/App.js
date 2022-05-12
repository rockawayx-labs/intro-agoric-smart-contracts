/* global harden */
import { E } from '@agoric/eventual-send';
import { AmountMath } from '@agoric/ertp'
import { observeNotifier } from '@agoric/notifier';

import React, { useCallback } from 'react';
import { makeReactAgoricWalletConnection } from '@agoric/wallet-connection/react';
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
    let tokenPursePetname;
    switch (state) {
      case 'idle': {
        console.log('Connection with wallet established!')
        // This is one of the only methods that the wallet connection facet allows.
        // It connects asynchronously, but you can use promise pipelining immediately.
        const walletBridge = E(walletConnection).getScopedBridge('Contract-2');
        await E(walletBridge).suggestIssuer('Moola', moolaMinterConstants.TOKEN_ISSUER_BOARD_ID);

        // You should reconstruct all state here.
        const zoe = await E(walletBridge).getZoe();
        const board = await E(walletBridge).getBoard()

        const moolaInstallation = await E(board).getValue(moolaMinterConstants.INSTALLATION_BOARD_ID)
        //const nftInstallation = await E(board).getValue(nftMinterConstants.INSTALLATION_BOARD_ID)

        const moolaInstance = await E(zoe).startInstance(moolaInstallation)
        const { creatorFacet: moolaCreatorFacet } = moolaInstance

        const mintInvitation = await E(moolaCreatorFacet).makeMintSomeInvitation()

        observeNotifier(E(walletBridge).getPursesNotifier(), {
          updateState: async (purses) => {
            const tokenPurse = purses.find(
              // Does the purse's brand match our token brand?
              ({ brandBoardId }) => brandBoardId === moolaMinterConstants.TOKEN_BRAND_BOARD_ID,
            )
            if (tokenPurse && tokenPurse.pursePetname) {
              // If we got a petname for that purse, use it in the offers we create.
              tokenPursePetname = tokenPurse.pursePetname
              const depositFacet = tokenPurse.getDepositFacet()
              const depositFacetId = await E(board).getId(depositFacet)
              console.log(`deposit facet id for the Moola purse is ${depositFacetId}`)
            }
          },
        })

        observeNotifier(E(walletBridge).getOffersNotifier(), {
          updateState: (walletOffers) => {
            console.log(walletOffers)
          },
        })

        console.log('setting timeout for 5 s')
        setTimeout(async () => {
          const offerConfig = {
            id: Date.now(),
            invitation: mintInvitation,
            installationHandleBoardId: moolaMinterConstants.INSTALLATION_BOARD_ID,
            proposalTemplate: {
              want: {
                Tokens: {
                  pursePetname: tokenPursePetname,
                  value: 100
                }
              },
            },
            dappContext: true,
          }

          await E(walletBridge).addOffer(offerConfig)
        }, 10 * 1000)



        /*        
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
                */

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
