import { app, web3 } from './initialise.js'

web3.eth.defaultAccount = ethereum._state.accounts[0];
var account = ethereum._state.accounts[0];

//for logging out
document.getElementById("logout").addEventListener("click", () => {
    window.location.replace("/html/login_page.html");
})

var clickedProgEnroll = "progEnroll0";
var clickedProgDonation = "progDonation0";
var clickedRemoveProg = "removeProg0";
var clickedProduct = "product0";
var clickedOrder = "order0";

var conversionFactor = 2954878866493; //for converting rupees to wei
var myPrograms = [];
var benEnrolls = [];
var user = await app.users(account);

const createProgram = async () => {
    var progName = document.getElementById("progName").value;
    var progDesc = document.getElementById("progDesc").value;
    var targetAmount = document.getElementById("targetAmount").value;

    try {
        await app.addProgram(progName, progDesc, targetAmount);
        window.alert("Congratulation! Program created successfully!");
        createProgramForm.reset();
        window.location.reload();
    }
    catch (e) {
        console.error(e);
        window.alert("Sorry! Program not created. Please try again.");
        createProgramForm.reset();
    }
}

const showBenEnrolled = async () => {
    var progId = clickedProgEnroll.replace("progEnroll", "");
    var program = await app.programs(progId);
    var enrollCount = await app.enrollCount();
    var benCount = 0;

    if (!program[7]) {
        document.getElementById("benSelect").hidden = true;
    }

    for (var i = 1; i <= enrollCount; i++) {
        var enrollment = await app.enrollments(i);

        //if enrolled program is current program
        if (enrollment[2].toNumber() == progId) {
            benCount++;
            var beneficiary = await app.beneficiaries(enrollment[1].toNumber());

            var benEnrollTemp = document.getElementById("benEnrollTemp");
            var enrollCopy = benEnrollTemp.content.cloneNode(true);

            enrollCopy.getElementById("showBenCount").innerText = benCount; //Enrollment count
            enrollCopy.getElementById("showBenName").innerText = beneficiary[1]; //beneficiary name
            if (enrollment[3]) {
                enrollCopy.getElementById("showApproveStatus").innerText = "Approved"; //enrollment status
            }
            else {
                enrollCopy.getElementById("showNotApproveStatus").innerText = "Not Approved"; //enrollment status
            }

            if (program[7]) {
                enrollCopy.getElementById("benSelect").id = "benOption" + enrollment[0].toNumber(); //enrollment select
                document.getElementById("benEnrolls").appendChild(enrollCopy);

                document.getElementById("benOption" + enrollment[0].toNumber()).addEventListener("change", function () {
                    var enrollId = this.id.replace("benOption", "");
                    if (this.checked) {
                        benEnrolls.push(enrollId);
                    }
                    else {
                        benEnrolls.pop(enrollId);
                    }
                    return false;
                });
            }
            else {
                enrollCopy.getElementById("benSelect").hidden = true;
                enrollCopy.getElementById("benSelectBox").hidden = true;
                document.getElementById("benEnrolls").appendChild(enrollCopy);
            }
        }
    }
}

const approveEnrollments = async () => {
    try {
        await app.approveEnrollment(benEnrolls, benEnrolls.length);
        $("#enrollDetailsModal").modal('hide');
        window.alert("Congratulations! Selected enrolled candidates are approved successfully.");
    }
    catch (e) {
        console.error(e);
        $("enrollDetailsModal").modal('hide');
        window.alert("Sorry! Approval failed. Please try again.");
    }
    benEnrolls.length = 0;
}

const rejectEnrollments = async () => {
    try {
        await app.removeEnrollment(benEnrolls, benEnrolls.length);
        $("#enrollDetailsModal").modal('hide');
        window.alert("Selected enrollments are rejected successfully.");
    }
    catch (e) {
        console.error(e);
        $("enrollDetailsModal").modal('hide');
        window.alert("Sorry! Rejection failed. Please try again.");
    }
    benEnrolls.length = 0;
}

