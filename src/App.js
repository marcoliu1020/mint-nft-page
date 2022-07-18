import React from "react";

function App() {
  const [currentAccount, setCurrentAccount] = React.useState(null)
  React.useEffect(() => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(accounts => setCurrentAccount(accounts[0]))
  }, [])

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
