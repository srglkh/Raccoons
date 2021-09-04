const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const EvmChains = window.evmChains;
const Fortmatic = window.Fortmatic;
const BN = window.Web3.utils.BN;

const RSSAddress = "0x020BB206cd689d6981182579da490d5F4ceB4c46";
const RSPAddress = "0xd1Cb076F657a38538A5579e3772788E34e83b19c";
const RSScontractABI = [{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const RSPcontractABI = [{"inputs":[{"internalType":"uint256","name":"tokenId1","type":"uint256"},{"internalType":"uint256","name":"tokenId2","type":"uint256"}],"name":"ritual","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId1","type":"uint256"},{"internalType":"uint256","name":"tokenId2","type":"uint256"},{"internalType":"uint256","name":"tokenId3","type":"uint256"}],"name":"ritual","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const ipfsGateaway = 'https://gateaway.ipfs.io/ipfs/'

let rss;
let rsp;

let web3Modal;

let provider;

let selectedAccount = null;
let selectedRaccoons = [];

let label = document.getElementById('ritual-main-button-label');

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

async function updateRaccoons() {
  let ritualRaccoons = document.getElementById('ritual-page-raccoons');

  if(selectedAccount == null) {
    selectedRaccoons = [];
    ritualRaccoons.innerHTML = '';
    ritualRaccoons.style.display = 'none';
    return
  }
  
  /*
  let numberOfTokens = 0;
  let tokenIDs = [];
  let tokenURIs = [];
  let result = await rsp.methods.balanceOf(selectedAccount).call({from: selectedAccount});
  console.log('Balance is: ', result);
  numberOfTokens = parseInt(result);

  for (let i = 0; i < numberOfTokens; i++) {
    let tokenID = await rsp.methods.tokenOfOwnerByIndex(selectedAccount, i).call({from: selectedAccount});
    console.log('Token ID is:', tokenID)
    tokenIDs.push(parseInt(tokenID));
  }

  for (let i = 0; i < numberOfTokens; i++) {
    let tokenURI = await rsp.methods.tokenURI(tokenIDs[i]).call({from: selectedAccount})
    tokenURIs.push(tokenURI.substring(7));
  }
  */

  let offset = 0;
  let json = {assets: []};

  for (offset = 0; offset < 500; offset += 50) {
    url = 'https://api.opensea.io/api/v1/assets/?owner='+selectedAccount+'&asset_contract_address='+RSSAddress+'&offset='+offset+'&limit=50';
    let promise = await fetch(url);
    let result = await promise.json();
    if (result.assets.length == 0) {
      break;
    }
    json.assets = json.assets.concat(result.assets);
  }
  let harbingers = [];
  json.assets.forEach((element) => {
    element.traits.forEach((trait) => {
      if(trait.trait_type == "ASCENDANCY" && trait.value == 'Harbinger') {
        harbingers.push(element);
      }
    })
  });

  if (harbingers.length) {
    ritualRaccoons.style.display = 'flex';
  }
  for (let i = 0; i < harbingers.length; i++) {
    const raccoonImgSrc = harbingers[i].image_preview_url;
    const raccoonName = '#'+harbingers[i].token_id;
    let raccoon = document.createElement('div');
    raccoon.id = harbingers[i].token_id;
    raccoon.className = 'ritual-page-raccoon'
    raccoon.innerHTML = `
      <img src="${raccoonImgSrc}" alt="">
      <div class="ritual-page-raccoon-name">${raccoonName}</div>
    `;
    raccoon.onclick = () => {
      const toggleTo = !selectedRaccoons.includes(raccoon);
      raccoon.classList.toggle('ritual-page-selected-raccoon', toggleTo);
      if (toggleTo) {
        selectedRaccoons.push(raccoon);
      } else {
        selectedRaccoons = selectedRaccoons.filter(selectedRaccoon => selectedRaccoon != raccoon);
      }
    };
    ritualRaccoons.append(raccoon);
  }
}

async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);
  rss = new web3.eth.Contract(RSScontractABI, RSSAddress)
  rsp = new web3.eth.Contract(RSPcontractABI, RSPAddress);
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
  await updateRaccoons();
  toggleButton("Disconnect");
  toggleRitualButton(true);
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
  await updateRaccoons();
  label.innerHTML = '';
  toggleButton("Connect");
  toggleRitualButton(false);
  toggleConnectButton(true);
}

let ritualButtonClick = () => {
  if (selectedRaccoons.length < 2 || selectedRaccoons.length > 3) {
    label.innerHTML = 'Wrong harbingers amount';
    return;
  }
  if (selectedRaccoons.length == 2 && selectedRaccoons[0].id > 1588 && selectedRaccoons[1].id > 1588) {
    label.innerHTML = 'Additional harbinger required';
    return;
  }
  label.innerHTML = '';

  let trxOptions = {
    from: selectedAccount,
    to: RSPAddress,
  };
  if (selectedRaccoons.length == 2) {
    rsp.methods.ritual(selectedRaccoons[0].id, selectedRaccoons[1].id).send(trxOptions, function (err, trxHash) {
      if(err) {
        console.log(err);
        return;
      }
      label.innerHTML = 'Success';
      console.log(trxHash);
    });
  }
  else {
    rsp.methods.ritual(selectedRaccoons[0].id, selectedRaccoons[1].id, selectedRaccoons[2].id).send(trxOptions, function (err, trxHash) {
      if(err) {
        console.log(err);
        return;
      }
      label.innerHTML = 'Success';
      console.log(trxHash);
    });
  }
};

let ritualButton = document.getElementById('ritual-main-button');
let toggleRitualButton = (toggle) => {
  if (toggle && selectedAccount) {
    ritualButton.classList.toggle('btn-disabled', !toggle);
    ritualButton.onclick = ritualButtonClick;
  }
  else {
    ritualButton.classList.toggle('btn-disabled', toggle);
    ritualButton.onclick = null;
  }
};
toggleRitualButton(false);

let connectButton = document.getElementById('ritual-connect-btn');
let toggleConnectButton = (toggle) => {
  connectButton.classList.toggle('btn-disabled', !toggle);
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
  init();
}