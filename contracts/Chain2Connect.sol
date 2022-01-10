//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.16;

contract Chain2Connect{
    string public name = "Chain2Connect";
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
    mapping(string => uint8) public mails;
    //1 = used, 0 = not used
    
    mapping(uint => Donor) public donors;
    uint public donorCount;
    
    mapping(uint => Ngo) public ngos;
    uint public ngoCount;
    
    mapping(uint => CoStore) public stores;
    uint public storeCount;
    
    mapping(uint => Beneficiary) public beneficiaries;
    uint public benCount;

    event UserAdded(
        uint id,
        string name,
        string mail
    );
    
    modifier isNewAccount{
        require(users[msg.sender].userType == 0);
        _;
    }
    
    function addDonor(string memory _donorName, string memory _donorMail, string memory _donorPass) public isNewAccount{
        require(mails[_donorMail] == 0);
        donorCount++;
        users[msg.sender].userType = 1;
        users[msg.sender].userId = donorCount;
        mails[_donorMail] = 1;
        donors[donorCount] = Donor(donorCount, _donorName,_donorMail,_donorPass,msg.sender);
        emit UserAdded(donorCount, _donorName, _donorMail);
    }
    
    function addNgo(string memory _ngoName, string memory _ngoMail, string memory _ngoPass, string memory _ngoAdd, string memory _ngoDesc) public isNewAccount{
        require(mails[_ngoMail] == 0);
        ngoCount++;    
        users[msg.sender].userType = 2;
        users[msg.sender].userId = ngoCount;
        mails[_ngoMail] = 1;
        ngos[ngoCount] = Ngo(ngoCount,_ngoName,_ngoMail,_ngoPass,_ngoAdd,_ngoDesc,msg.sender);
        emit UserAdded(ngoCount, _ngoName, _ngoMail);
    }
    
    function addStore(string memory _storeName, string memory _storeMail, string memory _storePass, string memory _storeAdd, string memory _storeDesc) public isNewAccount{
        require(mails[_storeMail] == 0);
        storeCount++;
        users[msg.sender].userType = 3;
        users[msg.sender].userId = storeCount;
        mails[_storeMail] = 1;
        stores[storeCount] = CoStore(storeCount,_storeName,_storeMail,_storePass,_storeAdd,_storeDesc,msg.sender);
        emit UserAdded(storeCount, _storeName, _storeMail);
    }
    
    function addBeneficiary(string memory _benName, string memory _benMail, string memory _benPass) public isNewAccount{
        require(mails[_benMail] == 0);
        benCount++;
        users[msg.sender].userType = 4;
        users[msg.sender].userId = benCount;
        mails[_benMail] = 1;
        beneficiaries[benCount] = Beneficiary(benCount,_benName,_benMail,_benPass,msg.sender);
        emit UserAdded(benCount, _benName, _benMail);
    }

    //step2 additions: adding programs by ngos
    struct Program{
        uint programId;
        uint ngoId;
        string progName;
        string progDesc;
        uint progEnrolls;
        uint currentAmount;
        uint targetAmount;
        bool ongoing;
        uint spentAmount;
    }
    
    modifier onlyNgo{
        require(users[msg.sender].userType == 2);
        _;
    }

    event ProgramAdded(
        uint id,
        string name,
        string desc,
        uint amount
    );
    
    mapping(uint => Program) public programs;
    uint public progCount;
    
    function addProgram(string memory _progName, string memory _progDesc, uint _targetAmount) public onlyNgo{
        progCount++;
        programs[progCount] = Program(progCount,users[msg.sender].userId,_progName,_progDesc,0,0,_targetAmount,true,0);
        emit ProgramAdded(progCount, _progName, _progDesc, _targetAmount);
    }
    
    //step3 additions: enrolling into program by Beneficiary
    struct Enroll{
        uint eId;
        uint benId;
        uint programId;
        bool approved;
    }
    
    mapping(uint => Enroll) public enrollments;
    uint public enrollCount;
    
    modifier onlyBeneficiary{
        require(users[msg.sender].userType == 4);
        _;
    }
    
    function enrollToProgram(uint _programId) public onlyBeneficiary{
        require(programs[_programId].ongoing == true);
        enrollCount++;
        enrollments[enrollCount] = Enroll(enrollCount,users[msg.sender].userId,_programId,false);
        programs[_programId].progEnrolls++;
    }

    //step4 additions: Donating to ngo by donor
    struct Donation{
        uint donationId;
        uint donorId;
        uint programId;
        uint amount;
        string donationDesc;
    }
    
    modifier onlyDonor{
        require(users[msg.sender].userType == 1);
        _;
    }
    
    mapping(uint => Donation) public donations;
    uint public donationCount;
    
    function donateToProgram(uint _programId, string memory _donationDesc) public onlyDonor payable{
        require(programs[_programId].programId != 0 && programs[_programId].ongoing == true);
        uint _amount = msg.value;
        require(_amount > 0);
        
        ngos[programs[_programId].ngoId].ngoAddress.transfer(_amount);
        programs[_programId].currentAmount += _amount;
        donationCount++;
        donations[donationCount] = Donation(donationCount,users[msg.sender].userId,_programId,_amount,_donationDesc);
    }

    //step5 additions: adding products by cooperative stores
    struct Product{
        uint productId;
        string productName;
        string productDetails;
        uint price;
        uint quantity;
        uint storeId;
    }
    
    mapping(uint => Product) public products;
    uint public productCount;
    
    modifier onlyStore{
        require(users[msg.sender].userType == 3);
        _;
    }
    
    function addProduct(string memory _productName, string memory _productDetails, uint _price, uint _quantity) public onlyStore{
        require(_quantity > 0 && _price > 0);
        productCount++;
        products[productCount] = Product(productCount,_productName,_productDetails,_price,_quantity,users[msg.sender].userId);
    }

    //step6 additions: ordering products from store by ngo
    struct Order{
        uint orderId;
        uint programId;
        uint productId;
        uint quantity;
        uint cost;
        bool delivered;
    }
    
    mapping(uint => Order) public orders;
    uint public orderCount;
    
    function placeOrder(uint _programId, uint _productId, uint _quantity) public onlyNgo{
        require(programs[_programId].programId != 0 && programs[_programId].ongoing == true);
        require(products[_productId].productId != 0);
        
        orderCount++;
        products[_productId].quantity -= _quantity;
        uint _cost = _quantity*products[_productId].price;
        orders[orderCount] = Order(orderCount,_programId,_productId,_quantity,_cost,false);
    }
    
    //step7 additions: updating order delivery status by store
    function changeDeliveryStatus(uint _orderId) public onlyStore{
        require(orders[_orderId].orderId != 0);
        orders[_orderId].delivered = true;
    }
    
    //step8 additions: paying to cooperative store after products are delivered
    struct Payment{
        uint paymentId;
        uint orderId;
        uint amount;
        string paymentDesc;
    }
    
    mapping(uint => Payment) public payments;
    uint public paymentCount;
    
    function payToStore(uint _orderId, string memory _paymentDesc) public onlyNgo payable{
        require(orders[_orderId].orderId != 0);
        
        orders[_orderId].delivered = true;
        uint _amount = msg.value;
        stores[products[orders[_orderId].productId].storeId].storeAddress.transfer(_amount);
        
        programs[orders[_orderId].programId].spentAmount += _amount;
        paymentCount++;
        payments[paymentCount] = Payment(paymentCount,_orderId,_amount,_paymentDesc);
    }
    
    //step9 additions: beneficiary giving Feedback
    struct Feedback{
        uint feedId;
        uint eId;
        bool gotProducts;
    }
    
    mapping(uint => Feedback) public feedbacks;
    uint public feedCount;
    
    function addFeedback(uint _eId, bool _gotProducts) public onlyBeneficiary {
        require(enrollments[_eId].eId != 0);
        feedCount++;
        feedbacks[feedCount] = Feedback(feedCount,_eId,_gotProducts);
    }
    
    //step10 additions: removing program by ngo
    function removeProgram(uint _programId) public onlyNgo{
        require(programs[_programId].programId != 0);
        programs[_programId].ongoing = false;
    }
    
    //step11 additions: allowing ngo to control the enrolments
    function approveEnrollment(uint[] memory _eIds, uint n) public onlyNgo{
        for(uint i=0; i<n; i++){
            uint _eId = _eIds[i];
            require(enrollments[_eId].eId != 0);
            enrollments[_eId].approved = true;
        }
    }
    
    function removeEnrollment(uint[] memory _eIds, uint n) public onlyNgo{
        for(uint i=0; i<n; i++){
            uint _eId = _eIds[i];
            require(enrollments[_eId].eId != 0);
            enrollments[_eId].approved = false;
        }
    }
    
}