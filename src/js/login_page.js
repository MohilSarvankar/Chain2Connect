import {app} from './app.js';

const loginForm = document.getElementById("loginForm");

const generateHash = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

const userLogin = async() => {

    var userMail = document.getElementById("userMail").value;
    var userPass = document.getElementById("userPass").value;
    var userOption = document.getElementById("userOption").value;
    var ethAccount = document.getElementById("ethAccount").value;
    userPass = await generateHash(userPass);

    if(userOption == "1"){
        //Donor Login
        var user = await app.users(ethAccount);
        var userType = user[0].toNumber();
        var userId = user[1].toNumber();

        if(userType == 0){
            //Ethereum account not registered
            document.getElementById("ethInvalid").innerText = "This Ethereum Account is not registered";
            setTimeout(() => {
                document.getElementById("ethInvalid").innerText = "";
            }, 2000);
        }
        else if(userType == 1){
            var donor = await app.donors(userId);
            var donorMail = donor[2];
            var donorPass = donor[3];

            if(userMail == donorMail){
                if(userPass == donorPass){
                    //Donor Login Successful
                    loginForm.reset();
                    window.location.replace("/html/donor.html");
                }
                else{
                    //Wrong password
                    document.getElementById("passInvalid").innerText = "Invalid Password";
                    setTimeout(() => {
                        document.getElementById("passInvalid").innerText = "";
                    }, 2000);
                }
            }
            else{
                //Wrong Email Id
                document.getElementById("mailInvalid").innerText = "Invalid Email";
                setTimeout(() => {
                    document.getElementById("mailInvalid").innerText = "";
                }, 2000);
            }
        }
        else{
            //Wrong user type
            document.getElementById("typeInvalid").innerText = "This usertype is not associated with current ethreuem account";
            setTimeout(() => {
                document.getElementById("typeInvalid").innerText = "";
            }, 2000);
        }
    }

    else if(userOption == "2"){
        //NGO Login
        var user = await app.users(ethAccount);
        var userType = user[0].toNumber();
        var userId = user[1].toNumber();

        if(userType == 0){
            //Ethereum account not registered
            document.getElementById("ethInvalid").innerText = "This Ethereum Account is not registered";
            setTimeout(() => {
                document.getElementById("ethInvalid").innerText = "";
            }, 2000);
        }
        else if(userType == 2){
            var ngo = await app.ngos(userId);
            var ngoMail = ngo[2];
            var ngoPass = ngo[3];

            if(userMail == ngoMail){
                if(userPass == ngoPass){
                    //NGO Login Successful
                    loginForm.reset();
                    window.location.replace("/html/ngo.html");
                }
                else{
                    //Wrong password
                    document.getElementById("passInvalid").innerText = "Invalid Password";
                    setTimeout(() => {
                        document.getElementById("passInvalid").innerText = "";
                    }, 2000);
                }
            }
            else{
                //Wrong Email Id
                document.getElementById("mailInvalid").innerText = "Invalid Email";
                setTimeout(() => {
                    document.getElementById("mailInvalid").innerText = "";
                }, 2000);
            }
        }
        else{
            //Wrong user type
            document.getElementById("typeInvalid").innerText = "This usertype is not associated with current ethreuem account";
            setTimeout(() => {
                document.getElementById("typeInvalid").innerText = "";
            }, 2000);
        }
    }

    else if(userOption == "3"){
        //Cooperative Store Login
        var user = await app.users(ethAccount);
        var userType = user[0].toNumber();
        var userId = user[1].toNumber();

        if(userType == 0){
            //Ethereum account not registered
            document.getElementById("ethInvalid").innerText = "This Ethereum Account is not registered";
            setTimeout(() => {
                document.getElementById("ethInvalid").innerText = "";
            }, 2000);
        }
        else if(userType == 3){
            var store = await app.stores(userId);
            var storeMail = store[2];
            var storePass = store[3];

            if(userMail == storeMail){
                if(userPass == storePass){
                    //Cooperative Store Login Successful
                    loginForm.reset();
                    window.location.replace("/html/store.html");
                }
                else{
                    //Wrong password
                    document.getElementById("passInvalid").innerText = "Invalid Password";
                    setTimeout(() => {
                        document.getElementById("passInvalid").innerText = "";
                    }, 2000);
                }
            }
            else{
                //Wrong Email Id
                document.getElementById("mailInvalid").innerText = "Invalid Email";
                setTimeout(() => {
                    document.getElementById("mailInvalid").innerText = "";
                }, 2000);
            }
        }
        else{
            //Wrong user type
            document.getElementById("typeInvalid").innerText = "This usertype is not associated with current ethreuem account";
            setTimeout(() => {
                document.getElementById("typeInvalid").innerText = "";
            }, 2000);
        }
    }

    else if(userOption == "4"){
        //Beneficiary Login
        var user = await app.users(ethAccount);
        var userType = user[0].toNumber();
        var userId = user[1].toNumber();

        if(userType == 0){
            //Ethereum account not registered
            document.getElementById("ethInvalid").innerText = "This Ethereum Account is not registered";
            setTimeout(() => {
                document.getElementById("ethInvalid").innerText = "";
            }, 2000);
        }
        else if(userType == 4){
            var ben = await app.beneficiaries(userId);
            var benMail = ben[2];
            var benPass = ben[3];

            if(userMail == benMail){
                if(userPass == benPass){
                    //Beneficiary Login Successful
                    loginForm.reset();
                    window.location.replace("/html/beneficiary.html");
                }
                else{
                    //Wrong password
                    document.getElementById("passInvalid").innerText = "Invalid Password";
                    setTimeout(() => {
                        document.getElementById("passInvalid").innerText = "";
                    }, 2000);
                }
            }
            else{
                //Wrong Email Id
                document.getElementById("mailInvalid").innerText = "Invalid Email";
                setTimeout(() => {
                    document.getElementById("mailInvalid").innerText = "";
                }, 2000);
            }
        }
        else{
            //Wrong user type
            document.getElementById("typeInvalid").innerText = "This usertype is not associated with current ethreuem account";
            setTimeout(() => {
                document.getElementById("typeInvalid").innerText = "";
            }, 2000);
        }
    }

    else{
        //Invalid user type
        document.getElementById("typeInvalid").innerText = "Invalid Usertype";
        setTimeout(() => {
            document.getElementById("typeInvalid").innerText = "";
        }, 2000);
    }
}

loginForm.onsubmit = () => {
    userLogin(); 
    return false;
}
