import {app} from './app.js';

const storeSignUpForm = document.getElementById("storeSignUpForm");

const generateHash = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const storeSignUp = async() => {

    var storeName = document.getElementById("storeName").value;
    var storeMail = document.getElementById("storeMail").value;
    var storePass = document.getElementById("storePass").value;
    var storeAdd = document.getElementById("storeAdd").value;
    var storeDesc = document.getElementById("storeDesc").value;

    storePass = await generateHash(storePass);

    try{
        await app.addStore(storeName, storeMail, storePass, storeAdd, storeDesc);
        window.alert("Congratulations! Your account has been registered successfully!");
        storeSignUpForm.reset();
        window.location.replace("/html/login_page.html");
    }
    catch(e){
        console.error(e);
        window.alert("Can't register. Ethereum account or Email id is already registered!");
    }
}

storeSignUpForm.onsubmit = () => {
    storeSignUp(); 
    return false;
}


