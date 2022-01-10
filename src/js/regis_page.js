import {app} from './app.js';

const donorSignUpForm = document.getElementById("donorSignUpForm");

const generateHash = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const donorSignUp = async() => {

    var donorName = document.getElementById("donorName").value;
    var donorMail = document.getElementById("donorMail").value;
    var donorPass = document.getElementById("donorPass").value;
    donorPass = await generateHash(donorPass);

    try{
        await app.addDonor(donorName, donorMail, donorPass);
        window.alert("Congratulations! Your account has been registered successfully!");
        donorSignUpForm.reset();
        window.location.replace("/html/login_page.html");
    }
    catch(e){
        console.error(e);
        window.alert("Can't register. Ethereum account or Email id is already registered!");
    }
}

donorSignUpForm.onsubmit = () => {
    donorSignUp(); 
    return false;
}


