var Chain2Connect = artifacts.require("./Chain2Connect.sol");

contract("Chain2Connect", function(accounts){

    it("initialize donorCount with zero", function(){
        return Chain2Connect.deployed().then(function(instance){
            return instance.donorCount();
        }).then(function(count){
            assert.equal(count,0);
        })
    });
});