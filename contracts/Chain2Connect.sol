//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.16;

contract Chain2Connect{
    //step1 additions: adding all users
    struct Donor{
        uint donorId;
        string donorName;
        string donorMail;
        string donorPass;
        address donorAddress;
    }
    
    struct Ngo{
        uint ngoId;
        string ngoName;
        string ngoMail;
        string ngoPass;
        string ngoAdd;
        string ngoDesc;
        address payable ngoAddress;
    }
    
    struct CoStore{
        uint storeId;
        string storeName;
        string storeMail;
        string storePass;
        string storeAdd;
        string storeDesc;
        address payable storeAddress;
    }
    
    struct Beneficiary{
        uint benId;
        string benName;
        string benMail;
        string benPass;
        address benAddress;
    }
    
    struct User{
        uint8 userType;
        uint userId;
    }
    
    mapping(address => User) public users;
    // 1=donor, 2=ngo, 3=co-operative store, 4=beneficiary
    
    mapping(uint => Donor) public donors;
    uint public donorCount;
    
    mapping(uint => Ngo) public ngos;
    uint public ngoCount;
    
    mapping(uint => CoStore) public stores;
    uint public storeCount;
    
    mapping(uint => Beneficiary) public beneficiaries;
    uint public benCount;
    
    modifier isNewAccount{
        require(users[msg.sender].userType == 0);
        _;
    }
    
    function addDonor(string memory _donorName, string memory _donorMail, string memory _donorPass) public isNewAccount{
        donorCount++;
        users[msg.sender].userType = 1;
        users[msg.sender].userId = donorCount;
        donors[donorCount] = Donor(donorCount, _donorName,_donorMail,_donorPass,msg.sender);
    }
    
    function addNgo(string memory _ngoName, string memory _ngoMail, string memory _ngoPass, string memory _ngoAdd, string memory _ngoDesc) public isNewAccount{
        ngoCount++;    
        users[msg.sender].userType = 2;
        users[msg.sender].userId = ngoCount;
        ngos[ngoCount] = Ngo(ngoCount,_ngoName,_ngoMail,_ngoPass,_ngoAdd,_ngoDesc,msg.sender);
    }
    
    function addStore(string memory _storeName, string memory _storeMail, string memory _storePass, string memory _storeAdd, string memory _storeDesc) public isNewAccount{
        storeCount++;
        users[msg.sender].userType = 3;
        users[msg.sender].userId = storeCount;
        stores[storeCount] = CoStore(storeCount,_storeName,_storeMail,_storePass,_storeAdd,_storeDesc,msg.sender);
    }
    
    function addBeneficiary(string memory _benName, string memory _benMail, string memory _benPass) public isNewAccount{
        benCount++;
        users[msg.sender].userType = 4;
        users[msg.sender].userId = benCount;
        beneficiaries[benCount] = Beneficiary(benCount,_benName,_benMail,_benPass,msg.sender);
    }
    
}