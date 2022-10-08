import React from "react";
import { ethers } from "ethers";

// const
const CONTRACT_ADDRESS = "0xc439CDc77b80F1A59f346AC5245810528A5B2932"; // polygon testnet
const CONTRACT_ABI = [
  "function name() view returns (string)",
  "function mint(uint256, address[])",
  "function balanceOf(address) view returns (uint256)",
  "function setBaveOper(address _baveOper)",
];

function App() {
  /**
   *    connect account
   */
  const [currentAccount, setCurrentAccount] = React.useState(null);
  React.useEffect(() => {
    const changeAccount = accounts => {
      setCurrentAccount(accounts[0]);
    };

    // 畫面一打開就登入錢包
    window.ethereum.request({ method: "eth_requestAccounts" }).then(changeAccount);

    window.ethereum.on("accountsChanged", changeAccount);

    return () => {
      window.ethereum.removeListener("accountsChanged", changeAccount);
    };
  }, []);

  /**
   *    build provider & signer
   */
  const [provider, setProvider] = React.useState(null);
  const [signer, setSigner] = React.useState(null);
  React.useEffect(() => {
    if (currentAccount) {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(_provider);
      setSigner(_provider.getSigner());
    }
  }, [currentAccount]);

  /**
   *    connect contract
   */
  const [contract, setContract] = React.useState(null);
  React.useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contract);
    }
  }, [signer]);

  /**
   * mint button
   */
  const handleMint = async () => {
    // 0x3613C05D595DE8632335812cF1B398eBCA98d3f5
    const amount = "5";
    const tx = await contract.mint(
      ethers.utils.parseUnits(amount, "ether"),
      ["0xD44b4d894F9A4F5637CB42338191b0CF90d74ADC"],
      {
        gasPrice: "0x1", // if gas price too low, transaction will be pendding
        gasLimit: 121000,
      }
    );
    console.log(tx);
    const tx_confirmed = await tx.wait();
    console.log(tx_confirmed);
  };

  /**
   * transfer money
   */
  const handleTransfer = async () => {
    const transactionParameters = {
      nonce: "0x00", // ignored by MetaMask
      // gasPrice: "0x1", // customizable by user during MetaMask confirmation.
      // gasLimit: "0x5208", // customizable by user during MetaMask confirmation.
      to: "0x3613C05D595DE8632335812cF1B398eBCA98d3f5", // Required except during contract publications.
      value: ethers.utils.parseUnits("0.1", "ether"), // Only required to send ether to the recipient from the initiating external account.
    };

    let tx = await signer.sendTransaction(transactionParameters);
    console.log(tx);
    let tx_confirmed = await tx.wait();
    console.log(tx_confirmed);
  };

  /**
   *    contract data
   */
  const [nftName, setNftName] = React.useState(null);
  const [nftBalance, setNftBalance] = React.useState(null);
  React.useEffect(() => {
    const initialUpdate = async () => {
      const nft_name = await contract.name();
      setNftName(nft_name);
    };

    const intervalUpdate = async () => {
      const nft_balance = await contract.balanceOf(currentAccount);
      setNftBalance(nft_balance.toString());
    };

    if (contract) {
      initialUpdate();

      let interval = setInterval(() => {
        intervalUpdate();
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [contract]);

  return (
    <div className='App'>
      <h1>NFT name: {nftName}</h1>
      <h2>Account: {currentAccount}</h2>
      <h3>NFT amount: {ethers.utils.formatUnits(nftBalance, 'ether')}</h3>

      <div className='buttons'>
        <button className='mint-button' onClick={handleMint}>
          Mint
        </button>

        <button className='mint-button' onClick={handleTransfer}>
          Transfer
        </button>

        <button
          className='cancel-button'
          onClick={async () => {
            const gasPrice = await signer.getGasPrice();
            const gasPrice_to_gwei = ethers.utils.formatUnits(gasPrice.toString(), "gwei");
            console.log('Gas price(gwei):',gasPrice_to_gwei.toString());
          }}
        >
          Gas Price
        </button>
      </div>
    </div>
  );
}

export default App;
