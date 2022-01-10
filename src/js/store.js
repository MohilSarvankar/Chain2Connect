import { app, web3 } from './initialise.js'

web3.eth.defaultAccount = ethereum._state.accounts[0];
var account = ethereum._state.accounts[0];

//for logging out
document.getElementById("logout").addEventListener("click", () => {
    window.location.replace("/html/login_page.html");
})

var conversionFactor = 2954878866493; //for converting rupees to wei
var user = await app.users(account);
var clickedOrder = "order0";

const addProduct = async () => {
    var productName = document.getElementById("productName").value;
    var productDetails = document.getElementById("productDetails").value;
    var productQuantity = document.getElementById("productQuantity").value;
    var productPrice = document.getElementById("productPrice").value;

    try {
        await app.addProduct(productName, productDetails, productPrice, productQuantity);
        window.alert("Congratulations! Product added successfully!")
        window.location.reload();
    }
    catch (e) {
        console.error(e);
        window.alert("Sorry! Product not added. Please try again.");
        addProductForm.reset();
    }
}

const showPrograms = async () => {
    var progCount = await app.progCount();

    for (var i = 1; i <= progCount; i++) {
        var program = await app.programs(i);
        var ngoId = program[1].toNumber();
        var ngo = await app.ngos(ngoId);

        //if programs are ongoing then show then in active tab else in offline tab
        if (program[7] == true) {
            document.getElementById("noActivePrograms").hidden = true;
            var activeTemp = document.getElementById("activeProgTemplate");
            var activeCopy = activeTemp.content.cloneNode(true);

            activeCopy.getElementById("showProgName").innerText = program[2]; //program name
            activeCopy.getElementById("showNgoName").innerText = ngo[1]; //ngo name
            activeCopy.getElementById("showProgDesc").innerText = program[3]; //program description
            activeCopy.getElementById("showProgEnrolls").innerText = program[4].toNumber(); //no.of enrolments
            activeCopy.getElementById("showTargetAmount").innerText = program[6].toNumber() + " Rs"; //Target Amount
            activeCopy.getElementById("showCurrentAmount").innerText = Math.round(program[5].toNumber() / conversionFactor) + " Rs"; //Current Amount
            document.getElementById("activeProgram").appendChild(activeCopy);
        }
        else {
            document.getElementById("noOfflinePrograms").hidden = true;
            var offlineTemp = document.getElementById("offlineProgTemplate");
            var offlineCopy = offlineTemp.content.cloneNode(true);

            offlineCopy.getElementById("showProgName").innerText = program[2]; //program name
            offlineCopy.getElementById("showNgoName").innerText = ngo[1]; //ngo name
            offlineCopy.getElementById("showProgDesc").innerText = program[3]; //program description
            offlineCopy.getElementById("showProgEnrolls").innerText = program[4].toNumber(); //no.of enrolments
            offlineCopy.getElementById("showTargetAmount").innerText = program[6].toNumber() + " Rs"; //Target Amount
            offlineCopy.getElementById("showCurrentAmount").innerText = Math.round(program[5].toNumber() / conversionFactor) + " Rs"; //Current Amount
            document.getElementById("offlineProgram").appendChild(offlineCopy);
        }
    }
}

const showProducts = async () => {
    var productCount = await app.productCount();

    for (var i = 1; i <= productCount; i++) {
        var product = await app.products(i);
        var storeId = product[5].toNumber();
        var store = await app.stores(storeId);

        //if products are added by the same store
        if (user[1].toNumber() == storeId) {
            document.getElementById("noMyProducts").hidden = true;
            var myProductTemp = document.getElementById("myProductTemplate");
            var myProductCopy = myProductTemp.content.cloneNode(true);

            myProductCopy.getElementById("showProductName").innerText = product[1]; //product name
            myProductCopy.getElementById("showProductDetails").innerText = product[2]; //product details
            myProductCopy.getElementById("showProductQuantity").innerText = product[4].toNumber(); //product quantity
            myProductCopy.getElementById("showProductPrice").innerText = product[3].toNumber() + " Rs"; //product price
            document.getElementById("myProduct").appendChild(myProductCopy);
        }

        //showing details in the store section if quantity is greater than 0
        if (product[4].toNumber() > 0) {
            document.getElementById("noStoreProducts").hidden = true;
            var storeTemplate = document.getElementById("storeTemplate");
            var storeCopy = storeTemplate.content.cloneNode(true);

            storeCopy.getElementById("showProductName").innerText = product[1]; //product name
            storeCopy.getElementById("showProductDetails").innerText = product[2]; //product details
            storeCopy.getElementById("showStoreName").innerText = store[1]; //store name
            storeCopy.getElementById("showProductQuantity").innerText = product[4].toNumber(); //product quantity
            storeCopy.getElementById("showProductPrice").innerText = product[3].toNumber() + " Rs"; //product price
            document.getElementById("store").appendChild(storeCopy);
        }
    }
}

const orderPaid = async (orderId) => {
    var payCount = await app.paymentCount();

    for (var i = 1; i <= payCount; i++) {
        var payment = await app.payments(i);

        if (orderId == payment[1].toNumber()) {
            return true;
        }
    }
    return false;
}

const updateOrderStatus = async () => {
    var orderId = clickedOrder.replace("order", "");
    try {
        await app.changeDeliveryStatus(orderId);
        window.alert("Congratulations! Status update successful.");
        $("#statusUpdate").modal('hide');
        window.location.reload();
    }
    catch (e) {
        console.error(e);
        window.alert("Sorry! Status update failed. Please try again.")
        $("#statusUpdate").modal('hide');
    }
}

const showOrders = async () => {
    var orderCount = await app.orderCount();

    for (var i = 1; i <= orderCount; i++) {
        var order = await app.orders(i);
        var prodId = order[2].toNumber();
        var product = await app.products(prodId);

        if (product[5].toNumber() == user[1]) {
            var program = await app.programs(order[1].toNumber());

            document.getElementById("noOrders").hidden = true;
            var orderTemp = document.getElementById("orderTemplate");
            var orderCopy = orderTemp.content.cloneNode(true);

            orderCopy.getElementById("showProductName").innerText = product[1]; //product name
            orderCopy.getElementById("showProductDetails").innerText = product[2]; //product details
            orderCopy.getElementById("showProgName").innerText = program[2]; //program name
            orderCopy.getElementById("showOrderQuantity").innerText = order[3].toNumber(); //order quantity
            orderCopy.getElementById("showOrderCost").innerText = order[4].toNumber() + " Rs"; //order cost

            //if order is delivered or not
            if (order[5]) {
                orderCopy.getElementById("orderStatusUpdate").hidden = true;
                var isOrderPaid = await orderPaid(order[0].toNumber());

                if (isOrderPaid) {
                    orderCopy.getElementById("showOrderStatus").innerText = "Delivered & Paid"; //order status
                    document.getElementById("deliveredPaidOrders").appendChild(orderCopy);
                }
                else {
                    orderCopy.getElementById("showOrderStatus").innerText = "Delivered"; //order status
                    document.getElementById("deliveredOrders").appendChild(orderCopy);
                }
            }
            else {
                orderCopy.getElementById("showOrderStatus").innerText = "Not Delivered"; //order status
                orderCopy.getElementById("orderStatusUpdate").id = "order" + order[0].toNumber();
                document.getElementById("notDeliveredOrders").appendChild(orderCopy);

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

const addProductForm = document.getElementById("addProductForm");

addProductForm.onsubmit = () => {
    addProduct();
    return false;
}

const init = async () => {
    await showPrograms();
    await showProducts();
    await showOrders();
}

window.onload = await init();
