import { app, web3 } from './initialise2.js'

web3.eth.defaultAccount = ethereum._state.accounts[0];
var account = ethereum._state.accounts[0];
var user = await app.users(account);

var conversionFactor = 2954878866493; //for converting rupees to wei
var myRequestId = 0;
var clickedOrder = "order0";

//for logging out
document.getElementById("logout").addEventListener("click", () => {
    window.location.replace("/html/login_startup.html");
})

const fundRequestValid = (curRatio, gpRatio, arTurnover) => {
    //checking format of current ratio
    if (Number(curRatio) == curRatio && curRatio % 1 !== 0 && curRatio > 0 && curRatio < 1 || curRatio == 1 || curRatio == 0) {
        //checking format of gross profit ratio
        if (Number(gpRatio) == gpRatio && gpRatio % 1 !== 0 && gpRatio > 0 && gpRatio < 1 || gpRatio == 1 || gpRatio == 0) {
            //checking format of account recievable turnover
            if (arTurnover.includes(":")) {
                arTurnover = arTurnover.trim();
                var arr = arTurnover.split(":");
                if (Number(arr[0]) == arr[0] && Number(arr[1]) == arr[1]) {
                    return true;
                }
                else {
                    document.getElementById("arTurnoverInvalid").innerText = "Please enter the valid numbers";
                    setTimeout(() => {
                        document.getElementById("arTurnoverInvalid").innerText = "";
                    }, 2000);
                }
            }
            else {
                document.getElementById("arTurnoverInvalid").innerText = "Please enter the data in x:y format";
                setTimeout(() => {
                    document.getElementById("arTurnoverInvalid").innerText = "";
                }, 2000);
            }
        }
        else {
            document.getElementById("gpRatioInvalid").innerText = "Please enter a valid number between 0 to  1";
            setTimeout(() => {
                document.getElementById("gpRatioInvalid").innerText = "";
            }, 2000);
        }
    }
    else {
        document.getElementById("curRatioInvalid").innerText = "Please enter a valid number between 0 to  1";
        setTimeout(() => {
            document.getElementById("curRatioInvalid").innerText = "";
        }, 2000);
    }
}

const createFundRequest = async () => {
    var curRatio = document.getElementById("curRatio").value;
    var gpRatio = document.getElementById("gpRatio").value;
    var arTurnover = document.getElementById("arTurnover").value;
    var npMargin = document.getElementById("npMargin").value;
    var totDebt = document.getElementById("totDebt").value;
    var burnRate = document.getElementById("burnRate").value;
    var revGenrated = document.getElementById("revGenrated").value;
    var nrAftTax = document.getElementById("nrAftTax").value;
    var targetFund = document.getElementById("targetFund").value;

    var isFundRequestValid = fundRequestValid(curRatio, gpRatio, arTurnover);
    curRatio = curRatio * 10000;
    gpRatio = gpRatio * 10000;

    if (isFundRequestValid) {
        var arr = arTurnover.split(":");
        arTurnover = arr[0].trim() + ":" + arr[1].trim();

        try {
            await app.addFundRequest(curRatio, gpRatio, npMargin, arTurnover, totDebt, burnRate, revGenrated, nrAftTax, targetFund);
            window.alert("Congratulations! Funding request created successfully.");
            window.location.reload();
        }
        catch (e) {
            console.error(e);
            window.alert("Sorry! You have already requested for funding once. Can't request again.");
            createRequestForm.reset();
        }
    }
}

