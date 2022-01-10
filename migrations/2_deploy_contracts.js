var Chain2Connect = artifacts.require("./Chain2Connect.sol");
var CrowdFunding = artifacts.require("./CrowdFunding.sol");

module.exports = function(deployer) {
  deployer.deploy(Chain2Connect);
  deployer.deploy(CrowdFunding);
};