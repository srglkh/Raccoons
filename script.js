const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const EvmChains = window.evmChains;
const Fortmatic = window.Fortmatic;

let countDownDate = new Date("Aug 20, 2021 22:00:00").getTime();

contractAddress = "0x7E8546751fF5908B1a4c8DC4C435a5Fe18839600"
contractABI = [
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}, 
  {"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"initiate","outputs":[],"stateMutability":"payable","type":"function"}
  ]

const web3 = new Web3("https://rinkeby.infura.io/v3/3943ba9cb26b46f583d1744f868324d7")

const rss = new web3.eth.Contract(contractABI, contractAddress)

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;

function init() {

  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // 3943ba9cb26b46f583d1744f868324d7
        infuraId: "01476dedfc4a4c868a945b7194021bcd",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // pk_live_AD8824184DAA9F9D
        key: "pk_test_01D574133724EE35"
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
  //const rss = new web3.eth.Contract(contractABI, contractAddress)
  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = await EvmChains.getChain(chainId);
  //document.querySelector("#network-name").textContent = chainData.name;

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  //document.querySelector("#selected-account").textContent = selectedAccount;

  // Get a handl
  //const template = document.querySelector("#template-balance");
  //const accountContainer = document.querySelector("#accounts");

  // Purge UI elements any previously loaded accounts
  //accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    // ethBalance is a BigNumber instance
    // https://github.com/indutny/bn.js/
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    // Fill in the templated row and put in the document
    //const clone = template.content.cloneNode(true);
    //clone.querySelector(".address").textContent = address;
    //clone.querySelector(".balance").textContent = humanFriendlyBalance;
    //accountContainer.appendChild(clone);
  });

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  //document.querySelector("#prepare").style.display = "none";
  //document.querySelector("#connected").style.display = "block";
}

async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  //document.querySelector("#connected").style.display = "none";
  //document.querySelector("#prepare").style.display = "block";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  //document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  //document.querySelector("#btn-connect").removeAttribute("disabled")
}

async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
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
}

async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
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

  // Set the UI back to the initial state
  //document.querySelector("#prepare").style.display = "block";
  //document.querySelector("#connected").style.display = "none";
}

window.onload = async () => {
  let raccoons = document.getElementById('animated-raccoons');
  if (raccoons) {
    const lastRaccoonFileNumber = 26;
    let nextRaccoon = 1;
    let isLookingLeft = false;

    let addRaccoon = () => {
      let raccoon = document.createElement('img');
      raccoon.setAttribute('src', `/img/animated-section/${nextRaccoon}.png`);
      raccoon.style.transform = isLookingLeft ? 'scaleX(-1)' : '';
      isLookingLeft = !isLookingLeft;
      raccoons.append(raccoon);
      nextRaccoon = nextRaccoon % lastRaccoonFileNumber + 1;
    }

    let toggleRaccoons = () => {
      raccoons.firstChild.remove();
      addRaccoon();
    }

    for (let i = 0; i < 12; i++) {
      addRaccoon();
    }

    setTimeout(toggleRaccoons, 20);
    setInterval(toggleRaccoons, 3000);
  }


  let initiateInput = document.getElementById('initiate-input');
  if (initiateInput) {
    init()

    let countDown = setInterval(function() {

      var now = new Date().getTime();
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("initiate-confirm").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

      if (distance < 0) {
        clearInterval(countDown);
        document.getElementById("initiate-confirm").innerHTML = "Mint";
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

    document.getElementById('initiate-confirm').onclick = () => {
      if(document.getElementById('initiate-confirm').innerHTML == "Mint") {
        if(!selectedAccount) {
        onConnect();
        }
        else {
          console.log("mint")
          rss.methods.initiate(initiateInput.value).send(trxOptions, function (err, trxHash) {
            if(err) {
              console.log(err)
              return
            }
            console.log(trxHash)
          })
        }
      }
    };
  }
}
