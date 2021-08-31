const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const EvmChains = window.evmChains;
const Fortmatic = window.Fortmatic;
const BN = window.Web3.utils.BN;

let countDownDate = new Date(Date.UTC(2021, 7, 27, 22));

const contractAddress = "0x020BB206cd689d6981182579da490d5F4ceB4c46";
const contractABI = [
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}, 
  {"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"initiate","outputs":[],"stateMutability":"payable","type":"function"}
  ];
let mintPrice = new BN("20000000000000000");

let rss;

// Web3modal instance
let web3Modal;

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;

function init() {

  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // 01476dedfc4a4c868a945b7194021bcd
        infuraId: "3943ba9cb26b46f583d1744f868324d7",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // pk_test_01D574133724EE35
        key: "pk_live_AD8824184DAA9F9D"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
  });

}

async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);
  rss = new web3.eth.Contract(contractABI, contractAddress);
  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = await EvmChains.getChain(chainId);

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
  enableConfirmButton();
}

async function refreshAccountData() {
  await fetchAccountData(provider);
}

async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  toggleConnectButton(false);

  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    toggleConnectButton(true);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
  toggleButton("Disconnect");
  toggleConnectButton(true);
}

async function onDisconnect() {

  console.log("Killing the wallet connection", provider);
  toggleConnectButton(false);

  if(provider.disconnect) {
    await provider.disconnect();
    await web3Modal.clearCachedProvider();
    provider = null;
  }
  else if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }
  selectedAccount = null;
  toggleButton("Connect");
  toggleConnectButton(true);
}

let initiateInput = document.getElementById('initiate-input');
let confirmButtonClick = () => {
  console.log("mint");
  let value = new BN(initiateInput.value);
  value = mintPrice.mul(value);
  console.log(value.toString(10));
  let trxOptions = {
    from: selectedAccount,
    to: contractAddress,
    value: value,
    chain: "rinkeby"
  };
  rss.methods.initiate(initiateInput.value).send(trxOptions, function (err, trxHash) {
    if(err) {
      console.log(err);
      return;
    }
    console.log(trxHash);
  });
};

let confirmButton = document.getElementById('initiate-confirm');
let countDownDateReached = false;
let enableConfirmButton = () => {
  if (countDownDateReached && selectedAccount) {
    confirmButton.classList.remove('btn-disabled');
    confirmButton.onclick = confirmButtonClick;
  }
};

let connectButton = document.getElementById('initiate-connect');
let toggleConnectButton = (toggle) => {
  connectButton.classList.toggle('btn-disabled', !toggle);
  //connectButton.onclick = toggle ? onConnect : null;
};
toggleConnectButton(true);

let toggleButton = (toggle) => {
  if(toggle == "Connect") {
    connectButton.innerHTML = toggle;
    connectButton.onclick = onConnect;
  }
  if(toggle == "Disconnect") {
    connectButton.innerHTML = toggle;
    connectButton.onclick = onDisconnect;
  }
}
toggleButton("Connect");

window.onload = async () => {
  return;
  
  let initiateTimer = document.getElementById('initiate-timer');

  init();

  let countDown = setInterval(function() {

    let now = new Date().getTime();
    let distance = countDownDate - now;

    if (distance < 0) {
      clearInterval(countDown);
      initiateTimer.innerHTML = '00:00:00:00';
      countDownDateReached = true;
      enableConfirmButton();
    } else {
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if(days < 10) {
        days = "0" + days;
      }
      if(hours < 10) {
        hours = "0" + hours;
      }
      if(minutes < 10) {
        minutes = "0" + minutes;
      }
      if(seconds < 10) {
        seconds = "0" + seconds;
      }
      initiateTimer.innerHTML = days+':'+hours+':'+minutes+':'+seconds;
    }
  }, 1000);

  let checkValueRange = () => {
    if (initiateInput.value < 1) {
      initiateInput.value = 1;
    }
    if (initiateInput.value > 10) {
      initiateInput.value = 10;
    }
  };

  document.getElementById('initiate-minus').onclick = () => {
    initiateInput.value--;
    checkValueRange();
  };
  document.getElementById('initiate-plus').onclick = () => {
    initiateInput.value++;
    checkValueRange();
  };
  initiateInput.oninput = () => {
    if (initiateInput.value == '' + +initiateInput.value) {
      checkValueRange();
    } else {
      initiateInput.value = 1;
    }
  };
}
