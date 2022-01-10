import {app} from './app2.js';

const providerSignUpForm = document.getElementById("providerSignUpForm");

const generateHash = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const providerSignUp = async() => {

    var providerName = document.getElementById("providerName").value;
    var providerMail = document.getElementById("providerMail").value;
    var providerPass = document.getElementById("providerPass").value;
    var providerAdd = document.getElementById("providerAdd").value;
    var providerDesc = document.getElementById("providerDesc").value;

    providerPass = await generateHash(providerPass);

    try{
        await app.addProvider(providerName, providerMail, providerPass, providerAdd, providerDesc);
        window.alert("Congratulations! Your account has been registered successfully!");
        providerSignUpForm.reset();
        window.location.replace("/html/login_startup.html");
    }
    catch(e){
        console.error(e);
        window.alert("Can't register. Ethereum account or Email id is already registered!");
    }
}

providerSignUpForm.onsubmit = () => {
    providerSignUp(); 
    return false;
}
