import {app} from './app.js';

const ngoSignUpForm = document.getElementById("ngoSignUpForm");

const generateHash = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const ngoSignUp = async() => {

    var ngoName = document.getElementById("ngoName").value;
    var ngoMail = document.getElementById("ngoMail").value;
    var ngoPass = document.getElementById("ngoPass").value;
    var ngoAdd = document.getElementById("ngoAdd").value;
    var ngoDesc = document.getElementById("ngoDesc").value;

    ngoPass = await generateHash(ngoPass);

    try{
        await app.addNgo(ngoName, ngoMail, ngoPass, ngoAdd, ngoDesc);
        window.alert("Congratulations! Your account has been registered successfully!");
        ngoSignUpForm.reset();
        window.location.replace("/html/login_page.html");
    }
    catch(e){
        console.error(e);
        window.alert("Can't register. Ethereum account or Email id is already registered!");
    }
}

ngoSignUpForm.onsubmit = () => {
    ngoSignUp(); 
    return false;
}
