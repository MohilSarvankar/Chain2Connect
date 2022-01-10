import {app} from './app2.js';

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
        //Investor Login
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
            var investor = await app.investors(userId);
            var investorMail = investor[2];
            var investorPass = investor[3];

            if(userMail == investorMail){
                if(userPass == investorPass){
                    //Investor Login Successful
                    loginForm.reset();
                    window.location.replace("/html/investor.html");
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
        //Startup Login
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
            var startup = await app.startups(userId);
            var startupMail = startup[2];
            var startupPass = startup[3];

            if(userMail == startupMail){
                if(userPass == startupPass){
                    //Startup Login Successful
                    loginForm.reset();
                    window.location.replace("/html/startup.html");
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
        //Service Provider Login
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
            var provider = await app.providers(userId);
            var providerMail = provider[2];
            var providerPass = provider[3];

            if(userMail == providerMail){
                if(userPass == providerPass){
                    //Service Provider Login Successful
                    loginForm.reset();
                    window.location.replace("/html/service_provider.html");
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
