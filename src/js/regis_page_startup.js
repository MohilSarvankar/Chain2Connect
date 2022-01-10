import {app} from './app2.js';

const startSignUpForm = document.getElementById("startSignUpForm");

const generateHash = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const startSignUp = async() => {

    var startName = document.getElementById("startName").value;
    var startMail = document.getElementById("startMail").value;
    var startPass = document.getElementById("startPass").value;
    var startAdd = document.getElementById("startAdd").value;
    var startDesc = document.getElementById("startDesc").value;

    startPass = await generateHash(startPass);

    try{
        await app.addStartup(startName, startMail, startPass, startAdd, startDesc);
        window.alert("Congratulations! Your account has been registered successfully!");
        startSignUpForm.reset();
        window.location.replace("/html/login_startup.html");
    }
    catch(e){
        console.error(e);
        window.alert("Can't register. Ethereum account or Email id is already registered!");
    }
}

startSignUpForm.onsubmit = () => {
    startSignUp(); 
    return false;
}
