import {app} from './app.js';

const benSignUpForm = document.getElementById("benSignUpForm");

const generateHash = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const benSignUp = async() => {

    var benName = document.getElementById("benName").value;
    var benMail = document.getElementById("benMail").value;
    var benPass = document.getElementById("benPass").value;
    benPass = await generateHash(benPass);

    try{
        await app.addBeneficiary(benName, benMail, benPass);
        window.alert("Congratulations! Your account has been registered successfully!");
        benSignUpForm.reset();
        window.location.replace("/html/login_page.html");
    }
    catch(e){
        console.error(e);
        window.alert("Can't register. Ethereum account or Email id is already registered!");
    }
}

benSignUpForm.onsubmit = () => {
    benSignUp(); 
    return false;
}