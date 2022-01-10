var web3Provider = null;
var contracts = {};
var account = '0x0';
var web3;
var app;

const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
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
        window.alert("Failed to load smart contract!");
        window.location.replace("/html/login_page.html");
    }
}

//loads and shows the current account
const loadAccount = async () => {
    try {
        // Will open the MetaMask UI
        await ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        account = accounts[0];
    } 
    catch (error) {
        console.error(e);
        window.alert("Failed to load ethereum account!!");
        window.location.replace("/html/login_page.html");
    }
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
        await loadAccount();
    }
};

await MetaMaskClientCheck();

export var app;
export var web3;