import React from "react";
// import { ethers } from "ethers";

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
  // const [provider, setProvider] = React.useState(null)
  // const [signer, setSigner] = React.useState(null)
  // React.useEffect(() => {
  // if (currentAccount) {
  //   const _provider = new ethers.providers.Web3Provider(window.ethereum)
  //   setProvider(_provider)
  //   setSigner(_provider.getSigner())
  // }
  // }, [currentAccount])

  

  




  return (
    <div className="App">
      <h1>Contract {}</h1>
      <h1>Account {currentAccount}</h1>
      <h1>NFT amount {}</h1>
      <button className="mint-button">Mint</button>
    </div>
  );
}

export default App;
