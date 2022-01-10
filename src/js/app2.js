var web3Provider = null;
var contracts = {};
var account = '0x0';
var web3;
var app;

//Basic Actions Section
const onboardButton = document.getElementById('ethConnect');

const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};

const onClickConnect = async () => {
    try {
        // Will open the MetaMask UI
        await ethereum.request({ method: 'eth_requestAccounts' });
        await loadAccount();

    } catch (e) {
        console.error(e);
        window.alert("Failed to load ethereum account!!")
    }
}

//loads the contract deployed on current network
const loadContract = async () => {
    try{
        app = await $.getJSON('/build/contracts/CrowdFunding.json');
        contracts.CrowdFunding = TruffleContract(app);
        contracts.CrowdFunding.setProvider(web3Provider);
        app = await contracts.CrowdFunding.deployed();
    }
    catch(e){
        console.error(e);
        window.alert("Failed to load smart contract!!");
    }
}

//loads and shows the current account
const loadAccount = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    document.getElementById("ethAccount").value = accounts[0];
    account = accounts[0];
    web3.eth.defaultAccount = account;
}

const MetaMaskClientCheck = async () => {
    //Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
        window.alert("Please install Metamask and try again!");
        onboardButton.disabled = true;
    } else {
        web3 = new Web3(window.ethereum);
        web3Provider = web3.currentProvider;
        await loadContract();
        //When the button is clicked we call this function to connect the users MetaMask Wallet
        onboardButton.onclick = onClickConnect;
        //The button is now disabled
        onboardButton.disabled = false;
    }
};

await MetaMaskClientCheck();

export var app;