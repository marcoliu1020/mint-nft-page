import React from "react";
import { ethers } from "ethers";

function App() {
  const [currentAccount, setCurrentAccount] = React.useState(null)

  /**
   * account
   */
  React.useEffect(() => {
    const changeAccount = (accounts) => {
      setCurrentAccount(accounts[0])
    }

    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(changeAccount)

    window.ethereum.on("accountsChanged", changeAccount)

    return () => {
      window.ethereum.removeListener("accountsChanged", changeAccount)
    }
  }, [])

  /**
   * provider & signer
   */
  const [provider, setProvider] = React.useState(null)
  const [signer, setSigner] = React.useState(null)
  React.useEffect(() => {
  if (currentAccount) {
    const _provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(_provider)
    setSigner(_provider.getSigner())
  }
  }, [currentAccount])

  /**
   * contract
   */
   const [contract, setContract] = React.useState(null)
   const [nftName, setNftName] = React.useState(null)
   React.useEffect(() => {
    const contractAddress = "0x23fCaEE59b7092071bC4A0b2bA3afB0e89eEBB3b"
    const contractABI = [
      "function name() view returns (string)",
      "function mint()",
      "function balanceOf(address) view returns (uint256)"
    ]

    if (provider && signer) {
      const _contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )

      setContract(_contract)

      _contract.name()
      .then(name => setNftName(name))
    }
   }, [provider, signer])

   /**
    * mint button
    */
  const handleMint = async () => {
    await contract.mint()
  }

  /**
   * update data
   */
  const [accountBalance, setAccountBalance] = React.useState(null)
  React.useEffect(() => {
    if (contract) {
      let interval = window.setInterval(() => {
        contract
        .balanceOf(currentAccount)
        .then(balance => setAccountBalance(balance.toString()))
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [contract])
  



  return (
    <div className="App">
      <h1>NFT name: {nftName}</h1>
      <h1>Account: {currentAccount}</h1>
      <h1>NFT amount: {accountBalance}</h1>
      <button className="mint-button" onClick={handleMint}>Mint</button>
    </div>
  );
}

export default App;