const fillRequestDetails = async () => {
    var starId = user[1].toNumber();
    var startup = await app.startups(starId);

    document.getElementById("startName").value = startup[1];
    document.getElementById("startMail").value = startup[2];
    document.getElementById("startAdd").value = startup[4];
    document.getElementById("startDesc").value = startup[5];
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

const showFundingDetails = async (requestId) => {
    var investCount = await app.investmentCount();
    var investorCount = 0;

    for (var i = 1; i <= investCount; i++) {
        var investment = await app.investments(i);

        if (investment[2].toNumber() == requestId) {
            investorCount++;
            var investor = await app.investors(investment[1].toNumber());

            var investmentTemp = document.getElementById("investDetailTemp");
            var investCopy = investmentTemp.content.cloneNode(true);

            investCopy.getElementById("showInvestorCount").innerText = investorCount; //investor count
            investCopy.getElementById("showInvestorName").innerText = investor[1]; //investor name
            investCopy.getElementById("showInvestedAmount").innerText = Math.round(investment[3].toNumber() / conversionFactor) + " Rs"; //Invested Amount
            document.getElementById("showInvestment").appendChild(investCopy);
        }
    }
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
            document.getElementById("activeRequest").appendChild(requestCopy);
        }
        else {
            document.getElementById("noCompletedRequest").hidden = true;
            document.getElementById("completedRequest").appendChild(requestCopy);
        }

        document.getElementById("request" + request[0].toNumber()).addEventListener("click", function () {
            var requestId = this.id.replace("request", "");
            showRequestDetails(requestId);
            return false;
        })

        if (startId == user[1].toNumber()) {
            myRequestId = request[0].toNumber();
            document.getElementById("noMyRequest").hidden = true;
            var myTemp = document.getElementById("myRequestTemplate");
            var myCopy = myTemp.content.cloneNode(true);

            myCopy.getElementById("showStName").innerText = startup[1]; //startup name
            myCopy.getElementById("showStDesc").innerText = startup[5]; //startup description
            myCopy.getElementById("showTgFunding").innerText = request[10] + " Rs"; //target funding
            myCopy.getElementById("showRcFunding").innerText = Math.round(request[11].toNumber() / conversionFactor) + " Rs"; //recieved funding
            myCopy.getElementById("myRequestDetails").id = "myRequest" + request[0].toNumber();
            myCopy.getElementById("fundingDetails").id = "fundDetails" + request[0].toNumber();
            document.getElementById("myRequest").appendChild(myCopy);

            document.getElementById("myRequest" + request[0].toNumber()).addEventListener("click", function () {
                var requestId = this.id.replace("myRequest", "");
                showRequestDetails(requestId);
                return false;
            })

            document.getElementById("fundDetails" + request[0].toNumber()).addEventListener("click", function () {
                var requestId = this.id.replace("fundDetails", "");
                $("#showInvestment tr").remove();
                showFundingDetails(requestId);
                return false;
            })
        }
    }
}

const orderService = async (serviceId) => {
    try {
        await app.placeOrder(serviceId, myRequestId);
        $("#serviceOrderDetails").modal('hide');
        window.alert("Congratulations! Order successful.");
        window.location.reload();
    }
    catch (e) {
        console.error(e);
        $("#serviceOrderDetails").modal('hide');
        window.alert("Order failed! Please try again.");
    }
}

const fillOrderDetails = async (serviceId) => {
    var service = await app.services(serviceId);
    var startup = await app.startups(user[1].toNumber());

    document.getElementById("orderStartName").innerText = startup[1]; //startup name
    document.getElementById("orderServiceName").innerText = service[2]; //service name
    document.getElementById("orderServiceType").innerText = service[4]; //service type
    document.getElementById("orderServiceCost").innerText = service[5].toNumber() + " Rs"; //service cost

    document.getElementById("orderService").addEventListener("click", function () {
        orderService(serviceId);
        return false;
    })
}

const showServices = async () => {
    var serviceCount = await app.serviceCount();

    for (var i = 1; i <= serviceCount; i++) {
        var service = await app.services(i);
        var providerId = service[1].toNumber();
        var provider = await app.providers(providerId);

        document.getElementById("noServices").hidden = true;
        var serviceTemp = document.getElementById("serviceTemplate");
        var serviceCopy = serviceTemp.content.cloneNode(true);

        serviceCopy.getElementById("showServiceName").innerText = service[2]; //service name
        serviceCopy.getElementById("showServiceDetails").innerText = service[3]; //service details
        serviceCopy.getElementById("showProviderName").innerText = provider[1]; //provider name
        serviceCopy.getElementById("showServiceType").innerText = service[4]; //service type
        serviceCopy.getElementById("showServicePrice").innerText = service[5].toNumber() + " Rs"; //service price
        serviceCopy.getElementById("service").id = "service" + service[0].toNumber();
        document.getElementById("services").appendChild(serviceCopy);

        document.getElementById("service" + service[0].toNumber()).addEventListener("click", function () {
            var serviceId = this.id.replace("service", "");
            fillOrderDetails(serviceId);
            return false;
        })
    }
}

