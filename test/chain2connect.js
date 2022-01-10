var Chain2Connect = artifacts.require("./Chain2Connect.sol");

contract("Chain2Connect", (accounts) => {
    let app

    before(async () => {
        app = await Chain2Connect.new()
    })

    //Checking contract deployment
    describe("Contract deployment", async () => {
        it("deployed with proper name", async () => {
            var name = await app.name()
            assert.equal(name,"Chain2Connect")
        })
    })

    //Checking count initialization
    describe("Count initialization", async () => {
        it("All counts are initialized with zero", async () => {
            var donorCount = await app.donorCount()
            var ngoCount = await app.ngoCount()
            var storeCount = await app.storeCount()
            var benCount = await app.benCount()
            var progCount = await app.progCount()
            var enrollCount = await app.enrollCount()
            var donationCount = await app.donationCount()
            var productCount = await app.productCount()
            var orderCount = await app.orderCount()
            var paymentCount = await app.paymentCount()
            var feedCount = await app.feedCount()

            assert.equal(donorCount,0,"contains right donorCount")
            assert.equal(ngoCount,0,"contains right ngoCount")
            assert.equal(storeCount,0,"contains right storeCount")
            assert.equal(benCount,0,"contains right benCount")
            assert.equal(progCount,0,"contains right progCount")
            assert.equal(enrollCount,0,"contains right enrollCount")
            assert.equal(donationCount,0,"contains right donationCount")
            assert.equal(productCount,0,"contains right productCount")
            assert.equal(orderCount,0,"contains right orderCount")
            assert.equal(paymentCount,0,"contains right paymentCount")
            assert.equal(feedCount,0,"contains right feedCount")
        })
    })

    //Checking whether we are able to add the users or not
    describe("Adding Users", async () => {
        it("Donors can be added successfully", async () => {
            var result = await app.addDonor("donor1","donor@gmail.com","donorPassword")
            var donorCount = await app.donorCount()
            assert.equal(donorCount,1,"contains right donorCount")

            var event = result.logs[0].args
            assert.equal(event.id.toNumber(),1,"correct id")
            assert.equal(event.name,"donor1","correct name")
            assert.equal(event.mail,"donor@gmail.com","correct mail")
        })

        it("NGOs can be added successfully", async () => {
            var result = await app.addNgo("ngo1","ngo@gmail.com","ngoPassword","ngoAddress","ngoDescription",{from: accounts[1]})
            var ngoCount = await app.ngoCount()
            assert.equal(ngoCount,1,"contains right ngoCount")

            var event = result.logs[0].args
            assert.equal(event.id.toNumber(),1,"correct id")
            assert.equal(event.name,"ngo1","correct name")
            assert.equal(event.mail,"ngo@gmail.com","correct mail")
        })

        it("Stores can be added successfully", async () => {
            var result = await app.addStore("store1","store@gmail.com","storePassword","storeAddress","storeDescription",{from: accounts[2]})
            var storeCount = await app.storeCount()
            assert.equal(storeCount,1,"contains right storeCount")

            var event = result.logs[0].args
            assert.equal(event.id.toNumber(),1,"correct id")
            assert.equal(event.name,"store1","correct name")
            assert.equal(event.mail,"store@gmail.com","correct mail")
        })

        it("Beneficiaries can be added successfully", async () => {
            var result = await app.addBeneficiary("ben1","ben@gmail.com","benPassword",{from: accounts[3]});
            var benCount = await app.benCount()
            assert.equal(benCount,1,"contains right benCount")

            var event = result.logs[0].args
            assert.equal(event.id.toNumber(),1,"correct id")
            assert.equal(event.name,"ben1","correct name")
            assert.equal(event.mail,"ben@gmail.com","correct mail")
        })
    })
    
    //Checking whether we are able to add the programs or not
    describe("Adding programs", async () => {
        it("Programs can be added successfully", async () => {
            var result = await app.addProgram("program1","program description",10000,{from: accounts[1]})
            var progCount = await app.progCount()
            assert.equal(progCount,1,"contains right progCount")

            var event = result.logs[0].args
            assert.equal(event.id.toNumber(),1,"correct program id")
            assert.equal(event.name,"program1","correct program name")
            assert.equal(event.desc,"program description","correct program description")
            assert.equal(event.amount,10000,"correct target amount")
        })
    })

    //checking whether beneficiary can enroll into program
    describe("Program enrollments", async () => {
        it("Beneficiary can enroll into program successfully", async () => {
            await app.enrollToProgram(1,{from: accounts[3]})
            var enrollCount = await app.enrollCount()
            assert.equal(enrollCount,1,"contains right enrollCount")

            var enroll = await app.enrollments(1);
            assert.equal(enroll[0].toNumber(),1,"correct enroll id")
            assert.equal(enroll[1].toNumber(),1,"correct ben id")
            assert.equal(enroll[2].toNumber(),1,"correct program id")
            assert.equal(enroll[3],false,"correct approvement status")
        })

        it("Number of enrollments in program updated successfully", async () => {
            var program = await app.programs(1);
            assert.equal(program[4].toNumber(),1,"correct number of enrollments")
        })

        it("Enrollment can be approved by NGO successfully", async () => {
            await app.approveEnrollment([1],1,{from: accounts[1]})
            var enroll = await app.enrollments(1);
            assert.equal(enroll[3],true,"correct approvement status")
        })

        it("Enrollment can be rejected by NGO successfully", async () => {
            await app.removeEnrollment([1],1,{from: accounts[1]})
            var enroll = await app.enrollments(1);
            assert.equal(enroll[3],false,"correct approvement status")
        })
    })

    //checking whether donor can donate to program or not
    describe("Program donations", async () => {
        it("Donors can donate to program successfully", async () => {
            await app.donateToProgram(1,"donationDescription",{from: accounts[0], value: 1000})
            var donationCount = await app.donationCount()
            assert.equal(donationCount,1,"contains right donationCount")

            var donation = await app.donations(1);
            assert.equal(donation[0].toNumber(),1,"correct donation id")
            assert.equal(donation[1].toNumber(),1,"correct donor id")
            assert.equal(donation[2].toNumber(),1,"correct program id")
            assert.equal(donation[3].toNumber(),1000,"correct donation amount")
            assert.equal(donation[4],"donationDescription","correct donation description")
        })

        it("Current amount of program updated successfully", async () => {
            var program = await app.programs(1);
            assert.equal(program[5].toNumber(),1000,"correct current amount")
        })
    })

    //checking whether stores can add products or not
    describe("Product addition", async () => {
        it("Stores can add products successfully", async () => {
            await app.addProduct("product","productDetails",10,20,{from: accounts[2]})
            var productCount = await app.productCount()
            assert.equal(productCount,1,"contains right productCount")

            var product = await app.products(1);
            assert.equal(product[0].toNumber(),1,"correct product id")
            assert.equal(product[1],"product","correct product name")
            assert.equal(product[2],"productDetails","correct product details")
            assert.equal(product[3].toNumber(),10,"correct product price")
            assert.equal(product[4].toNumber(),20,"correct donation quantity")
            assert.equal(product[5].toNumber(),1,"correct store id")
        })
    })

    //checking whether NGO can order products or not
    describe("Product orders", async () => {
        it("NGO can order products successfully", async () => {
            await app.placeOrder(1,1,5,{from: accounts[1]})
            var orderCount = await app.orderCount()
            assert.equal(orderCount,1,"contains right orderCount")

            var order = await app.orders(1);
            assert.equal(order[0].toNumber(),1,"correct order id")
            assert.equal(order[1].toNumber(),1,"correct program id")
            assert.equal(order[2].toNumber(),1,"correct product id")
            assert.equal(order[3].toNumber(),5,"correct product quantity")
            assert.equal(order[4].toNumber(),50,"correct order cost")
            assert.equal(order[5],false,"correct delivery status")
        })

        it("Product quantity updated successfully", async () => {
            var product = await app.products(1);
            assert.equal(product[4].toNumber(),15,"correct product quantity")
        })

        it("Order delivery status updated successfully", async () => {
            await app.changeDeliveryStatus(1,{from: accounts[2]})
            var order = await app.orders(1);
            assert.equal(order[5],true,"correct delivery status")
        })
    })

    //checking whether NGO can pay for orders or not
    describe("Order payment", async () => {
        it("NGO can pay for orders successfully", async () => {
            await app.payToStore(1,"paymentDescription",{from: accounts[1], value:50})
            var paymentCount = await app.paymentCount()
            assert.equal(paymentCount,1,"contains right paymentCount")

            var payment = await app.payments(1);
            assert.equal(payment[0].toNumber(),1,"correct payment id")
            assert.equal(payment[1].toNumber(),1,"correct order id")
            assert.equal(payment[2].toNumber(),50,"correct payment amount")
            assert.equal(payment[3],"paymentDescription","correct payment description")
        })

        it("Spent amount of program updated successfully", async () => {
            var program = await app.programs(1);
            assert.equal(program[8].toNumber(),50,"correct spent amount")
        })
    })

    //checking whether beneficiary can add feedback or not
    describe("Beneficiary feedback", async () => {
        it("Beneficiary can add feedback successfully", async () => {
            await app.addFeedback(1,true,{from: accounts[3]})
            var feedCount = await app.feedCount()
            assert.equal(feedCount,1,"contains right feedCount")

            var feed = await app.feedbacks(1);
            assert.equal(feed[0].toNumber(),1,"correct feedback id")
            assert.equal(feed[1].toNumber(),1,"correct enrollment id")
            assert.equal(feed[2],true,"correct feedback")
        })
    })

    //checking whether NGO can remove program or not
    describe("Program removal", async () => {
        it("NGO can remove program successfully", async () => {
            await app.removeProgram(1,{from: accounts[1]})
            var program = await app.programs(1)
            assert.equal(program[7],false,"correct program ongoing status")
        })
    })
});



