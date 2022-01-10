import {app} from './app2.js';

const invSignUpForm = document.getElementById("invSignUpForm");

const generateHash = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const invSignUp = async() => {

    var invName = document.getElementById("invName").value;
    var invMail = document.getElementById("invMail").value;
    var invPass = document.getElementById("invPass").value;

    invPass = await generateHash(invPass);

    try{
        await app.addInvestor(invName, invMail, invPass);
        window.alert("Congratulations! Your account has been registered successfully!");
        invSignUpForm.reset();
        window.location.replace("/html/login_startup.html");
    }
    catch(e){
        console.error(e);
        window.alert("Can't register. Ethereum account or Email id is already registered!");
    }
}

invSignUpForm.onsubmit = () => {
    invSignUp(); 
    return false;
}