const orderPaid = async (orderId) => {
    var paymentCount = await app.paymentCount();

    for (var i = 1; i <= paymentCount; i++) {
        var payment = await app.payments(i);

        if (payment[1].toNumber() == orderId) {
            return [true, payment[0].toNumber()];
        }
    }
    return [false, 0];
}

const orderPayment = async() => {
    var orderId = clickedOrder.replace("order","");
    var payAmount = document.getElementById("payAmount").value;
    var payDesc = document.getElementById("payDesc").value;
    var payAmountRs = payAmount.replace(" Rs","");
    var payAmountWei = payAmountRs * conversionFactor;

    try{
        await app.payToProvider(orderId, payDesc, {from: account, value: payAmountWei});
        window.alert("Congratulations! Payment successful.");
        window.location.reload();
    }
    catch(e){
        console.error(e);
        $("#orderPayment").modal('hide');
        window.alert("Payment failed! Please try again.");
    }
}

const showOrders = async () => {
    var orderCount = await app.orderCount();

    for (var i = 1; i <= orderCount; i++) {
        var order = await app.orders(i);

        if (order[1].toNumber() == myRequestId) {
            var serviceId = order[2].toNumber();
            var service = await app.services(serviceId);

            document.getElementById("noOrders").hidden = true;
            var myOrderTemp = document.getElementById("myOrderTemplate");
            var myOrderCopy = myOrderTemp.content.cloneNode(true);

            myOrderCopy.getElementById("showServiceName").innerText = service[2]; //service name
            myOrderCopy.getElementById("showServiceDetails").innerText = service[3]; //service details
            myOrderCopy.getElementById("showServiceType").innerText = service[4]; //service type
            myOrderCopy.getElementById("showServiceCost").innerText = service[5] + " Rs"; //service cost

            //if order is delivered or not
            if (order[3]) {
                var isOrderPaid = await orderPaid(order[0].toNumber());

                if (isOrderPaid[0]) {
                    myOrderCopy.getElementById("orderPay").hidden = true;
                    var payment = await app.payments(isOrderPaid[1]);

                    myOrderCopy.getElementById("showOrderStatus").innerText = "Delivered & Paid"; //order status
                    myOrderCopy.getElementById("showPaymentDesc").innerText = payment[3];
                    document.getElementById("myPayedOrders").appendChild(myOrderCopy);
                }
                else {
                    myOrderCopy.getElementById("showOrderStatus").innerText = "Delivered"; //order status
                    myOrderCopy.getElementById("showPaymentDetails").hidden = true;
                    myOrderCopy.getElementById("orderPay").id = "order" + order[0].toNumber();
                    document.getElementById("myDeliveredOrders").appendChild(myOrderCopy);

                    document.getElementById("order" + order[0].toNumber()).addEventListener("click", async function () {
                        var orderId = this.id.replace("order", "");
                        var order = await app.orders(orderId);
                        var serviceId = order[2].toNumber();
                        var service = await app.services(serviceId);

                        document.getElementById("payAmount").value = service[5] + " Rs";
                        clickedOrder = this.id;
                        return false;
                    });

                    const orderPaymentForm = document.getElementById("orderPaymentForm");
                    $("#orderPayment").on("hidden.bs.modal", () => {
                        orderPaymentForm.reset();
                    });

                    orderPaymentForm.onsubmit = () => {
                        orderPayment();
                        return false;
                    }
                }
            }
            else {
                myOrderCopy.getElementById("showOrderStatus").innerText = "Not Delivered"; //order status
                myOrderCopy.getElementById("orderPay").hidden = true;
                myOrderCopy.getElementById("showPaymentDetails").hidden = true;
                document.getElementById("myNotDeliveredOrders").appendChild(myOrderCopy);
            }
        }
    }
}

const init = async () => {
    await showRequests();
    await showServices();
    await showOrders();
    await fillRequestDetails();

    const createRequestForm = document.getElementById("createRequestForm");

    createRequestForm.onsubmit = () => {
        createFundRequest();
        return false;
    }
}

window.onload = await init();