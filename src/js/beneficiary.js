import { app, web3 } from './initialise.js';

web3.eth.defaultAccount = ethereum._state.accounts[0];
var account = ethereum._state.accounts[0];

//for logging out
document.getElementById("logout").addEventListener("click", () => {
    window.location.replace("/html/login_page.html");
})

var conversionFactor = 2954878866493; //for converting rupees to wei
var clickedEnroll = "enrollFeed0";
var user = await app.users(account);

const isEnrollmentValid = async (progId) => {
    var enrollCount = await app.enrollCount();
    var user = await app.users(account);

    for (var i = 1; i <= enrollCount; i++) {
        var enroll = await app.enrollments(i);
        //if benficiary enrolled id is equal to current beneficiary id
        if (enroll[1].toNumber() == user[1].toNumber() && progId == enroll[2].toNumber()) {
            return false;
        }
    }
    return true;
}

const enrollToProgram = async (progId) => {
    var isValid = await isEnrollmentValid(progId);
    if (isValid) {
        try {
            await app.enrollToProgram(progId);
            window.location.reload();
        }
        catch (e) {
            console.error(e);
        }
    }
    else {
        window.alert("You have already enrolled for the current program. Can't enroll again!");
    }
}

const giveFeedback = async () => {
    var enrollId = clickedEnroll.replace("enrollFeed", "");

    try {
        await app.addFeedback(enrollId, true);
        $("#feedbackModal").modal('hide');
        window.alert("Thank you! Your feedback is noted successfully.");
        window.location.reload();
    }
    catch (e) {
        console.error(e);
        $("#feedbackModal").modal('hide');
        window.alert("Sorry! Feedback not noted. Please try again.");
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
            activeCopy.getElementById("enroll").id = "prog" + program[0].toNumber();
            document.getElementById("activeProgram").appendChild(activeCopy);

            document.getElementById("prog" + program[0].toNumber()).addEventListener("click", function () {
                var progId = this.id.replace("prog", "");
                enrollToProgram(progId);
                return false;
            });
        }
        else {
            document.getElementById("noOfflinePrograms").hidden = true;
            var offlineTemp = document.getElementById("offlineProgTemplate");
            var offlineCopy = offlineTemp.content.cloneNode(true);

            offlineCopy.getElementById("showProgName").innerText = program[2]; //program name
            offlineCopy.getElementById("showNgoName").innerText = ngo[1]; //ngo name
            offlineCopy.getElementById("showProgDesc").innerText = program[3]; //program description
            offlineCopy.getElementById("showProgEnrolls").innerText = program[4].toNumber(); //no.of enrollments
            offlineCopy.getElementById("showCurrentAmount").innerText = Math.round(program[5].toNumber() / conversionFactor) + " Rs"; //Current Amount
            offlineCopy.getElementById("showTargetAmount").innerText = program[6].toNumber() + " Rs"; //Target Amount
            document.getElementById("offlineProgram").appendChild(offlineCopy);
        }
    }
}

const enrollComplete = async (enrollId) => {
    var feedCount = await app.feedCount();

    for (var i = 1; i <= feedCount; i++) {
        var feedback = await app.feedbacks(i);

        if (enrollId == feedback[1].toNumber()) {
            return true;
        }
    }
    return false;
}

const showEnrollmwnts = async () => {
    var enrollCount = await app.enrollCount();

    for (var i = 1; i <= enrollCount; i++) {
        var enroll = await app.enrollments(i);

        //if benficiary enrolled id is equal to current beneficiary id
        if (enroll[1].toNumber() == user[1].toNumber()) {
            var program = await app.programs(enroll[2].toNumber());
            var ngoId = program[1].toNumber();
            var ngo = await app.ngos(ngoId);

            var enrolledTemp = document.getElementById("enrolledProgTemplate");
            var enrolledCopy = enrolledTemp.content.cloneNode(true);

            enrolledCopy.getElementById("showProgName").innerText = program[2]; //program name
            enrolledCopy.getElementById("showNgoName").innerText = ngo[1]; //ngo name
            enrolledCopy.getElementById("showProgDesc").innerText = program[3]; //program description
            enrolledCopy.getElementById("showProgEnrolls").innerText = program[4].toNumber(); //no.of enrollments
            enrolledCopy.getElementById("showTargetAmount").innerText = program[6].toNumber() + " Rs"; //Target Amount
            enrolledCopy.getElementById("showCurrentAmount").innerText = Math.round(program[5].toNumber() / conversionFactor) + " Rs"; //Current Amount

            var isEnrollComplete = await enrollComplete(enroll[0].toNumber());

            if (isEnrollComplete) {
                document.getElementById("noCompletedPrograms").hidden = true;
                enrolledCopy.getElementById("showApproveStatus").innerText = "Completed";
                enrolledCopy.getElementById("feedback").hidden = true;
                document.getElementById("completedProgram").appendChild(enrolledCopy);
            }
            else {
                if (program[7]) {
                    document.getElementById("noEnrolledPrograms").hidden = true;
                    if (enroll[3]) {
                        enrolledCopy.getElementById("showApproveStatus").innerText = "Approved";
                        enrolledCopy.getElementById("feedback").id = "enrollFeed" + enroll[0].toNumber();
                        document.getElementById("approvedPrograms").appendChild(enrolledCopy);

                        document.getElementById("enrollFeed" + enroll[0].toNumber()).addEventListener("click", function () {
                            clickedEnroll = this.id;
                            return false;
                        });

                        var feedbackForm = document.getElementById("feedbackForm");
                        feedbackForm.onsubmit = () => {
                            giveFeedback();
                            return false;
                        }

                        $("#feedbackModal").on("hidden.bs.modal", () => {
                            feedbackForm.reset();
                        });
                    }
                    else {
                        enrolledCopy.getElementById("showApproveStatus").innerText = "Not Approved";
                        enrolledCopy.getElementById("feedback").hidden = true;
                        document.getElementById("notApprovedPrograms").appendChild(enrolledCopy);
                    }
                }
            }
        }
    }
}

const init = async () => {
    await showPrograms();
    await showEnrollmwnts();
}

window.onload = await init();
