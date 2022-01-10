import { app, web3 } from './initialise2.js'

web3.eth.defaultAccount = ethereum._state.accounts[0];
var account = ethereum._state.accounts[0];
var user = await app.users(account);

var conversionFactor = 2954878866493; //for converting rupees to wei
var clickedOrder = "oredr0";

//for logging out
document.getElementById("logout").addEventListener("click", () => {
    window.location.replace("/html/login_startup.html");
})

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
    }
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
        document.getElementById("services").appendChild(serviceCopy);

        //if services are added by current service provider
        if (provider[0].toNumber() == user[1].toNumber()) {
            document.getElementById("noMyServices").hidden = true;
            var serviceTemp = document.getElementById("myServiceTemplate");
            var serviceCopy = serviceTemp.content.cloneNode(true);

            serviceCopy.getElementById("showServiceName").innerText = service[2]; //service name
            serviceCopy.getElementById("showServiceDetails").innerText = service[3]; //service details
            serviceCopy.getElementById("showServiceType").innerText = service[4]; //service type
            serviceCopy.getElementById("showServicePrice").innerText = service[5].toNumber() + " Rs"; //service price
            document.getElementById("myServices").appendChild(serviceCopy);
        }
    }
}

const addService = async () => {
    var serviceName = document.getElementById("serviceName").value;
    var serviceDetails = document.getElementById("serviceDetails").value;
    var serviceType = document.getElementById("serviceType").value;
    var servicePrice = document.getElementById("servicePrice").value;

    try {
        await app.addService(serviceName, serviceDetails, serviceType, servicePrice);
        window.alert("Congratulations! Service added successfully!")
        window.location.reload();
    }
    catch (e) {
        console.error(e);
        window.alert("Sorry! Service not added. Please try again.");
        addProductForm.reset();
    }
}

const updateOrderStatus = async() => {
    var orderId = clickedOrder.replace("order","");
    try{
        await app.changeDeliveryStatus(orderId);
        window.alert("Congratulations! Status update successful.");
        $("#statusUpdate").modal('hide');
        window.location.reload();
    }
    catch(e){
        console.error(e);
        window.alert("Sorry! Status update failed. Please try again.")
        $("#statusUpdate").modal('hide');
    }
}

const orderPaid = async (orderId) => {
    var paymentCount = await app.paymentCount();

    for (var i = 1; i <= paymentCount; i++) {
        var payment = await app.payments(i);

        if (payment[1].toNumber() == orderId) {
            return true;
        }
    }
    return false;
}

const showOrders = async () => {
    var orderCount = await app.orderCount();

    for (var i = 1; i <= orderCount; i++) {
        var order = await app.orders(i);
        var serviceId = order[2].toNumber();
        var service = await app.services(serviceId);

        if (service[1].toNumber() == user[1]) {
            var request = await app.requests(order[1].toNumber());
            var startup = await app.startups(request[1].toNumber());

            document.getElementById("noOrders").hidden = true;
            var myOrderTemp = document.getElementById("orderTemplate");
            var myOrderCopy = myOrderTemp.content.cloneNode(true);

            myOrderCopy.getElementById("showServiceName").innerText = service[2]; //service name
            myOrderCopy.getElementById("showServiceDetails").innerText = service[3]; //service details
            myOrderCopy.getElementById("showStartName").innerText = startup[1]; //startup name
            myOrderCopy.getElementById("showServiceType").innerText = service[4]; //service type
            myOrderCopy.getElementById("showServiceCost").innerText = service[5] + " Rs"; //service cost

            //if order is delivered or not
            if (order[3]) {
                myOrderCopy.getElementById("orderStatusUpdate").hidden = true;
                var isOrderPaid = await orderPaid(order[0].toNumber());

                if (isOrderPaid) {
                    myOrderCopy.getElementById("showOrderStatus").innerText = "Delivered & Paid"; //order status
                    document.getElementById("deliveredPaidOrders").appendChild(myOrderCopy);
                }
                else {
                    myOrderCopy.getElementById("showOrderStatus").innerText = "Delivered"; //order status
                    document.getElementById("deliveredOrders").appendChild(myOrderCopy);
                }
            }
            else {
                myOrderCopy.getElementById("showOrderStatus").innerText = "Not Delivered"; //order status
                myOrderCopy.getElementById("orderStatusUpdate").id = "order" + order[0].toNumber();
                document.getElementById("notDeliveredOrders").appendChild(myOrderCopy);

                document.getElementById("order" + order[0].toNumber()).addEventListener("click", function () {
                    clickedOrder = this.id;
                    return false;
                });

                var statusUpdateForm = document.getElementById("statusUpdateForm");
                $("#statusUpdate").on("hidden.bs.modal", () => {
                    statusUpdateForm.reset();
                });

                statusUpdateForm.onsubmit = () => {
                    updateOrderStatus();
                    return false;
                }
            }
        }
    }
}

const init = async () => {
    await showRequests();
    await showServices();
    await showOrders();

    const addServiceForm = document.getElementById("addServiceForm");

    addServiceForm.onsubmit = () => {
        addService();
        return false;
    }
}

window.onload = await init();