const showProgDonations = async () => {
    var progId = clickedProgDonation.replace("progDonation", "");
    var donationCount = await app.donationCount();
    var donorCount = 0;

    for (var i = 1; i <= donationCount; i++) {
        var donation = await app.donations(i);

        if (donation[2].toNumber() == progId) {
            donorCount++;
            var donor = await app.donors(donation[1].toNumber());

            var donationTemp = document.getElementById("donationDetailTemp");
            var doonationCopy = donationTemp.content.cloneNode(true);

            doonationCopy.getElementById("showDonorCount").innerText = donorCount; //donation count
            doonationCopy.getElementById("showDonorName").innerText = donor[1]; //donor name
            doonationCopy.getElementById("showDonatedAmount").innerText = Math.round(donation[3].toNumber() / conversionFactor) + " Rs"; //Donation Amount
            document.getElementById("showDonations").appendChild(doonationCopy);
        }
    }
}

const isProgramRemoveValid = async () => {
    var progId = clickedRemoveProg.replace("removeProg", "");
    var program = await app.programs(progId);
    var genAmount = Math.round(program[5].toNumber() / conversionFactor);
    var spentAmount = Math.round(program[8].toNumber() / conversionFactor);

    if (spentAmount < genAmount) {
        document.getElementById("removeProgramValid").hidden = true;
        document.getElementById("removeProgramBtn").disabled = true;
    }
    else {
        document.getElementById("removeProgramInvalid").hidden = true;
    }
}

const removeProgram = async () => {
    var progId = clickedRemoveProg.replace("removeProg", "");

    try {
        await app.removeProgram(progId);
        $("#removeProgramModal").modal('hide');
        window.alert("Program ended successfully.");
        window.location.reload();
    }
    catch (e) {
        console.error(e);
        $("#removeProgramModal").modal('hide');
        window.alert("Program ending failed! Please try again.");
    }
}

