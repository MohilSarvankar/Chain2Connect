import { app, web3 } from './initialise2.js'

web3.eth.defaultAccount = ethereum._state.accounts[0];
var account = ethereum._state.accounts[0];
var user = await app.users(account);

var conversionFactor = 2954878866493; //for converting rupees to wei
var clickedInvestRequest = "investRequest0";

//for logging out
document.getElementById("logout").addEventListener("click", () => {
    window.location.replace("/html/login_startup.html");
})

const investmentValid = async (amount) => {
    var requestId = clickedInvestRequest.replace("investRequest", "");
    var request = await app.requests(requestId);
    var targetFund = request[10].toNumber();
    var recievedFund = Math.round(request[11].toNumber() / conversionFactor);

    if (amount <= (targetFund - recievedFund)) {
        return true;
    }
    else {
        return false;
    }
}

const investToStartup = async () => {
    var amountRupee = document.getElementById("amount").value;
    var amountWei = amountRupee * conversionFactor;
    var investmentDesc = document.getElementById("investmentDesc").value;
    var requestId = clickedInvestRequest.replace("investRequest", "");

    var isInvestmentValid = await investmentValid(amountRupee);

    if (isInvestmentValid) {
        try {
            await app.investInStartup(requestId, investmentDesc, { from: account, value: amountWei });
            $("#investModal").modal('hide');
            window.alert("Congratulations! Investment successful.");
            window.location.reload();
        }
        catch (e) {
            console.error(e);
            $("#investModal").modal('hide');
            window.alert("Investment failed! Please try again.");
        }
    }
    else {
        //amount is greater than required amount
        document.getElementById("amountInvalid").innerText = "This amount is greater than the required amount";
        setTimeout(() => {
            document.getElementById("amountInvalid").innerText = "";
        }, 2000);
    }
}

const showRequestDetails = async (requestId) => {
    var request = await app.requests(requestId);
    var startId = request[1].toNumber();
    var startup = await app.startups(startId);

    document.getElementById("showStartName").innerText = startup[1];
    document.getElementById("showStartDesc").innerText = startup[5];
    document.getElementById("showStartAdd").innerText = startup[4];
    document.getElementById("showStartMail").innerText = startup[2];
    document.getElementById("showCurRatio").innerText = request[2] / 10000;
    document.getElementById("showGpRatio").innerText = request[3] / 10000;
    document.getElementById("showArTurnover").innerText = request[5];
    document.getElementById("showNpMargin").innerText = request[4] + " %";
    document.getElementById("showTotDebt").innerText = request[6] + " Rs";
    document.getElementById("showBurnRate").innerText = request[7] + " %";
    document.getElementById("showRevGenerated").innerText = request[8] + " Rs";
    document.getElementById("showNpaTax").innerText = request[9] + " Rs";
    document.getElementById("showTargetFunding").innerText = request[10] + " Rs";
    document.getElementById("showRecievedFunding").innerText = Math.round(request[11].toNumber() / conversionFactor) + " Rs";
    document.getElementById("showSpentFunding").innerText = Math.round(request[12].toNumber() / conversionFactor) + " Rs";
}

const showRequests = async () => {
    var requestCount = await app.requestCount();

    for (var i = 1; i <= requestCount; i++) {
        var request = await app.requests(i);
        var startId = request[1].toNumber();
        var startup = await app.startups(startId);

        var requestTemp = document.getElementById("requestTemplate");
        var requestCopy = requestTemp.content.cloneNode(true);

        requestCopy.getElementById("showStName").innerText = startup[1]; //startup name
        requestCopy.getElementById("showStDesc").innerText = startup[5]; //startup description
        requestCopy.getElementById("showTgFunding").innerText = request[10] + " Rs"; //target funding
        requestCopy.getElementById("showRcFunding").innerText = Math.round(request[11].toNumber() / conversionFactor) + " Rs"; //recieved funding
        requestCopy.getElementById("requestDetails").id = "request" + request[0].toNumber();

        var targetFund = request[10].toNumber();
        var recievedFund = Math.round(request[11].toNumber() / conversionFactor);

        //if target funding is equal to recieved funding
        if (targetFund != recievedFund) {
            document.getElementById("noActiveRequest").hidden = true;
            requestCopy.getElementById("invest").id = "investRequest" + request[0].toNumber();
            document.getElementById("activeRequest").appendChild(requestCopy);

            document.getElementById("investRequest" + request[0].toNumber()).addEventListener("click", function () {
                clickedInvestRequest = this.id;
                return false;
            })
        }
        else {
            document.getElementById("noCompletedRequest").hidden = true;
            requestCopy.getElementById("invest").hidden = true;
            document.getElementById("completedRequest").appendChild(requestCopy);
        }

        document.getElementById("request" + request[0].toNumber()).addEventListener("click", function () {
            var requestId = this.id.replace("request", "");
            showRequestDetails(requestId);
            return false;
        })
    }
}

const showInvestments = async () => {
    var investCount = await app.investmentCount();

    //showing all investment done by current investor
    for (var i = 1; i <= investCount; i++) {
        var investment = await app.investments(i);

        //if investor id of investment is equal to current investor id
        if (user[1].toNumber() == investment[1].toNumber()) {
            var requestId = investment[2].toNumber();
            var request = await app.requests(requestId);
            var startId = request[1].toNumber();
            var startup = await app.startups(startId);

            document.getElementById("noMyInvest").hidden = true;
            var myInvestTemp = document.getElementById("myInvestTemplate");
            var myInvestCopy = myInvestTemp.content.cloneNode(true);

            myInvestCopy.getElementById("showStName").innerText = startup[1]; //startup name
            myInvestCopy.getElementById("showInvest").innerText = Math.round(investment[3].toNumber() / conversionFactor); //investment
            myInvestCopy.getElementById("showInvestDesc").innerText = investment[4]; //investment descriptiom
            myInvestCopy.getElementById("myInvestDetails").id = "myInvest" + request[0].toNumber();
            document.getElementById("myInvestment").appendChild(myInvestCopy);

            document.getElementById("myInvest" + request[0].toNumber()).addEventListener("click", function () {
                var requestId = this.id.replace("myInvest", "");
                showRequestDetails(requestId);
                return false;
            })
        }
    }
}

const init = async () => {
    await showRequests();
    await showInvestments();

    const investmentForm = document.getElementById("investmentForm");

    $("#investModal").on("hidden.bs.modal", () => {
        investmentForm.reset();
    });

    investmentForm.onsubmit = () => {
        investToStartup();
        return false;
    }
}

window.onload = await init();