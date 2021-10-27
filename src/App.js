import './styles/App.css'
import twitterLogo from './assets/twitter-logo.svg'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import abi from './utils/NFTContract.json'
import ReactLoading from 'react-loading'

// Constants
const TWITTER_HANDLE = 'momrider_69'
const TWITTER_LINK = `https://jacobabe.bio.link`
const OPENSEA_LINK = ''
const TOTAL_MINT_COUNT = 50
const CONTRACT_ADDRESS = '0x27D8f4bE26CB2e8e2CA32aF82d4923bcCB64F666'

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const checkIfWalletIsConnected = async () => {
    setIsLoading(true)
    const { ethereum } = window
    if (!ethereum) {
      console.log('Make sure you have metamask!')
      return
    } else {
      console.log('We have the ethereum object', ethereum)
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account:', account)
      setCurrentAccount(account)
      setupEventListener()
      setIsLoading(false)
    } else {
      console.log('No authorized account found')
      setIsLoading(false)
    }
  }

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
      setIsLoading(false)
      setupEventListener()
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain ' + chainId)

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = '0x4'
      if (chainId !== rinkebyChainId) {
        alert('You are not connected to the Rinkeby Test Network!')
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          abi.abi,
          signer,
        )

        connectedContract.on('NewNFTMinted', (from, tokenId) => {
          setIsLoading(false)
          console.log(from, tokenId.toNumber())
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`,
          )
        })
        console.log('Setup event listener!')
      } else {
        setIsLoading(false)
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    setIsLoading(true)
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          abi.abi,
          signer,
        )

        console.log('Going to pop wallet now to pay gas...')
        let nftTxn = await connectedContract.mintNFT()

        console.log('Mining...please wait.')
        await nftTxn.wait()

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`,
        )
        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const handleCollectionClick = () => {
    window.open(
      `https://testnets.opensea.io/collection/questionablequotesnft-xv0zfrdwp4`,
    )
  }

  useEffect(() => {
    setIsLoading(false)
    checkIfWalletIsConnected()
  }, [])
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      style={{ marginTop: '20px' }}
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  )

  const renderConnectedContainer = () => (
    <button
      style={{ marginTop: '20px' }}
      onClick={askContractToMintNft}
      className="cta-button mint-button"
    >
      Mint NFT
    </button>
  )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p
            className="header gradient-text"
            onClick={handleCollectionClick}
            style={{ cursor: 'pointer' }}
          >
            Questionable Quotes NFT Collection
          </p>
          <img
            src="https://vcvoices.org/wp-content/uploads/2015/04/c8129f9ce.jpg"
            onClick={handleCollectionClick}
            style={{ cursor: 'pointer' }}
          ></img>
          <p className="sub-text">
            Grab your unique NFT today and display it to the world.
          </p>
          <p className="sub-sub-text">
            If you want to support me and want this on MainNet, just donate some
            ETH to 0xc2fBFf61209Bc2E13783Aac1268D6b76Ffa0D733
          </p>
          {currentAccount
            ? renderConnectedContainer()
            : renderNotConnectedContainer()}
          {isLoading == true ? (
            <ReactLoading
              type={'spokes'}
              color={'white'}
              height={'25px'}
              width={'25px'}
            />
          ) : null}
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
  )
}

export default App