const showPrograms = async () => {
    var progCount = await app.progCount();

    for (var i = 1; i <= progCount; i++) {
        var program = await app.programs(i);
        var ngoId = program[1].toNumber();
        var ngo = await app.ngos(ngoId);

        //if programs are ongoing then show then in active tab else in offline tab
        if (program[7]) {
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

        //if current ngo id is equal to ngo id of program
        if (ngoId == user[1]) {
            document.getElementById("noMyPrograms").hidden = true;
            var myTemp = document.getElementById("myProgTemplate");
            var myCopy = myTemp.content.cloneNode(true);

            myCopy.getElementById("showProgDesc").innerText = program[3]; //program description
            myCopy.getElementById("showProgEnrolls").innerText = program[4].toNumber(); //no.of enrolments
            myCopy.getElementById("showTargetAmount").innerText = program[6].toNumber() + " Rs"; //Target Amount
            myCopy.getElementById("showCurrentAmount").innerText = Math.round(program[5].toNumber() / conversionFactor) + " Rs"; //Current Amount
            myCopy.getElementById("enrollDetails").id = "progEnroll" + program[0].toNumber();
            myCopy.getElementById("progDonations").id = "progDonation" + program[0].toNumber();

            if (program[7]) {
                myCopy.getElementById("showProgName").innerText = program[2]; //program name
                myCopy.getElementById("removeProgram").id = "removeProg" + program[0].toNumber();
                document.getElementById("myActiveProgram").appendChild(myCopy);

                document.getElementById("progEnroll" + program[0].toNumber()).addEventListener("click", function () {
                    clickedProgEnroll = this.id;
                    $("#benEnrolls tr").remove();
                    showBenEnrolled();

                    document.getElementById("approveEnroll").addEventListener("click", function () {
                        approveEnrollments();
                        return false;
                    })

                    document.getElementById("rejectEnroll").addEventListener("click", function () {
                        rejectEnrollments();
                        return false;
                    })

                    return false;
                });

                document.getElementById("removeProg" + program[0].toNumber()).addEventListener("click", function () {
                    clickedRemoveProg = this.id;
                    isProgramRemoveValid();
                    return false;
                })

                const removeProgramForm = document.getElementById("removeProgramForm");
                $("#removeProgramModal").on("hidden.bs.modal", () => {
                    removeProgramForm.reset();
                });

                removeProgramForm.onsubmit = () => {
                    removeProgram();
                    return false;
                }
            }
            else {
                myCopy.getElementById("showProgName").innerText = program[2] + " (Ended)"; //program name
                myCopy.getElementById("removeProgram").hidden = true;
                document.getElementById("myOfflineProgram").appendChild(myCopy);

                document.getElementById("progEnroll" + program[0].toNumber()).addEventListener("click", function () {
                    clickedProgEnroll = this.id;
                    $("#benEnrolls tr").remove();
                    showBenEnrolled();
                    document.getElementById("approveEnroll").hidden = true;
                    document.getElementById("rejectEnroll").hidden = true;
                    return false;
                });
            }

            document.getElementById("progDonation" + program[0].toNumber()).addEventListener("click", function () {
                clickedProgDonation = this.id;
                $("#showDonations tr").remove();
                showProgDonations();
                return false;
            })

            if (program[7]) {
                myPrograms.push([program[0].toNumber(), program[2]]);
            }
        }
    }
}

const fillOrderDetails = async () => {
    var productId = clickedProduct.replace("product", "");
    var product = await app.products(productId);
    document.getElementById("orderProdName").innerText = product[1];
    document.getElementById("orderProdPrice").innerText = product[3].toNumber() + " Rs";
    document.getElementById("orderCost").innerText = "0 Rs";

    document.getElementById("orderQuantity").addEventListener("change", () => {
        var orderQuantity = document.getElementById("orderQuantity").value;
        document.getElementById("orderCost").innerText = (product[3].toNumber() * orderQuantity) + " Rs";
    });
}

const orderValid = async (productId, orderQuantity) => {
    var product = await app.products(productId);
    var avQuantity = product[4].toNumber();

    if (avQuantity >= orderQuantity) {
        return true;
    }
    else {
        return false;
    }
}

const orderProduct = async () => {
    var progId = document.getElementById("progSelect").value;
    var productId = clickedProduct.replace("product", "");
    var quantity = document.getElementById("orderQuantity").value;

    var isOrderValid = await orderValid(productId, quantity);

    if (isOrderValid) {
        try {
            await app.placeOrder(progId, productId, quantity);
            $("#orderDetails").modal('hide');
            window.alert("Congratulations! Order successful.");
            window.location.reload();
        }
        catch (e) {
            console.error(e);
            $("#orderDetails").modal('hide');
            window.alert("Order failed! Please try again.");
        }
    }
    else {
        //if ordered quantity is greater than available quantity
        document.getElementById("quantityInvalid").innerText = "Ordered quantity is greater than the available quantity";
        setTimeout(() => {
            document.getElementById("quantityInvalid").innerText = "";
        }, 2000);
    }
}

const showProducts = async () => {
    var productCount = await app.productCount();

    for (var i = 1; i <= productCount; i++) {
        var product = await app.products(i);
        var storeId = product[5].toNumber();
        var store = await app.stores(storeId);

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
            storeCopy.getElementById("orderNow").id = "product" + product[0].toNumber();
            document.getElementById("store").appendChild(storeCopy);

            document.getElementById("product" + product[0].toNumber()).addEventListener("click", function () {
                clickedProduct = this.id;
                fillOrderDetails();
                return false;
            });

            const orderDetailsForm = document.getElementById("orderDetailsForm");
            $("#orderDetails").on("hidden.bs.modal", () => {
                orderDetailsForm.reset();
            });

            orderDetailsForm.onsubmit = () => {
                orderProduct();
                return false;
            }
        }
    }
}

