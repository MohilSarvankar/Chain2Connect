import { app, web3 } from './initialise.js';

web3.eth.defaultAccount = ethereum._state.accounts[0];
var account = ethereum._state.accounts[0];
var user = await app.users(account);

//for logging out
document.getElementById("logout").addEventListener("click", () => {
    window.location.replace("/html/login_page.html");
})

var clickedProg = "prog0";
var conversionFactor = 2954878866493; //for converting rupees to wei

const donationValid = async (amount) => {
    var progId = clickedProg.replace("prog", "");
    var program = await app.programs(progId);
    var targetAmount = program[6].toNumber();
    var generatedAmount = Math.round(program[5].toNumber() / conversionFactor);

    if (amount <= (targetAmount - generatedAmount)) {
        return true;
    }
    else {
        return false;
    }
}

const donateToProgram = async () => {
    var amountRupee = document.getElementById("amount").value;
    var amountWei = amountRupee * conversionFactor;
    var donationDesc = document.getElementById("donationDesc").value;
    var progId = clickedProg.replace("prog", "");

    var isDonationValid = await donationValid(amountRupee);

    if (isDonationValid) {
        try {
            await app.donateToProgram(progId, donationDesc, { from: account, value: amountWei });
            $("#donation").modal('hide');
            window.alert("Congratulations! Donation successful.");
            window.location.reload();
        }
        catch (e) {
            console.error(e);
            $("#donation").modal('hide');
            window.alert("Donation failed! Please try again.");
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
            activeCopy.getElementById("showProgEnrolls").innerText = program[4].toNumber(); //no.of enrollments
            activeCopy.getElementById("showTargetAmount").innerText = program[6].toNumber() + " Rs"; //Target Amount
            activeCopy.getElementById("showCurrentAmount").innerText = Math.round(program[5].toNumber() / conversionFactor) + " Rs"; //Current Amount
            activeCopy.getElementById("donate").id = "prog" + program[0].toNumber();
            document.getElementById("activeProgram").appendChild(activeCopy);

            document.getElementById("prog" + program[0].toNumber()).addEventListener("click", function () {
                clickedProg = this.id;
                return false;
            });

            const donationForm = document.getElementById("donationForm");

            $("#donation").on("hidden.bs.modal", () => {
                donationForm.reset();
            });

            donationForm.onsubmit = () => {
                donateToProgram();
                return false;
            }
        }
        else {
            document.getElementById("noOfflinePrograms").hidden = true;
            var offlineTemp = document.getElementById("offlineProgTemplate");
            var offlineCopy = offlineTemp.content.cloneNode(true);

            offlineCopy.getElementById("showProgName").innerText = program[2]; //program name
            offlineCopy.getElementById("showNgoName").innerText = ngo[1]; //ngo name
            offlineCopy.getElementById("showProgDesc").innerText = program[3]; //program description
            offlineCopy.getElementById("showProgEnrolls").innerText = program[4].toNumber(); //no.of enrollments
            offlineCopy.getElementById("showTargetAmount").innerText = program[6].toNumber() + " Rs"; //Target Amount
            offlineCopy.getElementById("showCurrentAmount").innerText = Math.round(program[5].toNumber() / conversionFactor) + " Rs"; //Current Amount
            document.getElementById("offlineProgram").appendChild(offlineCopy);
        }
    }

}

const showDonations = async () => {
    var donationCount = await app.donationCount();

    //showing all donations done by current user
    for (var i = 1; i <= donationCount; i++) {
        var donation = await app.donations(i);

        //if current donor id is equal to donor id in donation
        if (user[1].toNumber() == donation[1].toNumber()) {
            var program = await app.programs(donation[2].toNumber()); //accessing program with program id in donation
            var ngo = await app.ngos(program[1].toNumber()); //accessing ngo with ngo id in program

            document.getElementById("noDonatedPrograms").hidden = true;
            var donationTemp = document.getElementById("myDonationTemplate");
            var donationCopy = donationTemp.content.cloneNode(true);

            donationCopy.getElementById("showProgName").innerText = program[2]; //program name
            donationCopy.getElementById("showNgoName").innerText = ngo[1]; //ngo name
            donationCopy.getElementById("showProgEnrolls").innerText = program[4].toNumber(); //no.of enrollments
            donationCopy.getElementById("showDonationAmount").innerText = Math.round(donation[3] / conversionFactor) + " Rs"; //amount donated
            donationCopy.getElementById("showDonationDesc").innerText = donation[4]; //donation description
            document.getElementById("myDonations").appendChild(donationCopy);
        }
    }
}

const init = async () => {
    await showPrograms();
    await showDonations();
}

window.onload = await init();