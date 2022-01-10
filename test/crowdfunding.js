var CrowdFunding = artifacts.require("./CrowdFunding.sol");

contract("CrowdFunding", (accounts) => {
    let app

    before(async () => {
        app = await CrowdFunding.new()
    })

    //Checking contract deployment
    describe("Contract deployment", async () => {
        it("deployed with proper name", async () => {
            var name = await app.name()
            assert.equal(name,"CrowdFunding")
        })
    })

    //Checking count initialization
    describe("Count initialization", async () => {
        it("All counts are initialized with zero", async () => {
            var invCount = await app.invCount()
            var startCount = await app.startCount()
            var providerCount = await app.providerCount()
            var requestCount = await app.requestCount()
            var investmentCount = await app.investmentCount()
            var serviceCount = await app.serviceCount()
            var orderCount = await app.orderCount()
            var paymentCount = await app.paymentCount()

            assert.equal(invCount,0,"contains right invCount")
            assert.equal(startCount,0,"contains right startCount")
            assert.equal(providerCount,0,"contains right providerCount")
            assert.equal(requestCount,0,"contains right requestCount")
            assert.equal(investmentCount,0,"contains right investmentCount")
            assert.equal(serviceCount,0,"contains right serviceCount")
            assert.equal(orderCount,0,"contains right orderCount")
            assert.equal(paymentCount,0,"contains right paymentCount")
        })
    })

    //Checking whether we are able to add the users or not
    describe("Adding Users", async () => {
        it("Investors can be added successfully", async () => {
            var result = await app.addInvestor("investor","investor@gmail.com","investor123")
            var invCount = await app.invCount()
            assert.equal(invCount,1,"contains right invCount")

            var event = result.logs[0].args
            assert.equal(event.id.toNumber(),1,"correct id")
            assert.equal(event.name,"investor","correct name")
            assert.equal(event.mail,"investor@gmail.com","correct mail")
        })

        it("Startups can be added successfully", async () => {
            var result = await app.addStartup("startup","startup@gmail.com","startup123","startupAddress","startupDescription",{from: accounts[1]})
            var startCount = await app.startCount()
            assert.equal(startCount,1,"contains right startCount")

            var event = result.logs[0].args
            assert.equal(event.id.toNumber(),1,"correct id")
            assert.equal(event.name,"startup","correct name")
            assert.equal(event.mail,"startup@gmail.com","correct mail")
        })

        it("Service providers can be added successfully", async () => {
            var result = await app.addProvider("provider","provider@gmail.com","provider123","providerAddress","providerDescription",{from: accounts[2]})
            var providerCount = await app.providerCount()
            assert.equal(providerCount,1,"contains right providerCount")

            var event = result.logs[0].args
            assert.equal(event.id.toNumber(),1,"correct id")
            assert.equal(event.name,"provider","correct name")
            assert.equal(event.mail,"provider@gmail.com","correct mail")
        })
    })
    
    //Checking whether we are able to add the funding request or not
    describe("Adding funding request", async () => {
        it("Funding request can be added successfully", async () => {
            var result = await app.addFundRequest(1000,2000,65,"5:1",200000,45,1000000,500000,10000000,{from: accounts[1]})
            var requestCount = await app.requestCount()
            assert.equal(requestCount,1,"contains right requestCount")

            var event = result.logs[0].args
            assert.equal(event.reuestId.toNumber(),1,"correct request id")
            assert.equal(event.startId.toNumber(),1,"correct startup id")
            assert.equal(event.curRatio.toNumber(),1000,"correct current ratio")
            assert.equal(event.revGenerated.toNumber(),1000000,"correct revenue gnerated")
            assert.equal(event.targetFunding.toNumber(),10000000,"correct target funding")
        })   
    })

    //chwcking whether investors can invest in the startups or not
    describe("Investing in startups", async () => {
        it("Investor can invest in startup successfully", async () => {
            await app.investInStartup(1,"investmentDescription",{from: accounts[0], value: 1000})
            var investmentCount = await app.investmentCount()
            assert.equal(investmentCount,1,"contains right investmentCount")

            var investment = await app.investments(1)
            assert.equal(investment[0].toNumber(),1,"correct investId")
            assert.equal(investment[1].toNumber(),1,"correct invId")
            assert.equal(investment[2].toNumber(),1,"correct requestId")
            assert.equal(investment[3].toNumber(),1000,"correct invested amount")
            assert.equal(investment[4],"investmentDescription","correct investment description")
        })
        
        it("Recieved funding of startup updated successfully", async () => {
            var request = await app.requests(1)
            assert.equal(request[11].toNumber(),1000,"correct recieved funding")
        })
    })

    //checking whether service providers are able to add services or not
    describe("Adding Services", async () => {
        it("Services can be added successfully", async () => {
            await app.addService("service","serviceDetails","serviceType",1000,{from: accounts[2]})
            var serviceCount = await app.serviceCount()
            assert.equal(serviceCount,1,"contains right serviceCount")

            var service = await app.services(1)
            assert.equal(service[0].toNumber(),1,"correct service id")
            assert.equal(service[1].toNumber(),1,"correct provider id")
            assert.equal(service[2],"service","correct service name")
            assert.equal(service[3],"serviceDetails","correct service detail")
            assert.equal(service[4],"serviceType","correct service type")
            assert.equal(service[5].toNumber(),1000,"correct service price")
        })   
    })
    
    //checking whether startups can order services or not
    describe("Ordering Services", async () => {
        it("Services can be ordered successfully", async () => {
            await app.placeOrder(1,1,{from: accounts[1]})
            var orderCount = await app.orderCount()
            assert.equal(orderCount,1,"contains right orderCount")

            var order = await app.orders(1)
            assert.equal(order[0].toNumber(),1,"correct order id")
            assert.equal(order[1].toNumber(),1,"correct request id")
            assert.equal(order[2].toNumber(),1,"correct service id")
            assert.equal(order[3],false,"correct delivery status")
        })   

        it("Service provider can update delivery status successfully", async () => {
            await app.changeDeliveryStatus(1,{from: accounts[2]})
            var order = await app.orders(1)
            assert.equal(order[3],true,"correct delivery status")
        })
    })

    //chceking payment of orders by startups
    describe("Paying for orders", async () => {
        it("Payment for orders can be done successfully", async () => {
            await app.payToProvider(1,"paymentDescription",{from: accounts[1], value:1000})
            var paymentCount = await app.paymentCount()
            assert.equal(paymentCount,1,"contains right paymentCount")

            var payment = await app.payments(1)
            assert.equal(payment[0].toNumber(),1,"correct payment id")
            assert.equal(payment[1].toNumber(),1,"correct order id")
            assert.equal(payment[2].toNumber(),1000,"correct amount")
            assert.equal(payment[3],"paymentDescription","correct payment description")
        })

        it("Spent funding of startup updated successfully", async () => {
            var request = await app.requests(1)
            assert.equal(request[12].toNumber(),1000,"correct recieved funding")
        })
    })
});



