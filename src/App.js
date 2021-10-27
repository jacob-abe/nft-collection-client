import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React from "react";

// Constants
const TWITTER_HANDLE = 'momrider_69';
const TWITTER_LINK = `https://jacobabe.bio.link`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Questionable Quotes NFT Collection</p>
          <img src="https://vcvoices.org/wp-content/uploads/2015/04/c8129f9ce.jpg"></img>
          <p className="sub-text">
            Grab your unique NFT today and display it to the world.
          </p>
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
