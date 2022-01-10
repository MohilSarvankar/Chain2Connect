//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.16;

contract CrowdFunding{
    string public name = "CrowdFunding";
    
    //step1 additions: adding all users
    struct Investor{
        uint invId;
        string invName;
        string invMail;
        string invPass;
        address invAddress;
    }
    
    struct Startup{
        uint startId;
        string startName;
        string startMail;
        string startPass;
        string startAdd;
        string startDesc;
        address payable startAddress;
    }
    
    struct Provider{
        uint providerId;
        string providerName;
        string providerMail;
        string providerPass;
        string providerAdd;
        string providerDesc;
        address payable providerAddress;
    }
    
    struct User{
        uint8 userType;
        uint userId;
    }
    
    mapping(address => User) public users;
    // 1=investor, 2=startup, 3=service provider
    mapping(string => uint8) public mails;
    //1 = used, 0 = not used
    
    mapping(uint => Investor) public investors;
    uint public invCount;
    
    mapping(uint => Startup) public startups;
    uint public startCount;
    
    mapping(uint => Provider) public providers;
    uint public providerCount;
    
    event UserAdded(
        uint id,
        string name,
        string mail
    );
    
    modifier isNewAccount{
        require(users[msg.sender].userType == 0);
        _;
    }
    
     function addInvestor(string memory _invName, string memory _invMail, string memory _invPass) public isNewAccount{
        require(mails[_invMail] == 0);
        invCount++;
        users[msg.sender].userType = 1;
        users[msg.sender].userId = invCount;
        mails[_invMail] = 1;
        investors[invCount] = Investor(invCount, _invName,_invMail,_invPass,msg.sender);
        emit UserAdded(invCount, _invName, _invMail);
    }
    
    function addStartup(string memory _startName, string memory _startMail, string memory _startPass, string memory _startAdd, string memory _startDesc) public isNewAccount{
        require(mails[_startMail] == 0);
        startCount++;    
        users[msg.sender].userType = 2;
        users[msg.sender].userId = startCount;
        mails[_startMail] = 1;
        startups[startCount] = Startup(startCount,_startName,_startMail,_startPass,_startAdd,_startDesc,msg.sender);
        emit UserAdded(startCount, _startName, _startMail);
    }
    
    function addProvider(string memory _providerName, string memory _providerMail, string memory _providerPass, string memory _providerAdd, string memory _providerDesc) public isNewAccount{
        require(mails[_providerMail] == 0);
        providerCount++;
        users[msg.sender].userType = 3;
        users[msg.sender].userId = providerCount;
        mails[_providerMail] = 1;
        providers[providerCount] = Provider(providerCount,_providerName,_providerMail,_providerPass,_providerAdd,_providerDesc,msg.sender);
        emit UserAdded(providerCount, _providerName, _providerMail);
    }
    
    modifier onlyInvestor{
        require(users[msg.sender].userType == 1);
        _;
    }

    modifier onlyStartup{
        require(users[msg.sender].userType == 2);
        _;
    }
    
    modifier onlyProvider{
        require(users[msg.sender].userType == 3);
        _;
    }

    //step 2: adding funding request by startups
    struct FundRequest{
        uint requestId;
        uint startId;
        int curRatio;
        int gpRatio;
        int npMargin;
        string arTurnover;
        int totalDebt;
        int burnRate;
        int revGenerated;
        int npAfterTax;
        uint targetFunding;
        uint recievedFunding;
        uint spentFunding;
    }

    event RequestAdded(
        uint reuestId,
        uint startId,
        int curRatio,
        int revGenerated,
        uint targetFunding
    );

    mapping(uint => FundRequest) public requests;
    mapping(address => bool) public startRequests;
    uint public requestCount;

    function addFundRequest(int _curRatio, int _gpRatio, int _npMargin, string memory _arTurnover, int _totalDebt, int _burnRate, int _revGenerated, int _npAfterTax, uint _targetFunding) public onlyStartup {
        require(startRequests[msg.sender] == false);
        requestCount++;
        requests[requestCount] = FundRequest(requestCount,users[msg.sender].userId,_curRatio,_gpRatio,_npMargin,_arTurnover,_totalDebt,_burnRate,_revGenerated,_npAfterTax,_targetFunding,0,0);
        startRequests[msg.sender] = true;
        emit RequestAdded(requestCount, users[msg.sender].userId, _curRatio, _revGenerated, _targetFunding);
    }

    //step 3: investing in startups by investors
    struct Investment{
        uint investId;
        uint invId;
        uint requestId;
        uint amount;
        string investDesc;
    }

    mapping(uint => Investment) public investments;
    uint public investmentCount;

    function investInStartup(uint _requestId, string memory _investDesc) public payable onlyInvestor {
        require(requests[_requestId].requestId != 0);
        uint _amount = msg.value;
        require(_amount > 0);

        startups[requests[_requestId].startId].startAddress.transfer(_amount);
        requests[_requestId].recievedFunding += _amount;
        investmentCount++;
        investments[investmentCount] = Investment(investmentCount,users[msg.sender].userId,_requestId,_amount,_investDesc);
    }

    //step 4: adding services by service providers
    struct Service{
        uint serviceId;
        uint providerId;
        string serviceName;
        string serviceDetails;
        string serviceType;
        uint price;
    }
    
    mapping(uint => Service) public services;
    uint public serviceCount;
    
    function addService(string memory _serviceName, string memory _serviceDetails, string memory _serviceType, uint _price) public onlyProvider{
        require(_price > 0);
        serviceCount++;
        services[serviceCount] = Service(serviceCount,users[msg.sender].userId,_serviceName,_serviceDetails,_serviceType,_price);
    }

    //step 5: ordering services from service provider by startup
    struct Order{
        uint orderId;
        uint requestId;
        uint serviceId;
        bool delivered;
    }
    
    mapping(uint => Order) public orders;
    uint public orderCount;
    
    function placeOrder(uint _serviceId, uint _requestId) public onlyStartup {
        require(services[_serviceId].serviceId != 0);
        orderCount++;
        orders[orderCount] = Order(orderCount,_requestId,_serviceId,false);
    }

    //step 6: changing order status to delivered by service provider
    function changeDeliveryStatus(uint _orderId) public onlyProvider{
        require(orders[_orderId].orderId != 0);
        orders[_orderId].delivered = true;
    }

    //step 7: paying to service provider after service is delivered by startup
    struct Payment{
        uint paymentId;
        uint orderId;
        uint amount;
        string paymentDesc;
    }
    
    mapping(uint => Payment) public payments;
    uint public paymentCount;
    
    function payToProvider(uint _orderId, string memory _paymentDesc) public onlyStartup payable{
        require(orders[_orderId].orderId != 0);
        
        orders[_orderId].delivered = true;
        uint _amount = msg.value;
        providers[services[orders[_orderId].serviceId].providerId].providerAddress.transfer(_amount);
        
        requests[orders[_orderId].requestId].spentFunding += _amount;
        paymentCount++;
        payments[paymentCount] = Payment(paymentCount,_orderId,_amount,_paymentDesc);
    }
}