import './App.css';
import {
  AgoricWalletConnectButton,
  useAgoricWalletContext,
} from '@rbflabs/agoric-react-components';
import MintForm from './components/MintForm';
import NFTForm from './components/NFTForm';
import logo from './logo.svg';

const getContent = (
  walletConnected: boolean | undefined,
  purses: any[] | undefined,
) => {
  if (!walletConnected) {
    return null;
  } else if (walletConnected && !purses) {
    return 'Loading purses...';
  } else {
    return <MintForm />;
  }
};

function App() {
  const { walletConnected, purses } = useAgoricWalletContext();

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h2 className="App-headline">
        Hello, I am an{' '}
        <a
          className="App-link"
          href="https://agoric.com/"
          target="_blank"
          rel="noreferrer"
        >
          Agoric
        </a>{' '}
        React App!
      </h2>
      <p className="App-description">
        This app will let you mint some Moola tokens!
        <p className="App-reminder">
          Don't forget to start the Agoric chain and deploy the Moola contract!
        </p>
      </p>

      <AgoricWalletConnectButton />
      <div className="App-content">{getContent(walletConnected, purses)}</div>
    </div>
  );
}

export default App;