const showProgramOptions = () => {

    for (var i = 0; i < myPrograms.length; i++) {
        //program select template in order details
        var progSelectTemp = document.getElementById("progSelectTemp");
        var progSelectCopy = progSelectTemp.content.cloneNode(true);

        progSelectCopy.getElementById("progOption").innerText = myPrograms[i][1]; //program name
        progSelectCopy.getElementById("progOption").value = myPrograms[i][0]; //program id
        document.getElementById("progSelect").appendChild(progSelectCopy);
    }
}

const fillPaymentDetails = async () => {
    var orderId = clickedOrder.replace("order", "");
    var order = await app.orders(orderId);

    document.getElementById("payAmount").value = order[4].toNumber() + " Rs";
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

const orderPayment = async () => {
    var orderId = clickedOrder.replace("order", "");
    var payAmount = document.getElementById("payAmount").value;
    var payDesc = document.getElementById("payDesc").value;
    var payAmountRs = payAmount.replace(" Rs", "");
    var payAmountWei = payAmountRs * conversionFactor;

    try {
        await app.payToStore(orderId, payDesc, { from: account, value: payAmountWei });
        window.alert("Congratulations! Payment successful.");
        window.location.reload();
    }
    catch (e) {
        console.error(e);
        $("#orderPayment").modal('hide');
        window.alert("Payment failed! Please try again.");
    }
}

const showOrders = async () => {
    var orderCount = await app.orderCount();

    for (var i = 0; i <= orderCount; i++) {
        var order = await app.orders(i);
        var progId = order[1].toNumber();
        var program = await app.programs(progId);

        if (program[1].toNumber() == user[1]) {
            var productId = order[2].toNumber();
            var product = await app.products(productId);

            document.getElementById("noOrders").hidden = true;
            var myOrderTemp = document.getElementById("myOrderTemplate");
            var myOrderCopy = myOrderTemp.content.cloneNode(true);

            myOrderCopy.getElementById("showProductName").innerText = product[1]; //product name
            myOrderCopy.getElementById("showProductDetails").innerText = product[2]; //product details
            myOrderCopy.getElementById("showProgName").innerText = program[2]; //program name
            myOrderCopy.getElementById("showOrderQuantity").innerText = order[3].toNumber(); //order quantity
            myOrderCopy.getElementById("showOrderCost").innerText = order[4].toNumber() + " Rs"; //order cost

            //if order is delivered or not
            if (order[5]) {
                var sOrderPaid = await orderPaid(order[0].toNumber());

                if (sOrderPaid[0]) {
                    myOrderCopy.getElementById("orderPay").hidden = true;
                    var payment = await app.payments(sOrderPaid[1]);

                    myOrderCopy.getElementById("showOrderStatus").innerText = "Delivered & Paid"; //order status
                    myOrderCopy.getElementById("showPaymentDesc").innerText = payment[3];
                    document.getElementById("myPayedOrders").appendChild(myOrderCopy);
                }
                else {
                    myOrderCopy.getElementById("showOrderStatus").innerText = "Delivered"; //order status
                    myOrderCopy.getElementById("paymentDetails").hidden = true;
                    myOrderCopy.getElementById("orderPay").id = "order" + order[0].toNumber();
                    document.getElementById("myDeliveredOrders").appendChild(myOrderCopy);

                    document.getElementById("order" + order[0].toNumber()).addEventListener("click", function () {
                        clickedOrder = this.id;
                        fillPaymentDetails();
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
                myOrderCopy.getElementById("paymentDetails").hidden = true;
                document.getElementById("myNotDeliveredOrders").appendChild(myOrderCopy);
            }
        }
    }
}

const createProgramForm = document.getElementById("createProgramForm");
    
createProgramForm.onsubmit = () => {
    createProgram();
    return false;
}

const init = async () => {
    await showPrograms();
    await showProducts();
    showProgramOptions();
    await showOrders();
}

window.onload = await init();